import { NDISService } from '../types';

export const SERVICES_DATA: NDISService[] = [
  {
    id: 'sil',
    title: 'Supported Independent Living (SIL)',
    shortDescription: '24/7 personalized care in shared, modern homes designed to build your independence.',
    fullDescription: 'Supported Independent Living (SIL) is help with daily tasks to help you live as independently as possible. It is designed for individuals who require 24/7 active support in a shared or private home environment. Our warm and trained support workers help with personal care, preparing meals, managing medication, cleaning, and attending appointments.',
    ndisCategory: 'Core Supports - Assistance with Daily Life',
    iconName: 'Home',
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
    fullDescription: 'Inspired by modern Community Hub models, Synergy Care Link provides daily group-based programs and social outings that promote skill-building and friendship. From cooking classes and arts & crafts to technology workshops, beach days, and sports, our hubs are inclusive, exciting environments where clients can shine.',
    ndisCategory: 'Core Supports - Assistance with Social, Economic & Community Participation',
    iconName: 'Users',
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
    title: 'In-Home Care & Individual Support',
    shortDescription: 'One-on-one assistance inside your own home to maintain your preferred lifestyle.',
    fullDescription: 'If you prefer living in your own private home but need some assistance to manage daily chores and stay safe, our In-Home Support service is perfect. We match you with support workers who share your interests, assisting with household tasks, light cooking, shopping, personal hygiene, and companionship.',
    ndisCategory: 'Core Supports - Assistance with Daily Life',
    iconName: 'HeartHandshake',
    features: [
      'Personal care (showering, dressing, grooming)',
      'Domestic assistance (cleaning, laundry, decluttering)',
      'Meal preparation according to dietary preferences',
      'Companionship, conversation, and reading assistance',
      'Flexible scheduling from 2 hours a week to daily visits'
    ],
    pricingGuide: 'Funded under NDIS Core Supports (Assistance with Daily Life / Self Care).'
  },
  {
    id: 'sda',
    title: 'Specialist Disability Accommodation (SDA)',
    shortDescription: 'Specially constructed, state-of-the-art housing with physical adaptations for high care needs.',
    fullDescription: 'For participants who require specialized physical housing solutions due to high support needs, we connect and partner to provide premium Specialist Disability Accommodation (SDA). Our high-physical-support homes feature robust automation, assistive technology, wide doorways, structural supports, and on-site emergency care facilities.',
    ndisCategory: 'Capital Supports - Specialist Disability Accommodation',
    iconName: 'Key',
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
    fullDescription: 'Synergy Care Link believes that recreation is key to wellness. We organize regular weekend socials, dynamic interest-based clubs (such as bowling, cinema, and dining), and hosted holiday retreats where participants can travel to new places, camp, and experience adventures with trained carer support.',
    ndisCategory: 'Core Supports - Social & Community Participation',
    iconName: 'Sparkles',
    features: [
      'Supported weekend social dinners and club activities',
      'Supported travel, campouts, and holiday retreats',
      'Specialist sports groups (Wheelchair sports, swimming)',
      'Annual galas, themed dances, and client celebrations',
      'Peer mentorship and self-advocacy training groups'
    ],
    pricingGuide: 'Funded under Core Supports (Community Participation) or Capacity Building (Social & Community).'
  }
];
