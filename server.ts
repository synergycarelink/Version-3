import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import compression from "compression";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(compression());
app.use(express.json());

// Middleware to log all incoming API requests to a file for live diagnostic tracking
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    const timestamp = new Date().toISOString();
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const logLine = `[${timestamp}] ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms\n`;
      try {
        fs.appendFileSync(path.join(process.cwd(), "server-requests.log"), logLine, "utf8");
      } catch (err) {
        console.error("Failed to write to server-requests.log", err);
      }
    });
  }
  next();
});

// Helper function to log errors to a local file for persistent debugging
function logServerError(context: string, error: any, reqBody?: any) {
  const timestamp = new Date().toISOString();
  const errorMessage = error?.message || String(error);
  const errorStack = error?.stack || "";
  const logContent = `\n[${timestamp}] CONTEXT: ${context}\nERROR: ${errorMessage}\nSTACK: ${errorStack}\nREQ_BODY: ${JSON.stringify(reqBody || {})}\n---------------------------------------\n`;
  try {
    fs.appendFileSync(path.join(process.cwd(), "server-errors.log"), logContent, "utf8");
    console.log(`[Error Logger] Logged error in context "${context}" to server-errors.log`);
  } catch (e) {
    console.error("Failed to write to server-errors.log:", e);
  }
}

// Initialize Gemini with named parameters and a standard User-Agent header for telemetry
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to clean chat contents so they are strictly valid for the Gemini API
function cleanChatContents(contents: any): any {
  if (!Array.isArray(contents) || contents.length === 0) {
    return [{ role: "user", parts: [{ text: "Hello" }] }];
  }

  // 1. Find the first index where role is "user". Gemini requires chat to start with a user message.
  const firstUserIndex = contents.findIndex(item => item.role === "user");
  
  let sliced = contents;
  if (firstUserIndex === -1) {
    // If no user message is found, prepend a default user message to ensure valid chat start
    sliced = [{ role: "user", parts: [{ text: "Hello" }] }, ...contents];
  } else {
    // Slice starting from the first user message
    sliced = contents.slice(firstUserIndex);
  }

  // 2. Ensure strictly alternating roles ("user", "model", "user", "model"...)
  const alternating: any[] = [];
  for (const item of sliced) {
    if (alternating.length === 0) {
      alternating.push({
        role: item.role,
        parts: [...item.parts]
      });
    } else {
      const lastItem = alternating[alternating.length - 1];
      if (lastItem.role === item.role) {
        // Merge text of consecutive items with the same role
        const lastText = lastItem.parts.map((p: any) => p.text).join("\n");
        const newText = item.parts.map((p: any) => p.text).join("\n");
        lastItem.parts = [{ text: `${lastText}\n${newText}` }];
      } else {
        alternating.push({
          role: item.role,
          parts: [...item.parts]
        });
      }
    }
  }

  return alternating;
}

// Helper function to call generateContent with automatic model fallback and retries for maximum reliability
async function callGeminiWithFallback(contents: any, config: any) {
  const cleanedContents = cleanChatContents(contents);
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini API] Attempting call with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: cleanedContents,
        config,
      });
      if (response && response.text) {
        console.log(`[Gemini API] Success with model: ${model}`);
        return response;
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} failed with error:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All fallback models failed.");
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Send Email route
app.post("/api/send-email", async (req, res) => {
  try {
    const referral = req.body;
    if (!referral || !referral.participantName || !referral.referrerEmail) {
      return res.status(400).json({ error: "Missing required referral fields." });
    }

    const {
      id,
      referrerName,
      referrerEmail,
      referrerPhone,
      relationship,
      participantName,
      participantAge,
      participantGender,
      ndisNumber,
      primaryDisability,
      requestedServices,
      preferredContact,
      additionalInfo,
      submittedAt
    } = referral;

    let requestedServicesHtml = "";
    if (requestedServices && Array.isArray(requestedServices) && requestedServices.length > 0) {
      requestedServicesHtml = `
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${requestedServices.map((serviceId: string) => {
            let serviceLabel = serviceId;
            if (serviceId === 'sil') serviceLabel = 'Supported Independent Living (SIL)';
            else if (serviceId === 'community-hubs') serviceLabel = 'Community & Social Hubs';
            else if (serviceId === 'in-home-care') serviceLabel = 'In-Home Care Support';
            else if (serviceId === 'support-coordination') serviceLabel = 'Support Coordination';
            return `<span style="display: inline-block; background-color: #ccfbf1; color: #0f766e; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 12px; margin-right: 6px; margin-bottom: 6px;">${serviceLabel}</span>`;
          }).join('')}
        </div>
      `;
    } else {
      requestedServicesHtml = '<span style="color: #94a3b8; font-style: italic;">No specific services selected</span>';
    }

    let additionalInfoSection = "";
    if (additionalInfo) {
      additionalInfoSection = `
        <div style="background-color: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #1e293b;">Additional Goals & Support Notes</h4>
          <p style="margin: 0; font-size: 12px; color: #475569; white-space: pre-wrap; line-height: 1.5;">${additionalInfo}</p>
        </div>
      `;
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background-color: #0f766e; padding: 24px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">New NDIS Referral Intake</h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #ccfbf1;">Synergy Care Link Portal Submission</p>
        </div>
        <div style="padding: 24px; background-color: #f8fafc;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <tr style="background-color: #f1f5f9;">
              <th colspan="2" style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0;">Participant Details</th>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Name:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${participantName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Age / Gender:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9;">${participantAge || 'Not specified'} years • ${participantGender || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">NDIS Number:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #334155; font-family: monospace; border-bottom: 1px solid #f1f5f9;">${ndisNumber || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Primary Disability:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #334155; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${primaryDisability}</td>
            </tr>
            
            <tr style="background-color: #f1f5f9;">
              <th colspan="2" style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0;">Referrer & Contact Info</th>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Referrer Name:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9;">${referrerName} (${relationship})</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Phone:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9;">${referrerPhone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Email:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #334155; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${referrerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Preferred Contact:</td>
              <td style="padding: 10px 16px; font-size: 13px; color: #334155; text-transform: capitalize; border-bottom: 1px solid #f1f5f9;">${preferredContact || 'Email'}</td>
            </tr>

            <tr style="background-color: #f1f5f9;">
              <th colspan="2" style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0;">Requested Services</th>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px 16px; font-size: 13px; color: #334155;">
                ${requestedServicesHtml}
              </td>
            </tr>
          </table>

          ${additionalInfoSection}

          <div style="font-size: 11px; color: #64748b; text-align: center; margin-top: 20px;">
            Submitted on: ${submittedAt || new Date().toLocaleString()} • ID: ${id || 'N/A'}
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          This is an automated intake notification powered by Synergy Care Link Portal AI.
        </div>
      </div>
    `;

    // Try to send via nodemailer
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");

    if (smtpUser && smtpPass) {
      console.log(`[SMTP] Attempting real email send to synergycarelink@gmail.com using user: ${smtpUser}`);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Synergy Care Link Portal" <${smtpUser}>`,
        to: "synergycarelink@gmail.com",
        subject: `🚨 [New Referral Intake] - ${participantName}`,
        html: emailHtml,
      });

      console.log("[SMTP] Email sent successfully!");
      return res.json({ success: true, method: "smtp" });
    } else {
      console.warn("[SMTP] SMTP credentials (SMTP_USER/SMTP_PASS) are missing. Email simulated and logged to console.");
      console.log("------------------ SIMULATED EMAIL ------------------");
      console.log("TO: synergycarelink@gmail.com");
      console.log(`SUBJECT: 🚨 [New Referral Intake] - ${participantName}`);
      console.log("HTML BODY:", emailHtml);
      console.log("-----------------------------------------------------");
      return res.json({
        success: true,
        method: "mock",
        warning: "SMTP E-mail credentials are not yet configured in AI Studio, so the intake details have been logged to the container terminal instead."
      });
    }
  } catch (error: any) {
    console.error("Email API Route Error:", error);
    res.status(500).json({ error: error.message || "Failed to deliver email" });
  }
});

// Chat route to handle live message exchanges
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemInstruction = `You are 'Synergy Care Link AI', a friendly, compassionate, and highly supportive NDIS Intake Assistant representing Synergy Care Link (a Registered NDIS Provider).
Your goal is to guide the user in a warm, friendly conversation, answer basic NDIS or care questions, and collect their intake/referral details.

Please collect the following information step-by-step (do NOT ask for all at once to prevent user overload):
1. Participant's/Client's Name (or Referrer's name and relationship)
2. Preferred contact information (phone number and email address)
3. Services they are interested in (e.g., In-Home Care, SIL Housing, Community/Social Hubs, Support Coordination)
4. A brief description of their goals, needs, or disability so we can prepare their plan.

Keep your tone very welcoming, clear, and reassuring. Respond in concise, easy-to-read sentences, using bullet points for options when appropriate.
Once they have shared their details, confirm that you can help finalize their request, and that the collected information will be secure, sent straight to synergycarelink@gmail.com, and automatically logged in our secure Referral System. Tell them they can click 'Submit Details' in the chat to save and finalize.`;

    // Map messages to Gemini's content structure
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await callGeminiWithFallback(
      formattedContents,
      {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    );

    const reply = response.text || "I apologize, but I am having trouble connecting right now. Let me know how I can help.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    logServerError("/api/chat", error, req.body);
    res.status(500).json({ error: error.message || "Failed to communicate with AI" });
  }
});

// Extract details from the conversation history to pre-fill or automatically submit
app.post("/api/chat/extract", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const conversationText = messages
      .map((m: any) => `${m.role === "assistant" ? "AI" : "User"}: ${m.content}`)
      .join("\n");

    const response = await callGeminiWithFallback(
      `Below is a conversation with a care seeker. Please extract their NDIS intake and contact details in standard JSON. If a detail is missing, return an empty string for that field.

Fields to extract:
- referrerName: Name of the contact/referrer (can be the same as participant)
- participantName: Name of the participant who needs support
- referrerPhone: Contact phone number
- referrerEmail: Contact email address
- primaryDisability: Any mentioned disability (e.g. Autism, Down Syndrome, ABI, Physical)
- additionalInfo: Summary of care goals, requirements, or schedules discussed
- requestedServices: Match services discussed to these identifiers: 'sil', 'community-hubs', 'in-home-care', 'support-coordination'

Conversation:
${conversationText}
`,
      {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            referrerName: { type: Type.STRING },
            participantName: { type: Type.STRING },
            referrerPhone: { type: Type.STRING },
            referrerEmail: { type: Type.STRING },
            primaryDisability: { type: Type.STRING },
            additionalInfo: { type: Type.STRING },
            requestedServices: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "referrerName",
            "participantName",
            "referrerPhone",
            "referrerEmail",
            "primaryDisability",
            "additionalInfo",
            "requestedServices"
          ]
        }
      }
    );

    const extracted = JSON.parse(response.text || "{}");
    res.json(extracted);
  } catch (error: any) {
    console.error("Extraction API Error:", error);
    logServerError("/api/chat/extract", error, req.body);
    res.status(500).json({ error: error.message || "Failed to extract conversation details" });
  }
});

// Start full-stack server
async function bootstrap() {
  // Vite middleware for development vs static asset serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
});
