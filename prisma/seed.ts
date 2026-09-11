import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SQLite database for AvadiConnect with full dataset...');

  // 1. Clear existing data
  await prisma.workerLocation.deleteMany({});
  await prisma.ratingReview.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.serviceRequest.deleteMany({});
  await prisma.providerService.deleteMany({});
  await prisma.providerProfile.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.cooperative.deleteMany({});
  await prisma.otpSession.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Seed Cooperatives
  const coop1 = await prisma.cooperative.create({
    data: {
      id: 'coop-1',
      name: 'Chennai Central Service Cooperative Society',
      registrationNumber: 'TN-CHN-COOP-4102',
      district: 'Chennai',
      state: 'Tamil Nadu',
      membersCount: 248,
      activeWorkersCount: 172,
      monthlyJobsCount: 892,
      monthlyEarningsTotal: 482000,
      welfareFundBalance: 48200,
      contactPerson: 'S. Ramanathan (Secretary)',
      contactMobile: '+91 94431 22890',
      address: '42, Usman Road, T. Nagar, Chennai',
      establishedYear: 2018,
    },
  });

  const coop2 = await prisma.cooperative.create({
    data: {
      id: 'coop-2',
      name: 'Cauvery & North Chennai Skilled Artisans Sahakari Sangam',
      registrationNumber: 'TN-CAU-COOP-1892',
      district: 'Chennai',
      state: 'Tamil Nadu',
      membersCount: 135,
      activeWorkersCount: 94,
      monthlyJobsCount: 460,
      monthlyEarningsTotal: 254000,
      welfareFundBalance: 25400,
      contactPerson: 'M. Velusamy',
      contactMobile: '+91 98942 55102',
      address: '15/B, 2nd Avenue, Anna Nagar, Chennai',
      establishedYear: 2020,
    },
  });

  const coop3 = await prisma.cooperative.create({
    data: {
      id: 'coop-3',
      name: 'South Chennai Urban Workers Cooperative Society',
      registrationNumber: 'TN-URB-COOP-5730',
      district: 'Chennai',
      state: 'Tamil Nadu',
      membersCount: 310,
      activeWorkersCount: 220,
      monthlyJobsCount: 1120,
      monthlyEarningsTotal: 615000,
      welfareFundBalance: 61500,
      contactPerson: 'K. Anbarasan',
      contactMobile: '+91 97890 33411',
      address: '78, Sardar Patel Road, Adyar, Chennai',
      establishedYear: 2016,
    },
  });

  // 3. Seed Service Categories
  const categoriesData = [
    {
      id: 'cat-plumbing',
      name: 'Plumbing',
      group: 'Home Services',
      description: 'Tap leakage, pipe burst, sanitary ware, water tank repair, drain block clearing',
      iconName: 'Wrench',
      skills: JSON.stringify(['Pipe Repair', 'Tap Repair', 'Water Tank Repair', 'Drain Cleaning', 'Bathroom Fitting']),
      basePrice: 350,
      urgencyDefault: 'medium',
    },
    {
      id: 'cat-electrical',
      name: 'Electrical',
      group: 'Home Services',
      description: 'Wiring fault, switchboard, fuse tripping, ceiling fan installation, MCB repair',
      iconName: 'Zap',
      skills: JSON.stringify(['Wiring Repair', 'Switchboard Repair', 'Fan Installation', 'MCB Tripping Fault', 'Earthing Test']),
      basePrice: 400,
      urgencyDefault: 'high',
    },
    {
      id: 'cat-cleaning',
      name: 'Deep Cleaning',
      group: 'Home Services',
      description: 'Kitchen degreasing, bathroom sanitization, floor scrubbing, post-renovation cleanup',
      iconName: 'Sparkles',
      skills: JSON.stringify(['Deep Home Cleaning', 'Bathroom Sanitization', 'Kitchen Degreasing', 'Sofa Shampooing']),
      basePrice: 650,
      urgencyDefault: 'low',
    },
    {
      id: 'cat-appliance',
      name: 'Appliance Repair',
      group: 'Home Services',
      description: 'AC servicing, refrigerator gas refilling, washing machine repair, microwave diagnosis',
      iconName: 'Tv',
      skills: JSON.stringify(['AC Servicing', 'Refrigerator Repair', 'Washing Machine Repair', 'Geyser Installation']),
      basePrice: 500,
      urgencyDefault: 'medium',
    },
    {
      id: 'cat-carpenter',
      name: 'Carpenter',
      group: 'Home Services',
      description: 'Door latch repair, furniture assembly, wooden wardrobe, cupboard hinges, lock fixing',
      iconName: 'Hammer',
      skills: JSON.stringify(['Door Alignment', 'Lock Fitting', 'Furniture Assembly', 'Cupboard Repair', 'Wood Polishing']),
      basePrice: 450,
      urgencyDefault: 'low',
    },
    {
      id: 'cat-painting',
      name: 'Painting',
      group: 'Home Services',
      description: 'Wall touch-up, waterproofing, exterior painting, wood varnish, interior repainting',
      iconName: 'Paintbrush',
      skills: JSON.stringify(['Wall Touchup', 'Waterproofing', 'Emulsion Painting', 'Enamel Paint', 'Distemper']),
      basePrice: 600,
      urgencyDefault: 'low',
    },
    {
      id: 'cat-mechanic',
      name: 'Mechanic & Vehicle Repair',
      group: 'Vehicle Services',
      description: 'Two-wheeler & car breakdown, brake check, engine tuning, roadside assistance',
      iconName: 'Car',
      skills: JSON.stringify(['Bike Breakdown Help', 'Car Engine Diagnostics', 'Brake Pad Replacement', 'Chain Lubrication']),
      basePrice: 450,
      urgencyDefault: 'high',
    },
    {
      id: 'cat-puncture',
      name: 'Puncture & Tyres',
      group: 'Vehicle Services',
      description: 'Mobile puncture repair, tubeless tyre patch, air inflation, emergency tyre swap',
      iconName: 'CircleDot',
      skills: JSON.stringify(['Tubeless Puncture Fix', 'Tube Patching', 'Mobile Tyre Assistance', 'Wheel Balancing']),
      basePrice: 250,
      urgencyDefault: 'emergency',
    },
  ];

  for (const cat of categoriesData) {
    await prisma.serviceCategory.create({ data: cat });
  }

  // 4. Seed Standard Demo Accounts
  const custUser = await prisma.user.create({
    data: {
      id: 'cust-101',
      name: 'Priya Sharma',
      mobile: '9842177312',
      email: 'priya.sharma@example.com',
      passwordHash,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      lat: 13.1147,
      lng: 80.1048,
      address: 'Avadi Main Road, Avadi',
      city: 'Avadi',
      pincode: '600054',
      landmark: 'Avadi Service Center',
    },
  });

  await prisma.user.create({
    data: {
      id: 'user-coop-admin',
      name: 'S. Ramanathan',
      mobile: '9988776655',
      email: 'chennai.coop@example.com',
      passwordHash,
      role: 'cooperative_admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      lat: 13.0450,
      lng: 80.2310,
      address: '42, Usman Road, T. Nagar, Chennai',
      city: 'Chennai',
      pincode: '600017',
    },
  });

  await prisma.user.create({
    data: {
      id: 'user-platform-admin',
      name: 'Platform Admin',
      mobile: '9112233445',
      email: 'admin@nammasevai.gov.in',
      passwordHash,
      role: 'platform_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lat: 13.0827,
      lng: 80.2707,
      address: 'Secretariat, Chennai',
      city: 'Chennai',
      pincode: '600009',
    },
  });

  // 5. Seed Diverse Workers
  const workersSeed = [
    {
      id: 'worker-1',
      userId: 'user-w-1',
      name: 'Arun Kumar',
      mobile: '9876543210',
      email: 'arun.plumber.chennai@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      headline: 'Master Plumber & Sanitary Specialist',
      bio: '8+ years of dedicated plumbing expertise in residential and commercial installations. Trained via National Skill Development Mission (NSDM). Proud member of Chennai Central Service Cooperative.',
      primaryCategory: 'Plumbing',
      skills: ['Pipe Repair', 'Tap Repair', 'Water Tank Repair', 'Drain Cleaning', 'Bathroom Fitting'],
      experienceYears: 8,
      rating: 4.85,
      completedJobs: 127,
      availability: 'available',
      lat: 13.1140,
      lng: 80.1060,
      address: 'Shop #4, Gandhi Nagar, Avadi',
      coopId: coop1.id,
      basePrice: 350,
      catId: 'cat-plumbing',
      verified: true,
    },
    {
      id: 'worker-2',
      userId: 'user-w-2',
      name: 'Vikram Singh',
      mobile: '9894012345',
      email: 'vikram.electrician@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      headline: "Licensed 'B' Grade Electrical Contractor",
      bio: '10 years experience in residential switchgear, inverter batteries, 3-phase wiring, and emergency short-circuit resolution. Reliable, safety-first approach.',
      primaryCategory: 'Electrical',
      skills: ['Wiring Repair', 'Switchboard Repair', 'Fan Installation', 'MCB Tripping Fault', 'Earthing Test'],
      experienceYears: 10,
      rating: 4.92,
      completedJobs: 215,
      availability: 'available',
      lat: 13.1180,
      lng: 80.1010,
      address: '11/A, Nehru Street, Avadi',
      coopId: coop2.id,
      basePrice: 400,
      catId: 'cat-electrical',
      verified: true,
    },
    {
      id: 'worker-3',
      userId: 'user-w-3',
      name: 'Kavitha Murugan',
      mobile: '9788199234',
      email: 'kavitha.cleaning@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      headline: 'Eco-Friendly Deep Cleaning & Sanitization Specialist',
      bio: 'Leader of 6-member women cooperative cleaning team. Specializes in intensive kitchen degreasing, bathroom anti-scale scrub, and festive deep sanitization.',
      primaryCategory: 'Deep Cleaning',
      skills: ['Deep Home Cleaning', 'Bathroom Sanitization', 'Kitchen Degreasing', 'Sofa Shampooing'],
      experienceYears: 6,
      rating: 4.78,
      completedJobs: 164,
      availability: 'available',
      lat: 13.1120,
      lng: 80.1030,
      address: '45, Bazar Road, Avadi',
      coopId: coop1.id,
      basePrice: 550,
      catId: 'cat-cleaning',
      verified: true,
    },
    {
      id: 'worker-4',
      userId: 'user-w-4',
      name: 'Murugan P.',
      mobile: '9486233819',
      email: 'murugan.carpenter@example.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      headline: 'Artisan Woodworker, Lock & Modular Fitting Expert',
      bio: '14 years in bespoke woodwork, teak restoration, sliding door gear, and European lock system replacements.',
      primaryCategory: 'Carpenter',
      skills: ['Door Alignment', 'Lock Fitting', 'Furniture Assembly', 'Cupboard Repair', 'Wood Polishing'],
      experienceYears: 14,
      rating: 4.88,
      completedJobs: 198,
      availability: 'available',
      lat: 13.1165,
      lng: 80.1080,
      address: '89, CTH Road, Avadi',
      coopId: coop3.id,
      basePrice: 450,
      catId: 'cat-carpenter',
      verified: true,
    },
    {
      id: 'worker-5',
      userId: 'user-w-5',
      name: 'Suresh Babu',
      mobile: '9360144820',
      email: 'suresh.mechanic@example.com',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      headline: 'Emergency 24x7 Roadside Mechanic & Two-Wheeler Tuning',
      bio: 'Mobile mechanic van equipped with battery jumper, compressor, and emergency spare kits. Fast response in Avadi.',
      primaryCategory: 'Mechanic & Vehicle Repair',
      skills: ['Bike Breakdown Help', 'Car Engine Diagnostics', 'Brake Pad Replacement', 'Chain Lubrication'],
      experienceYears: 11,
      rating: 4.90,
      completedJobs: 310,
      availability: 'available',
      lat: 13.1190,
      lng: 80.0980,
      address: '12, Military Road, Avadi',
      coopId: coop3.id,
      basePrice: 450,
      catId: 'cat-mechanic',
      verified: true,
    },
    {
      id: 'worker-6',
      userId: 'user-w-6',
      name: 'Rajesh Kannan',
      mobile: '9843210987',
      email: 'rajesh.appliance@example.com',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      headline: 'Inverter AC & Refrigeration Certified Tech',
      bio: 'Specialist in copper pipe brazing, gas leak detection, PCB board repairs for AC units.',
      primaryCategory: 'Appliance Repair',
      skills: ['AC Servicing', 'Refrigerator Repair', 'Washing Machine Repair', 'Geyser Installation'],
      experienceYears: 7,
      rating: 4.76,
      completedJobs: 142,
      availability: 'available',
      lat: 13.1130,
      lng: 80.1090,
      address: '22, Station Road, Avadi',
      coopId: coop1.id,
      basePrice: 500,
      catId: 'cat-appliance',
      verified: true,
    },
    {
      id: 'worker-7',
      userId: 'user-w-7',
      name: 'Dinesh Karthik',
      mobile: '9443376210',
      email: 'dinesh.puncture@example.com',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      headline: 'Rapid Puncture Doctor — On-Demand Mobile Tyre Service',
      bio: 'Equipped with battery powered compressor and plug tools. Arrives within 15 mins anywhere in Avadi.',
      primaryCategory: 'Puncture & Tyres',
      skills: ['Tubeless Puncture Fix', 'Tube Patching', 'Mobile Tyre Assistance', 'Wheel Balancing'],
      experienceYears: 5,
      rating: 4.95,
      completedJobs: 420,
      availability: 'available',
      lat: 13.1155,
      lng: 80.1020,
      address: '18, Market Road, Avadi',
      coopId: coop1.id,
      basePrice: 250,
      catId: 'cat-puncture',
      verified: true,
    },
    {
      id: 'worker-8',
      userId: 'user-w-8',
      name: 'Anthony Samy',
      mobile: '9894467123',
      email: 'anthony.painter@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      headline: 'Asian Paints Certified Master Painter',
      bio: 'Trained in airless spray painting, royal luxury finish, damp-proof exterior treatment, and dust-free sanding.',
      primaryCategory: 'Painting',
      skills: ['Wall Touchup', 'Waterproofing', 'Emulsion Painting', 'Enamel Paint', 'Distemper'],
      experienceYears: 9,
      rating: 4.81,
      completedJobs: 156,
      availability: 'available',
      lat: 13.1110,
      lng: 80.1070,
      address: '7, Kamaraj Nagar, Avadi',
      coopId: coop2.id,
      basePrice: 600,
      catId: 'cat-painting',
      verified: true,
    }
  ];

  for (const w of workersSeed) {
    const u = await prisma.user.create({
      data: {
        id: w.userId,
        name: w.name,
        mobile: w.mobile,
        email: w.email,
        passwordHash,
        role: 'worker',
        avatar: w.avatar,
        lat: w.lat,
        lng: w.lng,
        address: w.address,
        city: 'Avadi',
        pincode: '600054',
      },
    });

    const p = await prisma.providerProfile.create({
      data: {
        id: w.id,
        userId: u.id,
        cooperativeId: w.coopId,
        headline: w.headline,
        bio: w.bio,
        primaryCategory: w.primaryCategory,
        skills: JSON.stringify(w.skills),
        experienceYears: w.experienceYears,
        rating: w.rating,
        reviewsCount: Math.round(w.completedJobs / 5),
        availability: w.availability,
        isAvailable: w.availability === 'available',
        completedJobs: w.completedJobs,
        serviceRadiusKm: 10,
        baseChargePerHour: w.basePrice,
        verified: w.verified,
        isOverallVerified: w.verified,
        documents: JSON.stringify([
          {
            id: `doc-${w.id}-id`,
            type: 'identity',
            name: 'Govt Aadhaar ID (Verified)',
            fileUrl: '/docs/sample_id.pdf',
            status: 'verified',
            uploadedAt: '2023-04-10T09:00:00Z',
            verifiedAt: '2023-04-12T14:30:00Z',
            verifiedBy: 'Cooperative Committee',
          },
          {
            id: `doc-${w.id}-skill`,
            type: 'skill_certificate',
            name: `${w.primaryCategory} Trade Certificate`,
            fileUrl: '/docs/sample_cert.pdf',
            status: 'verified',
            uploadedAt: '2023-04-10T09:15:00Z',
            verifiedAt: '2023-04-12T15:00:00Z',
            verifiedBy: 'Technical Officer',
          }
        ]),
        verifications: JSON.stringify({
          identity: 'verified',
          skill: 'verified',
          shop: 'verified',
          mobile: 'verified',
        }),
      },
    });

    await prisma.providerService.create({
      data: {
        providerId: p.id,
        serviceCategoryId: w.catId,
        customPrice: w.basePrice,
      },
    });
  }

  // Sample Completed Service Request
  const sampleReq = await prisma.serviceRequest.create({
    data: {
      id: 'req-1001',
      customerId: custUser.id,
      assignedWorkerId: 'worker-1',
      serviceCategoryId: 'cat-plumbing',
      categoryName: 'Plumbing',
      requiredSkill: 'Pipe Repair',
      problemDescription: 'Main kitchen pipe leakage under sink and bathroom tap drip.',
      urgency: 'medium',
      isEmergency: false,
      status: 'completed',
      locationLat: 13.1147,
      locationLng: 80.1048,
      address: 'Avadi Main Road, Avadi',
      city: 'Avadi',
      pincode: '600054',
      amount: 450,
      workerEarnings: 382.5,
      cooperativeFee: 45,
      platformFee: 22.5,
      paymentStatus: 'completed',
      paymentMethod: 'UPI',
      verificationOtp: '4821',
      matchScore: 94,
      matchReasons: JSON.stringify(['Direct skill match for Pipe Repair', 'Top rated within 3km', 'Available immediately']),
      completedAt: new Date(Date.now() - 3600000),
      paidAt: new Date(Date.now() - 3000000),
      rating: 5.0,
      reviewText: 'Arun arrived on time, was extremely polite, and solved the leak in 25 mins. Transparent pricing!',
    },
  });

  await prisma.booking.create({
    data: {
      id: 'book-1001',
      serviceRequestId: sampleReq.id,
      customerId: custUser.id,
      providerId: 'worker-1',
      serviceCategoryId: 'cat-plumbing',
      status: 'completed',
      description: 'Main kitchen pipe leakage under sink',
      totalAmount: 450,
      workerEarnings: 382.5,
      cooperativeFee: 45,
      platformFee: 22.5,
      locationLat: 13.1147,
      locationLng: 80.1048,
      address: 'Avadi Main Road, Avadi',
      rating: 5.0,
      reviewText: 'Arun arrived on time, was extremely polite, and solved the leak in 25 mins. Transparent pricing!',
    },
  });

  await prisma.ratingReview.create({
    data: {
      id: 'rev-1001',
      serviceRequestId: sampleReq.id,
      customerId: custUser.id,
      workerId: 'worker-1',
      rating: 5.0,
      reviewText: 'Arun arrived on time, was extremely polite, and solved the leak in 25 mins. Transparent pricing!',
      serviceCategory: 'Plumbing',
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        id: 'notif-1',
        targetRole: 'customer',
        targetUserId: custUser.id,
        title: 'Welcome to Avadi Connect!',
        message: 'Your account is verified. Find skilled and verified local artisans in Avadi with transparent pricing.',
        type: 'alert',
        read: true,
      },
      {
        id: 'notif-2',
        targetRole: 'worker',
        targetUserId: 'worker-1',
        title: 'New Service Request Nearby',
        message: 'Priya Sharma requested Plumbing (Pipe Repair) in Avadi. Est: ₹450.',
        type: 'job',
        read: false,
      },
      {
        id: 'notif-3',
        targetRole: 'platform_admin',
        title: 'Platform System Ready',
        message: 'All cooperatives, verification pipelines, and payment ledger mechanisms operational.',
        type: 'alert',
        read: false,
      }
    ],
  });

  console.log('Database seeded successfully with all categories, workers, and cooperatives in Avadi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
