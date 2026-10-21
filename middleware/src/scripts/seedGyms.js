import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Gym from '../models/gym.model.js';
import { Employee } from '../models/employee.model.js';
import User from '../models/user.model.js';
import Counter from '../models/counter.model.js';
import { buildStandardCustomPricingPlans } from '../controllers/gym.controller.js';

const SAMPLE_CUSTOMERS = [
  {
    email: 'arun.prakash@gymezy.com',
    fullName: 'Arun Prakash',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500001',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'divya.k@gymezy.com',
    fullName: 'Divya Krishnan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500002',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'meenakshi.s@gymezy.com',
    fullName: 'Meenakshi Sundaram',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500003',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'siddharth.r@gymezy.com',
    fullName: 'Siddharth Rao',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500004',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'karthik.n@gymezy.com',
    fullName: 'Karthik Natesan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500005',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'priya.s@gymezy.com',
    fullName: 'Priya Sundar',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500006',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'rahul.n@gymezy.com',
    fullName: 'Rahul Nair',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500007',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'rohan.s@gymezy.com',
    fullName: 'Rohan Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500008',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'deepa.v@gymezy.com',
    fullName: 'Deepa V',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500009',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
  {
    email: 'pooja.h@gymezy.com',
    fullName: 'Pooja Hegde',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    phone: '+919876500010',
    password: 'Password@123',
    role: 'CUSTOMER',
  },
];

const SEED_GYMS = [
  {
    name: 'FitZone Luxury Gym',
    tagline: 'Elite Strength & Conditioning',
    ownerName: 'Vikram Seth',
    phone: '+91 9876543210',
    email: 'contact@fitzone.com',
    businessType: 'Private Limited',
    address: '14, 2nd Avenue, Block AB',
    fullAddress: 'No. 14, 2nd Avenue, Block AB, Anna Nagar, Chennai, Tamil Nadu - 600040',
    area: 'Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    location: {
      type: 'Point',
      coordinates: [80.2101, 13.085], // [lng, lat]
    },
    rating: 4.9,
    reviewsCount: 328,
    singleSessionPrice: 199,
    pricingPlans: {
      singleSession: 199,
      weeklyPass: 799,
      fiveSessions: 899,
      monthly: 1999,
      quarterly: 4999,
      halfYearly: 8999,
      annual: 14999,
    },
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Top Rated',
    facilities: ['AC Gym', 'Locker Facility', 'Shower Available', 'Steam Room', 'Parking Available', 'Juice Bar'],
    amenities: [
      'Free High-Speed Wi-Fi',
      'Locker Room & Keyed Storage',
      'Hot Showers & Fresh Towels',
      'Steam / Sauna Bath',
      'Valet & Bike Parking',
      'Protein Shake & Juice Bar',
      'Chilled RO Drinking Water',
      'Changing Rooms with Hairdryers',
    ],
    workouts: ['Strength', 'HIIT', 'CrossFit', 'Cardio', 'Personal Training', 'Olympic Lifting'],
    tags: ['Strength', 'HIIT', 'CrossFit', 'Personal Training', 'AC Gym', 'Top Rated'],
    aboutText: 'FitZone Luxury Gym is Anna Nagar’s premier fitness club featuring Olympic barbells, imported cardio suites, steam recovery rooms, and elite certified coaches.',
    rules: [
      'Mandatory clean athletic shoes and workout attire at all times.',
      'Always bring and use a sweat towel on all machines and benches.',
      'Re-rack all dumbbells, barbells, and weight plates after your workout.',
      'Wipe down equipment contact surfaces after finishing each set.',
      'No photography or video recording in locker rooms and shower areas.',
      'Respect gym equipment and fellow members to foster a supportive atmosphere.',
    ],
    safetyMeasures: [
      '24/7 HD CCTV surveillance across all workout floors and entryways.',
      'Certified CPR and First-Aid trained trainers on duty at all times.',
      'Daily UV and antibacterial deep-cleaning of equipment and locker rooms.',
      'Automated External Defibrillator (AED) and emergency medical kit on site.',
      'Touchless hand sanitizer stations placed at every training quadrant.',
      'Clearly demarcated emergency exit routes with battery-backed lighting.',
    ],
    trainers: [
      {
        name: 'Vikram Seth',
        specialty: 'Master Strength Coach & Bodybuilding',
        experienceYears: 9,
        rating: 4.9,
        reviewsCount: 54,
        monthlyFee: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop',
        ratings: [
          {
            rating: 5,
            comment: 'Vikram’s periodized strength program transformed my compound lifts. Outstanding form cues and injury prevention knowledge.',
            bookingType: 'Personal Training',
            date: '5 days ago',
          },
          {
            rating: 5,
            comment: 'Best bodybuilding coach in Chennai. Very disciplined approach to nutrition and biomechanics.',
            bookingType: 'Bodybuilding Prep',
            date: '2 weeks ago',
          },
        ],
      },
      {
        name: 'Sneha Raman',
        specialty: 'CrossFit Level 2 & Functional Trainer',
        experienceYears: 6,
        rating: 4.8,
        reviewsCount: 29,
        monthlyFee: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop',
        ratings: [
          {
            rating: 5,
            comment: 'Sneha makes functional training super fun and accessible for all levels. Love the WOD routines!',
            bookingType: 'CrossFit Group',
            date: '1 week ago',
          },
        ],
      },
      {
        name: 'Kavitha Nair',
        specialty: 'HIIT & Weight Loss Specialist',
        experienceYears: 5,
        rating: 4.9,
        reviewsCount: 38,
        monthlyFee: 2800,
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        ratings: [
          {
            rating: 5,
            comment: 'Kavitha is an incredible HIIT coach! Her high-intensity fat loss circuits helped me shed 7kg in 8 weeks.',
            bookingType: 'Personal Training',
            date: '3 days ago',
          },
          {
            rating: 5,
            comment: 'Super motivating and energetic trainer. Always keeps sessions dynamic and challenging.',
            bookingType: 'HIIT Bootcamp',
            date: '2 weeks ago',
          },
        ],
      },
    ],
    ratings: [
      {
        rating: 5,
        comment: 'Exceptional imported equipment and spacious Olympic lifting area! The steam bath after a workout is amazing.',
        bookingType: 'Monthly Member',
        date: '2 days ago',
      },
      {
        rating: 5,
        comment: 'Trainer Vikram is phenomenal with posture and strength training. Very clean lockers and premium atmosphere.',
        bookingType: 'Annual Member',
        date: '1 week ago',
      },
      {
        rating: 5,
        comment: 'Super seamless QR check-in through GYMEZY! Always sanitized benches and great workout crowd.',
        bookingType: 'Single Session Pass',
        date: '2 weeks ago',
      },
      {
        rating: 4,
        comment: 'Great facility and top-notch cardio machines. Peak hours can be busy around 7 PM.',
        bookingType: 'Quarterly Member',
        date: '3 weeks ago',
      },
    ],
    openingHours: {
      weekdayOpen: '05:30 AM',
      weekdayClose: '10:30 PM',
      weekendOpen: '06:00 AM',
      weekendClose: '09:00 PM',
      displayText: '05:30 AM - 10:30 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
        { day: 'Thursday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
        { day: 'Friday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
        { day: 'Saturday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Sunday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      ],
      holidays: [],
    },
    slotsMorning: [
      '05:30 AM - 06:30 AM',
      '06:30 AM - 07:30 AM',
      '07:30 AM - 08:30 AM',
      '08:30 AM - 09:30 AM',
      '09:30 AM - 10:30 AM',
    ],
    slotsEvening: [
      '04:30 PM - 05:30 PM',
      '05:30 PM - 06:30 PM',
      '06:30 PM - 07:30 PM',
      '07:30 PM - 08:30 PM',
      '08:30 PM - 09:30 PM',
      '09:30 PM - 10:30 PM',
    ],
    floorSpaceSqFt: 8500,
    maxFloorCapacity: 120,
    slotDurationMinutes: 60,
    maxSlotCapacity: 35,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,
    socialLinks: {
      instagram: 'https://instagram.com/fitzone_chennai',
      instagramHandle: '@fitzone_chennai',
      facebook: 'https://facebook.com/fitzonechennai',
      youtube: 'https://youtube.com/@fitzone_fitness',
      whatsapp: '+919876543210',
      website: 'https://fitzoneluxurygym.com',
      googleBusinessUrl: 'https://maps.google.com/?q=FitZone+Luxury+Gym+Anna+Nagar',
      googleRating: '4.9',
      googleReviewCount: '328',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
  {
    name: 'PowerHouse Fitness Hub',
    tagline: 'Unleash Your True Potential',
    ownerName: 'Rajesh Kumar',
    phone: '+91 9876543211',
    email: 'info@powerhouse.com',
    businessType: 'Partnership',
    address: '45, Usman Road',
    fullAddress: '45, Usman Road, T. Nagar, Chennai, Tamil Nadu - 600017',
    area: 'T. Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    location: {
      type: 'Point',
      coordinates: [80.2341, 13.0418],
    },
    rating: 4.8,
    reviewsCount: 245,
    singleSessionPrice: 149,
    pricingPlans: {
      singleSession: 149,
      weeklyPass: 599,
      fiveSessions: 699,
      monthly: 1599,
      quarterly: 3999,
      halfYearly: 6999,
      annual: 11999,
    },
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Popular',
    facilities: ['AC Gym', 'Locker Facility', 'Shower Available', 'Parking Available', 'Heavy Dumbbells Zone'],
    amenities: [
      'Free High-Speed Wi-Fi',
      'Keyed Secure Lockers',
      'Hot Showers',
      'Dedicated Powerlifting Platforms',
      'Two-Wheeler & Car Parking',
      'Purified RO Water Station',
    ],
    workouts: ['Strength', 'Bodybuilding', 'Cardio', 'Boxing', 'Powerlifting'],
    tags: ['Strength', 'Bodybuilding', 'Boxing', 'Powerlifting', 'Popular'],
    aboutText: 'High energy iron gym equipped with heavy dumbbells up to 70kg, multiple power racks, calibrated plates, and certified contest preparation coaches.',
    rules: [
      'Lifting chalk must be cleaned from barbells after use.',
      'Drop weights only on designated deadlift rubber platforms.',
      'Collars and safety clips are compulsory on all barbell lifts.',
      'Gym towels required during all bench and seat usage.',
      'Return all dumbbells to their matching rack slots.',
    ],
    safetyMeasures: [
      'Full facility CCTV coverage including free weight sections.',
      'Certified first responders and emergency first-aid kit on floor.',
      'Equipment safety checks performed weekly by floor technicians.',
      'Fire extinguishers and illuminated emergency exits available.',
      'Sanitizer sprays provided at every power rack station.',
    ],
    trainers: [
      {
        name: 'Rajesh Kumar',
        specialty: 'Bodybuilding & Heavy Compound Lifts',
        experienceYears: 10,
        rating: 4.8,
        monthlyFee: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      },
      {
        name: 'Dinesh Balan',
        specialty: 'Powerlifting & Athletic Conditioning',
        experienceYears: 7,
        rating: 4.9,
        monthlyFee: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      },
    ],
    ratings: [
      {
        rating: 5,
        comment: 'Best iron gym in T. Nagar! Heavy dumbbells and calibrated deadlift platforms are unmatched.',
        bookingType: 'Annual Member',
        date: '4 days ago',
      },
      {
        rating: 5,
        comment: 'Coaches Rajesh and Dinesh really know competitive powerlifting techniques. Highly motivated vibe.',
        bookingType: 'Monthly Member',
        date: '2 weeks ago',
      },
      {
        rating: 4,
        comment: 'Great workout space. Easy access and good changing facilities.',
        bookingType: 'Single Session Pass',
        date: '1 month ago',
      },
    ],
    openingHours: {
      weekdayOpen: '05:30 AM',
      weekdayClose: '10:00 PM',
      weekendOpen: '06:00 AM',
      weekendClose: '09:00 PM',
      displayText: '05:30 AM - 10:00 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Thursday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Friday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Saturday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Sunday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      ],
      holidays: [],
    },
    slotsMorning: ['05:30 AM - 06:30 AM', '06:30 AM - 07:30 AM', '07:30 AM - 08:30 AM', '08:30 AM - 09:30 AM'],
    slotsEvening: ['05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM', '09:00 PM - 10:00 PM'],
    floorSpaceSqFt: 6000,
    maxFloorCapacity: 90,
    slotDurationMinutes: 60,
    maxSlotCapacity: 30,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,
    socialLinks: {
      instagram: 'https://instagram.com/powerhouse_tnagar',
      instagramHandle: '@powerhouse_tnagar',
      facebook: 'https://facebook.com/powerhousefitnesshub',
      whatsapp: '+919876543211',
      website: 'https://powerhousefitness.in',
      googleBusinessUrl: 'https://maps.google.com/?q=PowerHouse+Fitness+Hub+T+Nagar',
      googleRating: '4.8',
      googleReviewCount: '245',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
  {
    name: 'Core Fit Studio',
    tagline: 'Boutique Functional & Calisthenics Space',
    ownerName: 'Ananya Roy',
    phone: '+91 9876543212',
    email: 'hello@corefitstudio.com',
    businessType: 'Sole Proprietorship',
    address: '88, Gandhi Nagar 1st Main Rd',
    fullAddress: '88, Gandhi Nagar 1st Main Rd, Adyar, Chennai, Tamil Nadu - 600020',
    area: 'Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600020',
    location: {
      type: 'Point',
      coordinates: [80.2565, 13.0012],
    },
    rating: 4.7,
    reviewsCount: 189,
    singleSessionPrice: 249,
    pricingPlans: {
      singleSession: 249,
      weeklyPass: 899,
      fiveSessions: 999,
      monthly: 2499,
      quarterly: 6499,
      halfYearly: 10999,
      annual: 18999,
    },
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Trending',
    facilities: ['AC Gym', 'Locker Facility', 'Changing Rooms', 'Pilates Reformer', 'Yoga Mats', 'Herbal Tea Lounge'],
    amenities: [
      'High-Speed Wi-Fi',
      'Clean Locker Cubbies',
      'Reformer Pilates Studio',
      'Complimentary Organic Herbal Tea',
      'Eco-friendly Yoga Mats & Bolsters',
      'Premium Shower Amenities & Towels',
    ],
    workouts: ['Yoga', 'Pilates', 'HIIT', 'Zumba', 'Calisthenics', 'Mobility'],
    tags: ['Yoga', 'HIIT', 'Zumba', 'Pilates', 'Calisthenics', 'Trending'],
    aboutText: 'A modern boutique fitness studio specializing in posture correction, dynamic vinyasa yoga flows, reformer pilates, and calisthenics mobility.',
    rules: [
      'Grip socks mandatory for all Pilates reformer sessions.',
      'Maintain studio silence during yoga and meditation classes.',
      'Arrive 10 minutes prior to scheduled group classes.',
      'Clean yoga mats with provided organic mist after class.',
      'Cell phones must be switched to silent mode inside the studio.',
    ],
    safetyMeasures: [
      'HEPA air purification filtration running 24/7 across studio.',
      'Pilates equipment calibrated and tension-inspected daily.',
      'Anti-slip studio flooring with shock absorption.',
      'Certified yoga therapists and injury rehab instructors on floor.',
      'Comprehensive first aid and CPR equipment on premises.',
    ],
    trainers: [
      {
        name: 'Ananya Roy',
        specialty: 'Reformer Pilates & Mobility Coach',
        experienceYears: 8,
        rating: 4.9,
        reviewsCount: 34,
        monthlyFee: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
        ratings: [
          {
            rating: 5,
            comment: 'Ananya’s reformer pilates guidance cured my lower back posture strain. Highly attentive to form!',
            bookingType: 'Pilates 1-on-1',
            date: '4 days ago',
          },
          {
            rating: 5,
            comment: 'The best mobility and core conditioning instructor. Every session is well planned.',
            bookingType: 'Monthly Pilates',
            date: '2 weeks ago',
          },
        ],
      },
      {
        name: 'Tara Sundaram',
        specialty: 'Ashtanga Yoga & Breathwork Guide',
        experienceYears: 6,
        rating: 4.8,
        reviewsCount: 22,
        monthlyFee: 2600,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        ratings: [
          {
            rating: 5,
            comment: 'Tara’s pranayama and vinyasa flows are restorative and deeply energizing.',
            bookingType: 'Yoga Flow Pass',
            date: '1 week ago',
          },
        ],
      },
    ],
    ratings: [
      {
        rating: 5,
        comment: 'Best reformer pilates and yoga studio in Chennai! Trainer Ananya pays close attention to alignment.',
        bookingType: 'Monthly Member',
        date: '3 days ago',
      },
      {
        rating: 5,
        comment: 'Incredible posture correction sessions and calisthenics mobility flows. Quiet and hygienic ambiance.',
        bookingType: 'Quarterly Member',
        date: '1 week ago',
      },
      {
        rating: 5,
        comment: 'HEPA filtered air, spotless mats, and high quality reformers. Highly recommended!',
        bookingType: 'Single Session Pass',
        date: '2 weeks ago',
      },
    ],
    openingHours: {
      weekdayOpen: '06:00 AM',
      weekdayClose: '09:00 PM',
      weekendOpen: '06:30 AM',
      weekendClose: '07:30 PM',
      displayText: '06:00 AM - 09:00 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Thursday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Friday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Saturday', isOpen: true, openTime: '06:30 AM', closeTime: '07:30 PM' },
        { day: 'Sunday', isOpen: true, openTime: '07:00 AM', closeTime: '01:00 PM' },
      ],
      holidays: [],
    },
    slotsMorning: ['06:00 AM - 07:00 AM', '07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM'],
    slotsEvening: ['04:30 PM - 05:30 PM', '05:30 PM - 06:30 PM', '06:30 PM - 07:30 PM', '07:30 PM - 08:30 PM'],
    floorSpaceSqFt: 3500,
    maxFloorCapacity: 40,
    slotDurationMinutes: 60,
    maxSlotCapacity: 15,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,
    socialLinks: {
      instagram: 'https://instagram.com/corefitstudio_adyar',
      instagramHandle: '@corefitstudio_adyar',
      whatsapp: '+919876543212',
      website: 'https://corefitstudio.com',
      googleBusinessUrl: 'https://maps.google.com/?q=Core+Fit+Studio+Adyar',
      googleRating: '4.7',
      googleReviewCount: '189',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
  {
    name: 'Iron Temple Gym',
    tagline: 'Raw Iron. Pure Focus.',
    ownerName: 'Arjun Das',
    phone: '+91 9876543213',
    email: 'lift@irontemple.com',
    businessType: 'Private Limited',
    address: '22, 100 Feet Bypass Road',
    fullAddress: '22, 100 Feet Bypass Road, Velachery, Chennai, Tamil Nadu - 600042',
    area: 'Velachery',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600042',
    location: {
      type: 'Point',
      coordinates: [80.218, 12.9815],
    },
    rating: 4.8,
    reviewsCount: 210,
    singleSessionPrice: 179,
    pricingPlans: {
      singleSession: 179,
      weeklyPass: 699,
      fiveSessions: 799,
      monthly: 1799,
      quarterly: 4499,
      halfYearly: 7999,
      annual: 13999,
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Verified',
    facilities: ['AC Gym', 'Locker Facility', 'Shower Available', 'Powerlifting Racks', 'Olympic Platforms'],
    amenities: [
      'Free High-Speed Wi-Fi',
      'Steel Lockers with Padlocks',
      'Hot Showers',
      'Eleiko & Rogue Calibrated Plates',
      'Spacious Bike & Car Parking',
      'Electrolyte & Water Dispenser',
    ],
    workouts: ['Strength', 'Powerlifting', 'CrossFit', 'HIIT', 'Deadlift Specialty'],
    tags: ['Strength', 'Powerlifting', 'CrossFit', 'Verified', 'Heavy Weights'],
    aboutText: 'Built for dedicated lifters, powerlifters, and athletes seeking calibrated plates, mono-lifts, certified strength trainers, and Olympic platforms.',
    rules: [
      'Chalk allowed only in designated platform lifting areas.',
      'De-load barbells completely after completing heavy sets.',
      'Wear sturdy flat shoes or lifting footwear during compound lifts.',
      'Spotters must be used for maximum bench press attempts.',
      'Maintain focused gym discipline and respect all lifters.',
    ],
    safetyMeasures: [
      'Commercial grade heavy-duty safety spotter arms on all racks.',
      'Impact-resistant 30mm thick vulcanized rubber flooring.',
      '24/7 CCTV surveillance monitoring all training bays.',
      'On-floor coaches certified in sports injury prevention.',
      'Automated medical emergency call system and first aid box.',
    ],
    trainers: [
      {
        name: 'Arjun Das',
        specialty: 'National Powerlifting Coach & Strength Conditioning',
        experienceYears: 11,
        rating: 4.9,
        monthlyFee: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
      },
      {
        name: 'Manoj Kumar',
        specialty: 'Strength & Hypertrophy Coach',
        experienceYears: 6,
        rating: 4.8,
        monthlyFee: 2800,
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
      },
    ],
    openingHours: {
      weekdayOpen: '05:00 AM',
      weekdayClose: '11:00 PM',
      weekendOpen: '06:00 AM',
      weekendClose: '09:00 PM',
      displayText: '05:00 AM - 11:00 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Thursday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Friday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Saturday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
        { day: 'Sunday', isOpen: true, openTime: '06:00 AM', closeTime: '08:00 PM' },
      ],
      holidays: [],
    },
    slotsMorning: ['05:00 AM - 06:30 AM', '06:30 AM - 08:00 AM', '08:00 AM - 09:30 AM', '09:30 AM - 11:00 AM'],
    slotsEvening: ['04:30 PM - 06:00 PM', '06:00 PM - 07:30 PM', '07:30 PM - 09:00 PM', '09:00 PM - 10:30 PM'],
    floorSpaceSqFt: 7000,
    maxFloorCapacity: 100,
    slotDurationMinutes: 90,
    maxSlotCapacity: 30,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,
    socialLinks: {
      instagram: 'https://instagram.com/irontemple_velachery',
      instagramHandle: '@irontemple_velachery',
      whatsapp: '+919876543213',
      website: 'https://irontemplegym.com',
      googleBusinessUrl: 'https://maps.google.com/?q=Iron+Temple+Gym+Velachery',
      googleRating: '4.8',
      googleReviewCount: '210',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
  {
    name: 'Zenith Wellness & Boxing Arena',
    tagline: 'Mindful Conditioning & Combat Sport',
    ownerName: 'Karthik Raja',
    phone: '+91 9876543214',
    email: 'fight@zenitharena.com',
    businessType: 'Partnership',
    address: '10, Sterling Road',
    fullAddress: '10, Sterling Road, Nungambakkam, Chennai, Tamil Nadu - 600034',
    area: 'Nungambakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600034',
    location: {
      type: 'Point',
      coordinates: [80.2425, 13.0569],
    },
    rating: 4.9,
    reviewsCount: 312,
    singleSessionPrice: 299,
    pricingPlans: {
      singleSession: 299,
      weeklyPass: 999,
      fiveSessions: 1199,
      monthly: 2999,
      quarterly: 7499,
      halfYearly: 12999,
      annual: 21999,
    },
    image: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Top Combat Hub',
    facilities: ['AC Gym', 'Official Boxing Ring', 'Locker Facility', 'Shower Available', 'Sauna Room', 'Heavy Bags Bay'],
    amenities: [
      'Free High-Speed Wi-Fi',
      'Boxing Glove Sanitizing Dryers',
      'Full Size Competition Ring',
      'Finnish Wood Sauna',
      'Private Shower Suites',
      'Juice & Protein Refuel Bar',
      'Covered Parking',
    ],
    workouts: ['Boxing', 'MMA', 'Kickboxing', 'HIIT', 'Conditioning', 'Muay Thai'],
    tags: ['Boxing', 'MMA', 'HIIT', 'Combat', 'Top Combat Hub', 'Sauna'],
    aboutText: 'Chennai’s premier combat arts and functional fitness space with an official regulation boxing ring, heavy bag bays, sauna recovery, and professional pro fighters coaching.',
    rules: [
      'Hand wraps and mouthguards mandatory during ring sparring sessions.',
      'Sanitize all boxing gloves and headgear before and after use.',
      'No street shoes allowed inside the boxing ring or mat canvas.',
      'Follow sparring intensity rules set by presiding coaches.',
      'Sauna duration limited to 15 minutes per session for health safety.',
    ],
    safetyMeasures: [
      'Official competition ring with shock-absorbing safety underlay.',
      'Certified combat sports medics and concussion safety protocol.',
      '24/7 CCTV surveillance across combat ring and conditioning arena.',
      'Daily medical disinfectant treatment on mats and heavy bags.',
      'Emergency response team and first aid trauma kit on premises.',
    ],
    trainers: [
      {
        name: 'Karthik Raja',
        specialty: 'Pro Boxing & Kickboxing Coach',
        experienceYears: 12,
        rating: 5.0,
        monthlyFee: 4000,
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      },
      {
        name: 'Elena Gilbert',
        specialty: 'Muay Thai & Functional Conditioning',
        experienceYears: 7,
        rating: 4.9,
        monthlyFee: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      },
    ],
    openingHours: {
      weekdayOpen: '06:00 AM',
      weekdayClose: '10:00 PM',
      weekendOpen: '06:30 AM',
      weekendClose: '08:30 PM',
      displayText: '06:00 AM - 10:00 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '06:00 AM', closeTime: '10:00 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '06:00 AM', closeTime: '10:00 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '06:00 AM', closeTime: '10:00 PM' },
        { day: 'Thursday', isOpen: true, openTime: '06:00 AM', closeTime: '10:00 PM' },
        { day: 'Friday', isOpen: true, openTime: '06:00 AM', closeTime: '10:00 PM' },
        { day: 'Saturday', isOpen: true, openTime: '06:30 AM', closeTime: '08:30 PM' },
        { day: 'Sunday', isOpen: true, openTime: '07:00 AM', closeTime: '02:00 PM' },
      ],
      holidays: [],
    },
    slotsMorning: ['06:00 AM - 07:00 AM', '07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM'],
    slotsEvening: ['05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM', '09:00 PM - 10:00 PM'],
    floorSpaceSqFt: 6800,
    maxFloorCapacity: 80,
    slotDurationMinutes: 60,
    maxSlotCapacity: 20,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,
    socialLinks: {
      instagram: 'https://instagram.com/zenith_boxing_arena',
      instagramHandle: '@zenith_boxing_arena',
      whatsapp: '+919876543214',
      website: 'https://zenithboxingarena.com',
      googleBusinessUrl: 'https://maps.google.com/?q=Zenith+Wellness+Boxing+Arena+Nungambakkam',
      googleRating: '4.9',
      googleReviewCount: '312',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
  {
    name: 'Peak Performance CrossFit Box',
    tagline: 'Forging Elite Fitness',
    ownerName: 'Rohan Menon',
    phone: '+91 9876543215',
    email: 'info@peakcrossfit.com',
    businessType: 'Private Limited',
    address: 'OMR IT Highway, Rajiv Gandhi Salai',
    fullAddress: 'OMR IT Highway, Rajiv Gandhi Salai, Thoraipakkam, Chennai, Tamil Nadu - 600097',
    area: 'OMR, Thoraipakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600097',
    location: {
      type: 'Point',
      coordinates: [80.2376, 12.9698],
    },
    rating: 4.9,
    reviewsCount: 420,
    singleSessionPrice: 349,
    pricingPlans: {
      singleSession: 349,
      weeklyPass: 1299,
      fiveSessions: 1499,
      monthly: 3499,
      quarterly: 8999,
      halfYearly: 15999,
      annual: 26999,
    },
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Affiliated CrossFit',
    facilities: ['AC Gym', 'Locker Facility', 'Shower Available', 'Rogue Rig Bay', 'Assault Bikes', 'Sprint Turf Track'],
    amenities: [
      'High-Speed Wi-Fi',
      'Dedicated CrossFit Rogue Rig',
      'Hot & Cold Showers',
      'Sprint & Sled Turf Track',
      'Assault Rowers & SkiErgs',
      'Ample Car & Bike Parking',
      'Protein Refuel Station',
    ],
    workouts: ['CrossFit', 'HIIT', 'Olympic Lifting', 'Endurance', 'Gymnastics', 'Kettlebell'],
    tags: ['CrossFit', 'HIIT', 'Strength', 'Olympic Lifting', 'Affiliated CrossFit'],
    aboutText: 'Chennai’s premier affiliated CrossFit box featuring full Rogue rigs, gymnastics rings, climbing ropes, Concept2 rowers, and coach-led intense WODs.',
    rules: [
      'Attend the coach-led dynamic warmup before starting any workout of the day (WOD).',
      'Clean chalk residue from pullup bars and kettlebells after use.',
      'Drop barbells only on bumper plate drop zones with rubber flooring.',
      'Scale movements responsibly according to your personal fitness level.',
      'Cheer on and encourage every athlete until the final rep is done.',
    ],
    safetyMeasures: [
      'CrossFit Level 2 certified head coaches supervising all classes.',
      'Daily safety inspection of gymnastics rings, climbing ropes, and rigs.',
      'AED cardiac defibrillator and trauma emergency first aid kit on site.',
      '24/7 CCTV surveillance throughout indoor and outdoor turf tracks.',
      'Touchless hydration and sanitizer points at every workout station.',
    ],
    trainers: [
      {
        name: 'Rohan Menon',
        specialty: 'CrossFit Level 2 & Olympic Weightlifting Coach',
        experienceYears: 9,
        rating: 4.9,
        monthlyFee: 3800,
        imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop',
      },
      {
        name: 'Meera Nambiar',
        specialty: 'Gymnastics & Functional Endurance Trainer',
        experienceYears: 6,
        rating: 4.9,
        monthlyFee: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      },
    ],
    openingHours: {
      weekdayOpen: '05:30 AM',
      weekdayClose: '10:00 PM',
      weekendOpen: '06:00 AM',
      weekendClose: '08:30 PM',
      displayText: '05:30 AM - 10:00 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Thursday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Friday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Saturday', isOpen: true, openTime: '06:00 AM', closeTime: '08:30 PM' },
        { day: 'Sunday', isOpen: true, openTime: '06:30 AM', closeTime: '12:30 PM' },
      ],
      holidays: [],
    },
    slotsMorning: ['05:30 AM - 06:30 AM', '06:30 AM - 07:30 AM', '07:30 AM - 08:30 AM', '08:30 AM - 09:30 AM'],
    slotsEvening: ['05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM', '09:00 PM - 10:00 PM'],
    floorSpaceSqFt: 9500,
    maxFloorCapacity: 110,
    slotDurationMinutes: 60,
    maxSlotCapacity: 25,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,
    socialLinks: {
      instagram: 'https://instagram.com/peakcrossfit_chennai',
      instagramHandle: '@peakcrossfit_chennai',
      whatsapp: '+919876543215',
      website: 'https://peakcrossfitt.com',
      googleBusinessUrl: 'https://maps.google.com/?q=Peak+Performance+CrossFit+OMR',
      googleRating: '4.9',
      googleReviewCount: '420',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
  {
    name: 'Pulse Fitness & Zumba Lounge',
    tagline: 'Dance, Sweat & Celebrate Health',
    ownerName: 'Priya Sharma',
    phone: '+91 9876543216',
    email: 'dance@pulsefitness.com',
    businessType: 'Sole Proprietorship',
    address: 'Trunk Road, Near Porur Junction',
    fullAddress: 'Trunk Road, Near Porur Junction, Porur, Chennai, Tamil Nadu - 600116',
    area: 'Porur',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600116',
    location: {
      type: 'Point',
      coordinates: [80.1585, 13.0382],
    },
    rating: 4.8,
    reviewsCount: 290,
    singleSessionPrice: 249,
    pricingPlans: {
      singleSession: 249,
      weeklyPass: 899,
      fiveSessions: 999,
      monthly: 2499,
      quarterly: 6499,
      halfYearly: 10999,
      annual: 18999,
    },
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Zumba & Dance',
    facilities: ['AC Gym', 'Wooden Sprung Floor', 'Locker Facility', 'Shower Available', 'Smoothie Bar', 'Sound & Light System'],
    amenities: [
      'Free High-Speed Wi-Fi',
      'Acoustically Treated Dance Studio',
      'Locker Rooms & Key Fobs',
      'Fresh Fruit Smoothie Bar',
      'Air-conditioned Changing Lounges',
      'Parking for 20+ Vehicles',
    ],
    workouts: ['Zumba', 'Aerobics', 'Cardio', 'Yoga', 'HIIT', 'Bollywood Dance'],
    tags: ['Zumba', 'Dance', 'Cardio', 'Yoga', 'Zumba & Dance', 'Women Friendly'],
    aboutText: 'Energetic community fitness studio in Porur featuring shock-absorbing wooden sprung dance floors, licensed Zumba instructors, Bollywood cardio, and modern party acoustics.',
    rules: [
      'Wear non-marking indoor sports shoes on the wooden sprung floor.',
      'Arrive on time to ensure complete participation in class warmups.',
      'Carry your own hydration bottle or use our filtered water refill points.',
      'Respect fellow participants and create a welcoming group environment.',
      'Personal belongings must be stowed in provided locker units.',
    ],
    safetyMeasures: [
      'Spring-loaded shock absorption dance floor to prevent knee stress.',
      'Certified Zumba & group fitness emergency first-aid responders.',
      '24/7 CCTV surveillance across common studio corridors.',
      'Daily UV sanitation and surface cleaning of dance floors.',
      'Illuminated emergency exits with automated power backup.',
    ],
    trainers: [
      {
        name: 'Priya Sharma',
        specialty: 'ZIN Certified Zumba Master & Aerobics Lead',
        experienceYears: 8,
        rating: 4.9,
        monthlyFee: 2800,
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      },
      {
        name: 'Deepak Varma',
        specialty: 'Bollywood Cardio & Step Aerobics Instructor',
        experienceYears: 5,
        rating: 4.8,
        monthlyFee: 2400,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      },
    ],
    openingHours: {
      weekdayOpen: '06:00 AM',
      weekdayClose: '09:30 PM',
      weekendOpen: '06:30 AM',
      weekendClose: '08:00 PM',
      displayText: '06:00 AM - 09:30 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '06:00 AM', closeTime: '09:30 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '06:00 AM', closeTime: '09:30 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '06:00 AM', closeTime: '09:30 PM' },
        { day: 'Thursday', isOpen: true, openTime: '06:00 AM', closeTime: '09:30 PM' },
        { day: 'Friday', isOpen: true, openTime: '06:00 AM', closeTime: '09:30 PM' },
        { day: 'Saturday', isOpen: true, openTime: '06:30 AM', closeTime: '08:00 PM' },
        { day: 'Sunday', isOpen: true, openTime: '07:00 AM', closeTime: '01:00 PM' },
      ],
      holidays: [],
    },
    slotsMorning: ['06:00 AM - 07:00 AM', '07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM'],
    slotsEvening: ['04:30 PM - 05:30 PM', '05:30 PM - 06:30 PM', '06:30 PM - 07:30 PM', '07:30 PM - 08:30 PM'],
    floorSpaceSqFt: 4200,
    maxFloorCapacity: 50,
    slotDurationMinutes: 60,
    maxSlotCapacity: 20,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,
    socialLinks: {
      instagram: 'https://instagram.com/pulsefitness_porur',
      instagramHandle: '@pulsefitness_porur',
      whatsapp: '+919876543216',
      website: 'https://pulsefitnesschennai.com',
      googleBusinessUrl: 'https://maps.google.com/?q=Pulse+Fitness+Zumba+Lounge+Porur',
      googleRating: '4.8',
      googleReviewCount: '290',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
  {
    name: 'Bay Athletic Club',
    tagline: 'Luxury Coastal Conditioning',
    ownerName: 'Samir Merchant',
    phone: '+91 9876543217',
    email: 'concierge@bayathletic.com',
    businessType: 'Private Limited',
    address: 'Beach Road, Besant Nagar',
    fullAddress: 'Beach Road, Besant Nagar, Chennai, Tamil Nadu - 600090',
    area: 'Besant Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600090',
    location: {
      type: 'Point',
      coordinates: [80.2676, 13.0002],
    },
    rating: 4.9,
    reviewsCount: 510,
    singleSessionPrice: 499,
    pricingPlans: {
      singleSession: 499,
      weeklyPass: 1799,
      fiveSessions: 1999,
      monthly: 4999,
      quarterly: 12999,
      halfYearly: 22999,
      annual: 39999,
    },
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    ],
    badgeText: 'Celebrity Hub',
    facilities: ['AC Gym', 'Locker Facility', 'Shower Available', 'Steam & Sauna', 'Valet Parking', 'Cryo Recovery Lounge', 'Rooftop Cafe'],
    amenities: [
      'Ultra-Fast 1Gbps Wi-Fi',
      'Biometric Keyless Lockers',
      'Rainfall Showers & Egyptian Cotton Towels',
      'Cryotherapy & Cold Plunge Suites',
      'Valet Car Parking & EV Charging',
      'Artisan Protein & Juice Bar',
      'Technogym Biostrength Equipment',
    ],
    workouts: ['Strength', 'Cardio', 'Pilates', 'HIIT', 'Functional', 'Personal Training', 'Recovery'],
    tags: ['Strength', 'Pilates', 'HIIT', 'AC Gym', 'Celebrity Hub', 'Luxury', 'Cryo Recovery'],
    aboutText: 'Besant Nagar’s flagship luxury fitness club favored by athletes, performers, and business leaders, equipped with custom Technogym lines, cold plunge suites, and scenic beach views.',
    rules: [
      'Dress code: Clean branded athletic wear and training shoes required.',
      'Valet parking service tickets must be validated at concierge.',
      'Cold plunge and cryo recovery require pre-booking via reception.',
      'Strict privacy policy: No photography of celebrity and VIP members.',
      'Wipe down all bio-strength touchscreens and handles after session.',
    ],
    safetyMeasures: [
      '24/7 Monitored high-definition security and biometric access control.',
      'On-site certified sports physiotherapist and emergency paramedic staff.',
      'Hospital grade HEPA air sanitization & negative ion air filters.',
      'AED cardiac defibrillator unit and emergency medical trauma room.',
      'Daily medical-grade UV sterilizer sweeps of all facilities.',
    ],
    trainers: [
      {
        name: 'Samir Merchant',
        specialty: 'Elite Performance & High Net-Worth Lifestyle Coach',
        experienceYears: 14,
        rating: 5.0,
        monthlyFee: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
      },
      {
        name: 'Nathalie Dupont',
        specialty: 'Technogym Master Trainer & Posture Alignment',
        experienceYears: 9,
        rating: 4.9,
        monthlyFee: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      },
    ],
    openingHours: {
      weekdayOpen: '05:00 AM',
      weekdayClose: '11:00 PM',
      weekendOpen: '05:30 AM',
      weekendClose: '10:00 PM',
      displayText: '05:00 AM - 11:00 PM',
      isSplitShift: false,
      isOpenHolidays: true,
      is24Hours: false,
      schedule: [
        { day: 'Monday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Tuesday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Wednesday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Thursday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Friday', isOpen: true, openTime: '05:00 AM', closeTime: '11:00 PM' },
        { day: 'Saturday', isOpen: true, openTime: '05:30 AM', closeTime: '10:00 PM' },
        { day: 'Sunday', isOpen: true, openTime: '05:30 AM', closeTime: '09:00 PM' },
      ],
      holidays: [],
    },
    slotsMorning: ['05:00 AM - 06:30 AM', '06:30 AM - 08:00 AM', '08:00 AM - 09:30 AM', '09:30 AM - 11:00 AM'],
    slotsEvening: ['04:30 PM - 06:00 PM', '06:00 PM - 07:30 PM', '07:30 PM - 09:00 PM', '09:00 PM - 10:30 PM'],
    floorSpaceSqFt: 14000,
    maxFloorCapacity: 160,
    slotDurationMinutes: 90,
    maxSlotCapacity: 40,
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 3,
    socialLinks: {
      instagram: 'https://instagram.com/bayathletic_club',
      instagramHandle: '@bayathletic_club',
      facebook: 'https://facebook.com/bayathleticclub',
      youtube: 'https://youtube.com/@bayathletic',
      whatsapp: '+919876543217',
      website: 'https://bayathleticclub.com',
      googleBusinessUrl: 'https://maps.google.com/?q=Bay+Athletic+Club+Besant+Nagar',
      googleRating: '4.9',
      googleReviewCount: '510',
    },
    systemSettings: {
      turnstileTimeout: 5,
      renewalGracePeriod: 3,
      autoCheckoutHours: 2.5,
      smsCheckInAlerts: true,
      whatsappAlerts: true,
      audioChimeEnabled: true,
      spotWalkInsAllowed: true,
    },
  },
];

const seedGyms = async () => {
  try {
    console.log('[SEED GYMS] Connecting to MongoDB...');
    await connectDatabase();

    // 1. Seed Customer Users into User collection
    const customerList = [];
    for (const cust of SAMPLE_CUSTOMERS) {
      let u = await User.findOne({ email: cust.email });
      if (!u) {
        u = await User.create(cust);
      } else {
        u.fullName = cust.fullName;
        u.avatar = cust.avatar;
        u.phone = cust.phone;
        await u.save();
      }
      customerList.push(u._id);
    }
    console.log(`[SEED GYMS] Seeded ${customerList.length} customer profiles in User collection.`);

    // 2. Helper to attach User IDs to reviews/ratings
    const attachUserIds = (items = []) => {
      return items.map((item, idx) => {
        const assignedUserId = customerList[idx % customerList.length];
        return {
          userId: assignedUserId,
          rating: item.rating || 5,
          comment: item.comment || 'Great experience!',
          bookingType: item.bookingType || 'Member',
          date: item.date || 'Recent',
          createdAt: item.createdAt || new Date(),
        };
      });
    };

    for (const gymData of SEED_GYMS) {
      const formattedReviews = attachUserIds(gymData.reviews || gymData.ratings || []);
      const formattedTrainers = (gymData.trainers || []).map((tr) => ({
        ...tr,
        ratings: attachUserIds(tr.ratings || []),
      }));

      const existing = await Gym.findOne({ name: gymData.name });
      if (!existing) {
        const partnerSeq = await Counter.getNextSequence('gym_partner_id');
        const partnerId = `GYM${partnerSeq}`;
        const createdGym = await Gym.create({
          ...gymData,
          customPricingPlans: buildStandardCustomPricingPlans(gymData.pricingPlans, gymData.customPricingPlans),
          trainers: [],
          ratings: formattedReviews,
          reviews: formattedReviews,
          partnerId,
          slug: gymData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: 'Active',
          approvalStatus: 'Approved',
          isActive: true,
        });
        console.log(`[SEED GYMS] Created: ${gymData.name} (${partnerId}) in ${gymData.area}, ${gymData.city}`);

        // Seed trainers into Employee collection (SSOT)
        for (const tr of formattedTrainers) {
          if (!tr || !tr.name) continue;
          const seq = await Counter.getNextSequence(`emp_${createdGym.partnerId}`);
          const employeeId = `TR${String(seq).padStart(3, '0')}`;
          await Employee.create({
            gymId: createdGym._id,
            gymPartnerId: createdGym.partnerId,
            gymName: createdGym.name,
            employeeId,
            name: tr.name.trim(),
            role: 'Trainer',
            avatar: tr.imageUrl || '',
            specialty: tr.specialty || 'Certified Fitness Trainer',
            experienceYears: Number(tr.experienceYears) || 2,
            rating: Number(tr.rating) || 4.9,
            reviewsCount: Number(tr.reviewsCount) || 0,
            ratings: Array.isArray(tr.ratings) ? tr.ratings : [],
            status: 'Active',
            attendance: 'Present',
            approvalStatus: 'Approved',
            pendingAction: 'NONE',
            type: 'Full-Time',
            accessType: 'Employee',
            joinDate: '01 Jan 2026',
            approvedBy: 'Seed Script',
            approvedAt: new Date(),
          });
        }
      } else {
        existing.location = gymData.location;
        existing.area = gymData.area;
        existing.city = gymData.city;
        existing.state = gymData.state;
        existing.pincode = gymData.pincode;
        existing.address = gymData.address;
        existing.fullAddress = gymData.fullAddress;
        existing.tagline = gymData.tagline;
        existing.ownerName = gymData.ownerName;
        existing.phone = gymData.phone;
        existing.email = gymData.email;
        existing.businessType = gymData.businessType;
        existing.facilities = gymData.facilities;
        existing.amenities = gymData.amenities;
        existing.workouts = gymData.workouts;
        existing.tags = gymData.tags;
        existing.badgeText = gymData.badgeText;
        existing.aboutText = gymData.aboutText;
        existing.rules = gymData.rules;
        existing.safetyMeasures = gymData.safetyMeasures;
        existing.trainers = [];
        existing.openingHours = gymData.openingHours;
        existing.slotsMorning = gymData.slotsMorning;
        existing.slotsEvening = gymData.slotsEvening;
        existing.floorSpaceSqFt = gymData.floorSpaceSqFt;
        existing.maxFloorCapacity = gymData.maxFloorCapacity;
        existing.slotDurationMinutes = gymData.slotDurationMinutes;
        existing.maxSlotCapacity = gymData.maxSlotCapacity;
        existing.freeCancellationHours = gymData.freeCancellationHours;
        existing.refundPercentage = gymData.refundPercentage;
        existing.rescheduleAllowedCount = gymData.rescheduleAllowedCount;
        existing.socialLinks = gymData.socialLinks;
        existing.systemSettings = gymData.systemSettings;
        existing.rating = gymData.rating;
        existing.reviewsCount = gymData.reviewsCount;
        existing.ratings = formattedReviews;
        existing.reviews = formattedReviews;
        existing.singleSessionPrice = gymData.singleSessionPrice;
        existing.pricingPlans = gymData.pricingPlans;
        existing.customPricingPlans = buildStandardCustomPricingPlans(gymData.pricingPlans, existing.customPricingPlans || gymData.customPricingPlans);
        existing.image = gymData.image;
        existing.images = gymData.images;
        existing.status = 'Active';
        existing.approvalStatus = 'Approved';
        existing.isActive = true;
        await existing.save();
        console.log(`[SEED GYMS] Updated: ${gymData.name} (${existing.partnerId || 'existing'}) in ${gymData.area}, ${gymData.city}`);

        // Ensure trainers exist in Employee collection (SSOT)
        for (const tr of formattedTrainers) {
          if (!tr || !tr.name) continue;
          const empExists = await Employee.findOne({
            $or: [{ gymPartnerId: existing.partnerId }, { gymId: existing._id }],
            name: tr.name.trim(),
            role: 'Trainer',
          });
          if (!empExists) {
            const seq = await Counter.getNextSequence(`emp_${existing.partnerId}`);
            const employeeId = `TR${String(seq).padStart(3, '0')}`;
            await Employee.create({
              gymId: existing._id,
              gymPartnerId: existing.partnerId || '',
              gymName: existing.name,
              employeeId,
              name: tr.name.trim(),
              role: 'Trainer',
              avatar: tr.imageUrl || '',
              specialty: tr.specialty || 'Certified Fitness Trainer',
              experienceYears: Number(tr.experienceYears) || 2,
              rating: Number(tr.rating) || 4.9,
              reviewsCount: Number(tr.reviewsCount) || 0,
              ratings: Array.isArray(tr.ratings) ? tr.ratings : [],
              status: 'Active',
              attendance: 'Present',
              approvalStatus: 'Approved',
              pendingAction: 'NONE',
              type: 'Full-Time',
              accessType: 'Employee',
              joinDate: '01 Jan 2026',
              approvedBy: 'Seed Script',
              approvedAt: new Date(),
            });
          }
        }
      }
    }

    const total = await Gym.countDocuments();
    console.log(`\n[SEED GYMS SUCCESS] Total Gyms in Database: ${total}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[SEED GYMS ERROR]:', err.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedGyms();
