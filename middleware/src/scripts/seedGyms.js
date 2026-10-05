import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Gym from '../models/gym.model.js';
import Counter from '../models/counter.model.js';

const SEED_GYMS = [
  {
    name: 'FitZone Luxury Gym',
    tagline: 'Elite Strength & Conditioning',
    ownerName: 'Vikram Seth',
    phone: '+91 9876543210',
    email: 'contact@fitzone.com',
    businessType: 'Private Limited',
    address: '14, 2nd Avenue, Block AB',
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
    badgeText: 'Top Rated',
    facilities: ['AC', 'Locker', 'Shower', 'Steam Room', 'Parking', 'Juice Bar'],
    workouts: ['Strength', 'HIIT', 'CrossFit', 'Cardio', 'Personal Training'],
    tags: ['Strength', 'HIIT', 'CrossFit', 'Personal Training'],
    aboutText: 'FitZone Luxury Gym is Anna Nagar’s premier fitness club featuring Olympic barbells, imported cardio suites, and elite coaching.',
  },
  {
    name: 'PowerHouse Fitness Hub',
    tagline: 'Unleash Your True Potential',
    ownerName: 'Rajesh Kumar',
    phone: '+91 9876543211',
    email: 'info@powerhouse.com',
    businessType: 'Partnership',
    address: '45, Usman Road',
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
    badgeText: 'Popular',
    facilities: ['AC', 'Locker', 'Shower', 'Parking'],
    workouts: ['Strength', 'Bodybuilding', 'Cardio', 'Boxing'],
    tags: ['Strength', 'Bodybuilding', 'Boxing'],
    aboutText: 'High energy iron gym equipped with heavy dumbbells, squat racks, and certified contest preparation coaches.',
  },
  {
    name: 'Core Fit Studio',
    tagline: 'Boutique Functional & Calisthenics Space',
    ownerName: 'Ananya Roy',
    phone: '+91 9876543212',
    email: 'hello@corefitstudio.com',
    businessType: 'Sole Proprietorship',
    address: '88, Gandhi Nagar 1st Main Rd',
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
    badgeText: 'Trending',
    facilities: ['AC', 'Locker', 'Changing Rooms', 'Pilates Reformer', 'Yoga Mats'],
    workouts: ['Yoga', 'Pilates', 'HIIT', 'Zumba', 'Calisthenics'],
    tags: ['Yoga', 'HIIT', 'Zumba', 'Pilates'],
    aboutText: 'A modern boutique fitness studio specializing in posture correction, dynamic yoga flows, and reformer pilates.',
  },
  {
    name: 'Iron Temple Gym',
    tagline: 'Raw Iron. Pure Focus.',
    ownerName: 'Arjun Das',
    phone: '+91 9876543213',
    email: 'lift@irontemple.com',
    businessType: 'Private Limited',
    address: '22, 100 Feet Bypass Road',
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
    badgeText: 'Verified',
    facilities: ['AC', 'Locker', 'Shower', 'Powerlifting Racks'],
    workouts: ['Strength', 'Powerlifting', 'CrossFit', 'HIIT'],
    tags: ['Strength', 'Powerlifting', 'CrossFit'],
    aboutText: 'Built for dedicated lifters, powerlifters, and athletes seeking calibrated plates, mono-lifts, and Olympic platforms.',
  },
  {
    name: 'Zenith Wellness & Boxing Arena',
    tagline: 'Mindful Conditioning & Combat Sport',
    ownerName: 'Karthik Raja',
    phone: '+91 9876543214',
    email: 'fight@zenitharena.com',
    businessType: 'Partnership',
    address: '10, Sterling Road',
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
    badgeText: 'Top Combat Hub',
    facilities: ['AC', 'Boxing Ring', 'Locker', 'Shower', 'Sauna'],
    workouts: ['Boxing', 'MMA', 'Kickboxing', 'HIIT', 'Conditioning'],
    tags: ['Boxing', 'MMA', 'HIIT', 'Combat'],
    aboutText: 'Chennai’s premier combat arts and functional fitness space with an official boxing ring and professional coaches.',
  },
  {
    name: 'Peak Performance CrossFit Box',
    tagline: 'Forging Elite Fitness',
    ownerName: 'Rohan Menon',
    phone: '+91 9876543215',
    email: 'info@peakcrossfit.com',
    businessType: 'Private Limited',
    address: 'OMR IT Highway, Rajiv Gandhi Salai',
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
    badgeText: 'Affiliated CrossFit',
    facilities: ['AC', 'Locker', 'Shower', 'Rogue Rig', 'Assault Bikes', 'Turf'],
    workouts: ['CrossFit', 'HIIT', 'Olympic Lifting', 'Endurance'],
    tags: ['CrossFit', 'HIIT', 'Strength'],
    aboutText: 'Chennai’s top rated CrossFit box featuring Rogue gear, gymnastics rings, climbing ropes, and coach-led WODs.',
  },
  {
    name: 'Pulse Fitness & Zumba Lounge',
    tagline: 'Dance, Sweat & Celebrate Health',
    ownerName: 'Priya Sharma',
    phone: '+91 9876543216',
    email: 'dance@pulsefitness.com',
    businessType: 'Sole Proprietorship',
    address: 'Trunk Road, Near Porur Junction',
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
    badgeText: 'Zumba & Dance',
    facilities: ['AC', 'Wooden Sprung Floor', 'Locker', 'Shower', 'Smoothie Bar'],
    workouts: ['Zumba', 'Aerobics', 'Cardio', 'Yoga', 'HIIT'],
    tags: ['Zumba', 'Dance', 'Cardio', 'Yoga'],
    aboutText: 'Energetic community studio in Porur with licensed Zumba instructors, Bollywood cardio, and modern acoustics.',
  },
  {
    name: 'Bay Athletic Club',
    tagline: 'Luxury Coastal Conditioning',
    ownerName: 'Samir Merchant',
    phone: '+91 9876543217',
    email: 'concierge@bayathletic.com',
    businessType: 'Private Limited',
    address: 'Beach Road, Besant Nagar',
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
    badgeText: 'Celebrity Hub',
    facilities: ['AC', 'Locker', 'Shower', 'Steam', 'Valet Parking', 'Cryo Recovery'],
    workouts: ['Strength', 'Cardio', 'Pilates', 'HIIT', 'Functional'],
    tags: ['Strength', 'Pilates', 'HIIT', 'AC Gym'],
    aboutText: 'Besant Nagar’s flagship fitness club favored by athletes and performers, equipped with custom Technogym lines and cold plunge suites.',
  },
];

const seedGyms = async () => {
  try {
    console.log('[SEED GYMS] Connecting to MongoDB...');
    await connectDatabase();

    for (const gymData of SEED_GYMS) {
      const existing = await Gym.findOne({ name: gymData.name });
      if (!existing) {
        const partnerSeq = await Counter.getNextSequence('gym_partner_id');
        const partnerId = `GYM${partnerSeq}`;
        await Gym.create({
          ...gymData,
          partnerId,
          slug: gymData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: 'Active',
          approvalStatus: 'Approved',
          isActive: true,
        });
        console.log(`[SEED GYMS] Created: ${gymData.name} (${partnerId}) in ${gymData.area}, ${gymData.city}`);
      } else {
        existing.location = gymData.location;
        existing.area = gymData.area;
        existing.city = gymData.city;
        existing.state = gymData.state;
        existing.facilities = gymData.facilities;
        existing.workouts = gymData.workouts;
        existing.tags = gymData.tags;
        existing.rating = gymData.rating;
        existing.reviewsCount = gymData.reviewsCount;
        existing.singleSessionPrice = gymData.singleSessionPrice;
        existing.pricingPlans = gymData.pricingPlans;
        existing.image = gymData.image;
        existing.status = 'Active';
        existing.approvalStatus = 'Approved';
        existing.isActive = true;
        await existing.save();
        console.log(`[SEED GYMS] Updated: ${gymData.name} (${existing.partnerId || 'existing'}) in ${gymData.area}, ${gymData.city}`);
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
