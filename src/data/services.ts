import { NDISService } from '../types';

export const SERVICES_DATA: NDISService[] = [
  // NDIS Core & Capacity Building Services
  {
    id: 'sil',
    title: 'Supported Independent Living (SIL)',
    shortDescription: '24/7 personalized care in shared, modern homes designed to build your independence.',
    fullDescription: 'Supported Independent Living (SIL) is help with daily tasks to help you live as independently as possible. It is designed for individuals who require 24/7 active support in a shared or private home environment. Our warm and trained support workers help with personal care, preparing meals, managing medication, cleaning, and attending appointments.',
    ndisCategory: 'Core Supports - Assistance with Daily Life',
    iconName: 'Home',
    programType: 'ndis',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
    features: [
      'Fully furnished, high-accessibility homes',
      '24/7 dedicated and trained support staff on site',
      'Personal care, meal prep, and nutrition plans',
      'Active community integration and travel planning',
      'Goal-oriented independent skill development'
    ],
    pricingGuide: 'Funded under NDIS Core Supports (Assistance with Daily Life). Rates follow the latest NDIS Price Guide.'
  },
  {
    id: 'community-hubs',
    title: 'Community Access & Day Hubs',
    shortDescription: 'Exciting, group-based hubs and outings to learn skills, make lifelong friends, and connect.',
    fullDescription: 'Inspired by modern Community Hub models, Synergy CareLink provides daily group-based programs and social outings that promote skill-building and friendship. From cooking classes and arts & crafts to technology workshops, beach days, and sports, our hubs are inclusive, exciting environments where clients can shine.',
    ndisCategory: 'Core Supports - Social & Community Participation',
    iconName: 'Users',
    programType: 'ndis',
    imageUrl: '/src/assets/images/community_hub_group_1786006280169.jpg',
    features: [
      'Tailored workshops (Cooking, Art, Music, Woodwork)',
      'Digital literacy and technology programs',
      'Regular community outings and day trips',
      'Sensory-friendly relaxation and therapy rooms',
      'Transportation to and from hubs provided'
    ],
    pricingGuide: 'Funded under NDIS Core Supports (Group and Centre-Based Activities).'
  },
  {
    id: 'support-coordination',
    title: 'Support Coordination',
    shortDescription: 'Expert guidance to understand your NDIS plan, connect with services, and achieve your goals.',
    fullDescription: 'Navigating the NDIS can be complex. Our dedicated Support Coordinators are advocates who work alongside you to interpret your NDIS plan, identify the best service providers, manage service agreements, and prepare you for plan reviews. We handle the paperwork and logistics so you can focus on thriving.',
    ndisCategory: 'Capacity Building - Support Coordination',
    iconName: 'Compass',
    programType: 'ndis',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    features: [
      'Dedicated NDIS experts matching you with ideal services',
      'Assistance setting up service agreements and portals',
      'Preparation and coaching for NDIS annual plan reviews',
      'Coordination of multiple clinical or therapy providers',
      'Crisis support and accommodation plan navigation'
    ],
    pricingGuide: 'Funded under NDIS Capacity Building (Support Coordination Level 1 & 2).'
  },
  {
    id: 'in-home-care',
    title: 'In-Home Care & Personal Support',
    shortDescription: 'One-on-one assistance inside your own home to maintain your preferred lifestyle.',
    fullDescription: 'If you prefer living in your own private home but need assistance to manage daily chores and stay safe, our In-Home Support service is perfect. We match you with support workers who share your interests, assisting with household tasks, light cooking, shopping, personal hygiene, and companionship.',
    ndisCategory: 'Core Supports - Assistance with Daily Life',
    iconName: 'HeartHandshake',
    programType: 'both',
    imageUrl: '/src/assets/images/in_home_care_support_1786006291768.jpg',
    features: [
      'Personal care (showering, dressing, grooming)',
      'Domestic assistance (cleaning, laundry, decluttering)',
      'Meal preparation according to dietary preferences',
      'Companionship, conversation, and reading assistance',
      'Flexible scheduling from 2 hours a week to daily visits'
    ],
    pricingGuide: 'Funded under NDIS Core Supports or Support at Home Care Packages.'
  },
  {
    id: 'sda',
    title: 'Specialist Disability Accommodation (SDA)',
    shortDescription: 'Specially constructed, state-of-the-art housing with physical adaptations for high care needs.',
    fullDescription: 'For participants who require specialized physical housing solutions due to high support needs, we connect and partner to provide premium Specialist Disability Accommodation (SDA). Our high-physical-support homes feature robust automation, assistive technology, wide doorways, structural supports, and on-site emergency care facilities.',
    ndisCategory: 'Capital Supports - Specialist Disability Accommodation',
    iconName: 'Key',
    programType: 'ndis',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    features: [
      'High Physical Support standard design',
      'Smart home automation (doors, lights, climate control)',
      'Emergency ceiling hoist ready structural setups',
      'Wheelchair friendly level access transitions throughout',
      'In-built Onsite Overnight Assistance (OOA) rooms'
    ],
    pricingGuide: 'Subject to SDA funding approval in your NDIS Plan. Rental contribution is typically capped.'
  },
  {
    id: 'rec-social',
    title: 'Social & Recreational Programs',
    shortDescription: 'Weekend activities, holiday retreats, and adventure sports designed for active fun.',
    fullDescription: 'Synergy CareLink believes that recreation is key to wellness. We organize regular weekend socials, dynamic interest-based clubs (such as bowling, cinema, and dining), and hosted holiday retreats where participants can travel to new places, camp, and experience adventures with trained carer support.',
    ndisCategory: 'Core Supports - Social & Community Participation',
    iconName: 'Sparkles',
    programType: 'ndis',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    features: [
      'Supported weekend social dinners and club activities',
      'Supported travel, campouts, and holiday retreats',
      'Specialist sports groups (Wheelchair sports, swimming)',
      'Annual galas, themed dances, and client celebrations',
      'Peer mentorship and self-advocacy training groups'
    ],
    pricingGuide: 'Funded under Core Supports (Community Participation) or Capacity Building (Social & Community).'
  },

  // Support at Home Care Services
  {
    id: 'sah-nursing',
    title: 'Support at Home - Clinical & Nursing Care',
    shortDescription: 'Registered Nurse visits for clinical monitoring, wound management, and health support at home.',
    fullDescription: 'Under the Australian Support at Home aged care framework, our Registered Nurses deliver professional clinical care directly in your home. Services include wound dressing changes, chronic condition management, post-hospital discharge transition care, medication administration, and health monitoring.',
    ndisCategory: 'Support at Home - Clinical & Health Care',
    iconName: 'Stethoscope',
    programType: 'support_at_home',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    features: [
      'Registered Nurse (RN) clinical visits & health assessments',
      'Wound management & dressing changes',
      'Medication setup, administration & monitoring',
      'Post-acute hospital transition care',
      'Diabetes & chronic condition management'
    ],
    pricingGuide: 'Funded under Australian Government Support at Home Care Packages.'
  },
  {
    id: 'sah-personal',
    title: 'Support at Home - Personal Care & Hygiene',
    shortDescription: 'Respectful, gentle assistance with showering, mobility, grooming, and dressing in your home.',
    fullDescription: 'Maintain your dignity, independence, and comfort in your own home. Our trained personal care workers assist seniors with morning routines, showering, dressing, mobility transfers, continence management, and personal grooming tailored to individual preferences.',
    ndisCategory: 'Support at Home - Independence & Personal Care',
    iconName: 'HeartHandshake',
    programType: 'support_at_home',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
    features: [
      'Assistance with showering, bathing & personal hygiene',
      'Dressing, grooming & personal care support',
      'Safe mobility & transfer assistance',
      'Morning and evening routine support',
      'Dignified continence management'
    ],
    pricingGuide: 'Funded under Support at Home Care Packages or private fee-for-service.'
  },
  {
    id: 'sah-domestic',
    title: 'Support at Home - Domestic & Housekeeping',
    shortDescription: 'Help around the home with light cleaning, laundry, vacuuming, and fresh meal preparation.',
    fullDescription: 'Keep your home clean, comfortable, and safe without physical strain. Our domestic care team assists with weekly house cleaning, bed linen changes, laundry, dishwashing, grocery shopping, and healthy meal preparation.',
    ndisCategory: 'Support at Home - Everyday Living',
    iconName: 'Home',
    programType: 'support_at_home',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    features: [
      'Regular housekeeping, vacuuming & dusting',
      'Laundry, ironing & linen changes',
      'Nutritious meal planning & cooking',
      'Pantry restocking & grocery shopping support',
      'Home decluttering & safety hazard checks'
    ],
    pricingGuide: 'Funded under Support at Home Care Packages (Everyday Living stream).'
  },
  {
    id: 'sah-allied',
    title: 'Support at Home - Allied Health & Therapies',
    shortDescription: 'In-home Physiotherapy, Occupational Therapy, Podiatry, and mobility equipment advice.',
    fullDescription: 'Stay mobile and prevent falls with specialized in-home allied health. Our team of physiotherapists, occupational therapists, and podiatrists come directly to your home to conduct fall risk assessments, prescribe mobility aids, and deliver rehabilitation exercises.',
    ndisCategory: 'Support at Home - Restoration & Health',
    iconName: 'Activity',
    programType: 'support_at_home',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    features: [
      'In-home Physiotherapy & rehabilitation exercises',
      'Occupational Therapy home safety assessments',
      'Podiatry & foot health care visits',
      'Mobility equipment prescriptions (walkers, ramp advice)',
      'Fall prevention & strength building programs'
    ],
    pricingGuide: 'Funded under Support at Home (Restoration / Allied Health stream).'
  },
  {
    id: 'sah-transport',
    title: 'Support at Home - Transport & Social Outings',
    shortDescription: 'Safe, assisted transport to medical appointments, shopping trips, and community gatherings.',
    fullDescription: 'Stay connected with your community, family, and medical professionals. Our transport support staff drive you safely to medical appointments, community centers, social clubs, family gatherings, or local shopping centers.',
    ndisCategory: 'Support at Home - Community & Outings',
    iconName: 'Car',
    programType: 'support_at_home',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800',
    features: [
      'Assisted transport to GP & specialist appointments',
      'Accompanied grocery shopping & errand runs',
      'Visits to senior social groups & community events',
      'Wheelchair accessible transport options available',
      'Flexible door-to-door escort service'
    ],
    pricingGuide: 'Funded under Support at Home Care Packages.'
  },
  {
    id: 'sah-gardening',
    title: 'Support at Home - Home Repairs & Gardening',
    shortDescription: 'Lawn mowing, garden care, minor repairs, and bathroom safety grab rail installations.',
    fullDescription: 'Ensure your home environment remains safe, functional, and well-maintained. We provide lawn mowing, garden upkeep, minor home maintenance, gutter cleaning, and installation of safety grab rails or non-slip ramps.',
    ndisCategory: 'Support at Home - Home Safety',
    iconName: 'Wrench',
    programType: 'support_at_home',
    imageUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=800',
    features: [
      'Lawn mowing, weeding & garden maintenance',
      'Minor home repairs & light bulb replacements',
      'Installation of bathroom grab rails & ramps',
      'Window cleaning & safety checks',
      'Smoke alarm testing & hazard removal'
    ],
    pricingGuide: 'Funded under Support at Home Care Packages.'
  }
];
