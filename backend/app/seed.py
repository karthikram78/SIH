import json
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import (
    User,
    Cooperative,
    ServiceCategory,
    Worker,
    WorkerDocument,
    ServiceRequest,
    RatingReview,
    Notification,
    DemandForecast
)

def seed_database(db: Session):
    # Check if data already exists
    if db.query(Cooperative).first():
        print("Database already seeded. Skipping.")
        return

    print("Seeding Namma Sevai database...")

    # 1. Seed Customer User
    customer = User(
        id="cust-101",
        name="Priya Sharma",
        mobile="+91 98421 77312",
        email="priya.sharma@example.com",
        role="customer",
        avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        lat=13.1147,
        lng=80.1048,
        address="Avadi Main Road, Avadi",
        city="Avadi",
        pincode="600054",
        landmark="Avadi Service Center",
        created_at="2024-01-15T10:00:00Z"
    )
    db.add(customer)

    # 2. Seed Cooperatives
    cooperatives_data = [
        {
            "id": "coop-1",
            "name": "Chennai Local Service Cooperative Society",
            "registration_number": "TN-CHN-COOP-4102",
            "district": "Chennai",
            "state": "Tamil Nadu",
            "members_count": 248,
            "active_workers_count": 172,
            "monthly_jobs_count": 892,
            "monthly_earnings_total": 482000.0,
            "welfare_fund_balance": 48200.0,
            "contact_person": "S. Ramanathan (Secretary)",
            "contact_mobile": "+91 94431 22890",
            "address": "42, Rockfort Bazaar Road, Teppakulam, Chennai",
            "established_year": 2018
        },
        {
            "id": "coop-2",
            "name": "Cauvery Skilled Artisans Sahakari Sangam",
            "registration_number": "TN-CAU-COOP-1892",
            "district": "Chennai",
            "state": "Tamil Nadu",
            "members_count": 135,
            "active_workers_count": 94,
            "monthly_jobs_count": 460,
            "monthly_earnings_total": 254000.0,
            "welfare_fund_balance": 25400.0,
            "contact_person": "M. Velusamy",
            "contact_mobile": "+91 98942 55102",
            "address": "15/B, Anna Nagar Main Road, Tennur, Chennai",
            "established_year": 2020
        },
        {
            "id": "coop-3",
            "name": "Tamil Nadu Urban Workers Cooperative Society",
            "registration_number": "TN-URB-COOP-5730",
            "district": "Chennai",
            "state": "Tamil Nadu",
            "members_count": 310,
            "active_workers_count": 220,
            "monthly_jobs_count": 1120,
            "monthly_earnings_total": 615000.0,
            "welfare_fund_balance": 61500.0,
            "contact_person": "K. Anbarasan",
            "contact_mobile": "+91 97890 33411",
            "address": "78, Cantonment Court Road, Chennai",
            "established_year": 2016
        }
    ]
    for c_data in cooperatives_data:
        db.add(Cooperative(**c_data))

    # 3. Seed Service Categories
    categories_data = [
        {
            "id": "cat-plumbing",
            "name": "Plumbing",
            "group": "Home Services",
            "description": "Tap leakage, pipe burst, sanitary ware, water tank repair, drain block clearing",
            "icon_name": "Wrench",
            "skills": ["Pipe Repair", "Tap Repair", "Water Tank Repair", "Drain Cleaning", "Bathroom Fitting"],
            "base_price": 350.0,
            "urgency_default": "medium"
        },
        {
            "id": "cat-electrical",
            "name": "Electrical",
            "group": "Home Services",
            "description": "Wiring fault, switchboard, fuse tripping, ceiling fan installation, MCB repair",
            "icon_name": "Zap",
            "skills": ["Wiring Repair", "Switchboard Repair", "Fan Installation", "MCB Tripping Fault", "Earthing Test"],
            "base_price": 400.0,
            "urgency_default": "high"
        },
        {
            "id": "cat-cleaning",
            "name": "Deep Cleaning",
            "group": "Home Services",
            "description": "Kitchen degreasing, bathroom sanitization, floor scrubbing, post-renovation cleanup",
            "icon_name": "Sparkles",
            "skills": ["Deep Home Cleaning", "Bathroom Sanitization", "Kitchen Degreasing", "Sofa Shampooing"],
            "base_price": 650.0,
            "urgency_default": "low"
        },
        {
            "id": "cat-appliance",
            "name": "Appliance Repair",
            "group": "Home Services",
            "description": "AC servicing, refrigerator gas refilling, washing machine repair, microwave diagnosis",
            "icon_name": "Tv",
            "skills": ["AC Servicing", "Refrigerator Repair", "Washing Machine Repair", "Geyser Installation"],
            "base_price": 500.0,
            "urgency_default": "medium"
        },
        {
            "id": "cat-carpenter",
            "name": "Carpenter",
            "group": "Home Services",
            "description": "Door latch repair, furniture assembly, wooden wardrobe, cupboard hinges, lock fixing",
            "icon_name": "Hammer",
            "skills": ["Door Alignment", "Lock Fitting", "Furniture Assembly", "Cupboard Repair", "Wood Polishing"],
            "base_price": 450.0,
            "urgency_default": "low"
        },
        {
            "id": "cat-painting",
            "name": "Painting",
            "group": "Home Services",
            "description": "Wall touch-up, waterproofing, exterior painting, wood varnish, interior repainting",
            "icon_name": "Paintbrush",
            "skills": ["Wall Touchup", "Waterproofing", "Emulsion Painting", "Enamel Paint", "Distemper"],
            "base_price": 600.0,
            "urgency_default": "low"
        },
        {
            "id": "cat-mechanic",
            "name": "Mechanic & Vehicle Repair",
            "group": "Vehicle Services",
            "description": "Two-wheeler & car breakdown, brake check, engine tuning, roadside assistance",
            "icon_name": "Car",
            "skills": ["Bike Breakdown Help", "Car Engine Diagnostics", "Brake Pad Replacement", "Chain Lubrication"],
            "base_price": 450.0,
            "urgency_default": "high"
        },
        {
            "id": "cat-puncture",
            "name": "Puncture & Tyres",
            "group": "Vehicle Services",
            "description": "Mobile puncture repair, tubeless tyre patch, air inflation, emergency tyre swap",
            "icon_name": "CircleDot",
            "skills": ["Tubeless Puncture Fix", "Tube Patching", "Mobile Tyre Assistance", "Wheel Balancing"],
            "base_price": 250.0,
            "urgency_default": "emergency"
        },
        {
            "id": "cat-mason",
            "name": "Mason & Tiles",
            "group": "Community Services",
            "description": "Tile replacement, wall plastering, cement patch work, civil repairs, terrace crack fill",
            "icon_name": "BrickWall",
            "skills": ["Tile Fitting", "Plastering", "Wall Crack Repair", "Paving & Cementing"],
            "base_price": 550.0,
            "urgency_default": "low"
        },
        {
            "id": "cat-gardener",
            "name": "Gardening & Lawn",
            "group": "Community Services",
            "description": "Plant trimming, lawn mowing, terrace garden setup, weed removal, soil pest treatment",
            "icon_name": "Sprout",
            "skills": ["Tree Pruning", "Lawn Mowing", "Soil Fertilization", "Terrace Garden Care"],
            "base_price": 350.0,
            "urgency_default": "low"
        },
        {
            "id": "cat-cook",
            "name": "Cook & Kitchen Help",
            "group": "Personal Services",
            "description": "Daily home cooked meals, festival banquet helper, North & South Indian meals",
            "icon_name": "ChefHat",
            "skills": ["Vegetarian Cooking", "South Indian Tiffin", "Meal Prep Helper", "Festival Sweets"],
            "base_price": 500.0,
            "urgency_default": "low"
        },
        {
            "id": "cat-helper",
            "name": "Moving & General Helper",
            "group": "Personal Services",
            "description": "Heavy furniture shifting, carton loading/unloading, store helpers, event assistance",
            "icon_name": "Truck",
            "skills": ["Heavy Shifting", "Carton Packing", "Loading/Unloading", "Event Setup Assistant"],
            "base_price": 400.0,
            "urgency_default": "medium"
        }
    ]
    for cat_data in categories_data:
        db.add(ServiceCategory(**cat_data))

    # 4. Seed Workers
    workers_seed = [
        {
            "id": "worker-1",
            "user_id": "user-w-1",
            "name": "Arun Kumar",
            "mobile": "+91 94421 88392",
            "email": "arun.plumber.trichy@example.com",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "headline": "Master Plumber & Sanitary Specialist",
            "bio": "8+ years of dedicated plumbing expertise in residential and commercial installations. Trained via National Skill Development Mission (NSDM). Proud member of Chennai Local Service Cooperative.",
            "primary_category": "Plumbing",
            "skills": ["Pipe Repair", "Tap Repair", "Water Tank Repair", "Drain Cleaning", "Bathroom Fitting"],
            "experience_years": 8,
            "rating": 4.85,
            "completed_jobs_count": 127,
            "availability": "available",
            "lat": 13.0450,
            "lng": 80.2310,
            "address": "24, Salai Road, Woraiyur",
            "city": "Chennai",
            "pincode": "620003",
            "landmark": "Near Nachiar Temple",
            "service_radius_km": 8.0,
            "base_charge_per_hour": 350.0,
            "cooperative_id": "coop-1",
            "cooperative_name": "Chennai Local Service Cooperative Society",
            "shop": {
                "id": "shop-1",
                "name": "Arun Plumbing & Hardware Works",
                "address": "Shop #4, Woraiyur Main Bazaar, Chennai",
                "photoUrl": "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&auto=format&fit=crop&q=80",
                "lat": 13.0450,
                "lng": 80.2310,
                "establishedYear": 2017,
                "isShopVerified": True
            },
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2023-04-10",
            "response_time_minutes": 7,
            "docs": [
                {"id": "doc-1", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/sample_aadhaar_card.pdf", "status": "verified"},
                {"id": "doc-2", "type": "skill_certificate", "name": "ITI Plumber Trade Certification", "file_url": "/docs/iti_plumbing_certificate.pdf", "status": "verified"},
                {"id": "doc-3", "type": "shop_proof", "name": "City Corporation Trade License", "file_url": "/docs/shop_license_woraiyur.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-2",
            "user_id": "user-w-2",
            "name": "Vikram Singh",
            "mobile": "+91 98940 12345",
            "email": "vikram.electrician@example.com",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "headline": "Licensed 'B' Grade Electrical Contractor",
            "bio": "10 years experience in residential switchgear, inverter batteries, 3-phase wiring, and emergency short-circuit resolution. Reliable, safety-first approach.",
            "primary_category": "Electrical",
            "skills": ["Wiring Repair", "Switchboard Repair", "Fan Installation", "MCB Tripping Fault", "Earthing Test"],
            "experience_years": 10,
            "rating": 4.92,
            "completed_jobs_count": 215,
            "availability": "available",
            "lat": 13.0850,
            "lng": 80.2101,
            "address": "11/A, Anna Nagar 3rd Street, Tennur",
            "city": "Chennai",
            "pincode": "620017",
            "landmark": "Near Bishop Heber Higher Secondary",
            "service_radius_km": 10.0,
            "base_charge_per_hour": 400.0,
            "cooperative_id": "coop-2",
            "cooperative_name": "Cauvery Skilled Artisans Sahakari Sangam",
            "shop": {
                "id": "shop-2",
                "name": "Vikram Electricals & Spares",
                "address": "Opp. Tennur Bus Stand, Chennai",
                "photoUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80",
                "lat": 13.0850,
                "lng": 80.2101,
                "establishedYear": 2015,
                "isShopVerified": True
            },
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2022-11-15",
            "response_time_minutes": 5,
            "docs": [
                {"id": "doc-21", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/vikram_aadhaar.pdf", "status": "verified"},
                {"id": "doc-22", "type": "skill_certificate", "name": "Electrical Licensing Board 'B' Grade License", "file_url": "/docs/electrical_b_license.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-3",
            "user_id": "user-w-3",
            "name": "M. Murugan",
            "mobile": "+91 94435 67890",
            "email": "murugan.puncture@example.com",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
            "headline": "Rapid Emergency Tyre & Puncture Technician",
            "bio": "24/7 mobile bike and car roadside puncture assistance with electric high-pressure air pump and tubeless mushroom plug tools.",
            "primary_category": "Puncture & Tyres",
            "skills": ["Tubeless Puncture Fix", "Tube Patching", "Mobile Tyre Assistance", "Wheel Balancing"],
            "experience_years": 12,
            "rating": 4.88,
            "completed_jobs_count": 340,
            "availability": "available",
            "lat": 10.8250,
            "lng": 80.2565,
            "address": "Near Thillai Nagar Underpass, Karur Bypass",
            "city": "Chennai",
            "pincode": "600017",
            "landmark": "Near Maruthi Service Center",
            "service_radius_km": 15.0,
            "base_charge_per_hour": 250.0,
            "cooperative_id": "coop-1",
            "cooperative_name": "Chennai Local Service Cooperative Society",
            "shop": {
                "id": "shop-3",
                "name": "Murugan Mobile Vulcanizing Works",
                "address": "Near Karur Bypass Junction, Thillai Nagar, Chennai",
                "photoUrl": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80",
                "lat": 10.8250,
                "lng": 80.2565,
                "establishedYear": 2012,
                "isShopVerified": True
            },
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2021-08-20",
            "response_time_minutes": 6,
            "docs": [
                {"id": "doc-31", "type": "identity", "name": "Govt Voter ID & Aadhaar", "file_url": "/docs/murugan_id.pdf", "status": "verified"},
                {"id": "doc-32", "type": "shop_proof", "name": "Cooperative Mobile Unit Certificate", "file_url": "/docs/mobile_unit_cert.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-4",
            "user_id": "user-w-4",
            "name": "S. Rajesh Kannan",
            "mobile": "+91 97891 23456",
            "email": "rajesh.mechanic@example.com",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
            "headline": "Two-Wheeler Breakdown Specialist & EFI Diagnostician",
            "bio": "Certified mechanic specialized in modern BS6 fuel-injected bikes, scooter CVT transmission repairs, and on-spot roadside jumpstart.",
            "primary_category": "Mechanic & Vehicle Repair",
            "skills": ["Bike Breakdown Help", "Car Engine Diagnostics", "Brake Pad Replacement", "Chain Lubrication"],
            "experience_years": 9,
            "rating": 4.78,
            "completed_jobs_count": 184,
            "availability": "available",
            "lat": 10.8310,
            "lng": 78.6920,
            "address": "8, Gandhi Market Road",
            "city": "Chennai",
            "pincode": "620008",
            "landmark": "Near Diamond Clock Tower",
            "service_radius_km": 12.0,
            "base_charge_per_hour": 450.0,
            "cooperative_id": "coop-3",
            "cooperative_name": "Tamil Nadu Urban Workers Cooperative Society",
            "shop": {
                "id": "shop-4",
                "name": "Rajesh Auto Garage",
                "address": "45, East Boulevard Road, Chennai",
                "photoUrl": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=80",
                "lat": 10.8310,
                "lng": 78.6920,
                "establishedYear": 2016,
                "isShopVerified": True
            },
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2022-03-01",
            "response_time_minutes": 10,
            "docs": [
                {"id": "doc-41", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/rajesh_id.pdf", "status": "verified"},
                {"id": "doc-42", "type": "skill_certificate", "name": "Automotive Skill Development Council (ASDC) Certificate", "file_url": "/docs/asdc_cert.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-5",
            "user_id": "user-w-5",
            "name": "K. Meenakshi Ammal",
            "mobile": "+91 94881 33456",
            "email": "meenakshi.cleaning@example.com",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
            "headline": "Professional Deep Cleaning & Sanitization Lead",
            "bio": "Lead supervisor of 4-member cooperative women cleaning cluster. Uses hospital-grade eco-friendly chemicals for spotless kitchens, bathrooms, and floor buffing.",
            "primary_category": "Deep Cleaning",
            "skills": ["Deep Home Cleaning", "Bathroom Sanitization", "Kitchen Degreasing", "Sofa Shampooing"],
            "experience_years": 6,
            "rating": 4.95,
            "completed_jobs_count": 158,
            "availability": "available",
            "lat": 10.8220,
            "lng": 78.6870,
            "address": "32, V.O.C Street, K.K. Nagar",
            "city": "Chennai",
            "pincode": "620021",
            "landmark": "Near LIC Colony Park",
            "service_radius_km": 10.0,
            "base_charge_per_hour": 600.0,
            "cooperative_id": "coop-1",
            "cooperative_name": "Chennai Local Service Cooperative Society",
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2023-01-18",
            "response_time_minutes": 15,
            "docs": [
                {"id": "doc-51", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/meenakshi_id.pdf", "status": "verified"},
                {"id": "doc-52", "type": "skill_certificate", "name": "Hygiene & Sanitization Standard Guild Badge", "file_url": "/docs/hygiene_cert.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-6",
            "user_id": "user-w-6",
            "name": "N. Senthil Nathan",
            "mobile": "+91 98432 99876",
            "email": "senthil.hvac@example.com",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
            "headline": "Inverter AC & Refrigeration System Technician",
            "bio": "Certified HVAC expert with specialized vacuum pumps and digital manifold gauges. Expert in R32/R410A gas charging and compressor repair.",
            "primary_category": "Appliance Repair",
            "skills": ["AC Servicing", "Refrigerator Repair", "Washing Machine Repair", "Geyser Installation"],
            "experience_years": 11,
            "rating": 4.87,
            "completed_jobs_count": 276,
            "availability": "available",
            "lat": 10.8330,
            "lng": 78.6870,
            "address": "6/3, Main Guard Gate Road",
            "city": "Chennai",
            "pincode": "620002",
            "landmark": "Opposite St. Joseph College Ground",
            "service_radius_km": 12.0,
            "base_charge_per_hour": 500.0,
            "cooperative_id": "coop-2",
            "cooperative_name": "Cauvery Skilled Artisans Sahakari Sangam",
            "shop": {
                "id": "shop-6",
                "name": "Senthil Cooling & Aircon Works",
                "address": "12, Fort Station Road, Chennai",
                "photoUrl": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
                "lat": 10.8330,
                "lng": 78.6870,
                "establishedYear": 2014,
                "isShopVerified": True
            },
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2022-06-10",
            "response_time_minutes": 8,
            "docs": [
                {"id": "doc-61", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/senthil_id.pdf", "status": "verified"},
                {"id": "doc-62", "type": "skill_certificate", "name": "Voltas & Daikin Authorized Technician Certificate", "file_url": "/docs/daikin_cert.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-7",
            "user_id": "user-w-7",
            "name": "P. Dharmaraj",
            "mobile": "+91 97880 11223",
            "email": "dharmaraj.carpenter@example.com",
            "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
            "headline": "Master Carpenter, Modular Fittings & Locksmith",
            "bio": "14 years of craftsmanship in teakwood doors, hydraulic cabinet hinges, Yale/Godrej high-security digital lock installations, and bespoke furniture repairs.",
            "primary_category": "Carpenter",
            "skills": ["Door Alignment", "Lock Fitting", "Furniture Assembly", "Cupboard Repair", "Wood Polishing"],
            "experience_years": 14,
            "rating": 4.90,
            "completed_jobs_count": 195,
            "availability": "available",
            "lat": 10.8280,
            "lng": 78.6960,
            "address": "52, Madurai Road, Palakkarai",
            "city": "Chennai",
            "pincode": "620001",
            "landmark": "Near Prabhat Theatre",
            "service_radius_km": 10.0,
            "base_charge_per_hour": 450.0,
            "cooperative_id": "coop-2",
            "cooperative_name": "Cauvery Skilled Artisans Sahakari Sangam",
            "shop": {
                "id": "shop-7",
                "name": "Dharmaraj Wood Craft & Lock House",
                "address": "52, Madurai Road, Palakkarai, Chennai",
                "photoUrl": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=80",
                "lat": 10.8280,
                "lng": 78.6960,
                "establishedYear": 2011,
                "isShopVerified": True
            },
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2021-05-14",
            "response_time_minutes": 12,
            "docs": [
                {"id": "doc-71", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/dharmaraj_id.pdf", "status": "verified"},
                {"id": "doc-72", "type": "shop_proof", "name": "Carpenter Guild Master Certificate", "file_url": "/docs/guild_cert.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-8",
            "user_id": "user-w-8",
            "name": "K. Selvi",
            "mobile": "+91 94420 55432",
            "email": "selvi.cook@example.com",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "headline": "Traditional South Indian Cook & Meal Preparation Specialist",
            "bio": "Over 7 years catering delicious home-style vegetarian breakfasts, festival meals, and balanced diabetic-friendly diet options.",
            "primary_category": "Cook & Kitchen Help",
            "skills": ["Vegetarian Cooking", "South Indian Tiffin", "Meal Prep Helper", "Festival Sweets"],
            "experience_years": 7,
            "rating": 4.84,
            "completed_jobs_count": 89,
            "availability": "available",
            "lat": 10.8360,
            "lng": 78.6880,
            "address": "19, Big Bazaar Street",
            "city": "Chennai",
            "pincode": "620008",
            "landmark": "Near Teppakulam West",
            "service_radius_km": 6.0,
            "base_charge_per_hour": 400.0,
            "cooperative_id": "coop-1",
            "cooperative_name": "Chennai Local Service Cooperative Society",
            "verifications": {"identity": "verified", "skill": "verified", "shop": "pending", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2023-07-15",
            "response_time_minutes": 20,
            "docs": [
                {"id": "doc-81", "type": "identity", "name": "Govt Ration Card & Aadhaar", "file_url": "/docs/selvi_id.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-9",
            "user_id": "user-w-9",
            "name": "R. Soundararajan",
            "mobile": "+91 94432 89012",
            "email": "soundar.mason@example.com",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "headline": "Master Mason, Tile Laying & Waterproofing Specialist",
            "bio": "Over 16 years handling precision floor tiling, compound wall crack grouting, and terrace drainage slopes.",
            "primary_category": "Mason & Tiles",
            "skills": ["Tile Fitting", "Plastering", "Wall Crack Repair", "Paving & Cementing"],
            "experience_years": 16,
            "rating": 4.70,
            "completed_jobs_count": 220,
            "availability": "offline",
            "lat": 10.8410,
            "lng": 78.6750,
            "address": "Near Uyyakondan Canal, Srirangam Link",
            "city": "Chennai",
            "pincode": "620006",
            "landmark": "Near Gandhi Park",
            "service_radius_km": 10.0,
            "base_charge_per_hour": 550.0,
            "cooperative_id": "coop-2",
            "cooperative_name": "Cauvery Skilled Artisans Sahakari Sangam",
            "verifications": {"identity": "verified", "skill": "verified", "shop": "verified", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2022-09-01",
            "response_time_minutes": 30,
            "docs": [
                {"id": "doc-91", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/soundar_id.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-10",
            "user_id": "user-w-10",
            "name": "M. Anthony Samy",
            "mobile": "+91 98944 67123",
            "email": "anthony.painter@example.com",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
            "headline": "Asian Paints Certified Master Painter",
            "bio": "Trained in airless spray painting, royal luxury finish, damp-proof exterior treatment, and dust-free sanding.",
            "primary_category": "Painting",
            "skills": ["Wall Touchup", "Waterproofing", "Emulsion Painting", "Enamel Paint", "Distemper"],
            "experience_years": 9,
            "rating": 4.81,
            "completed_jobs_count": 156,
            "availability": "available",
            "lat": 10.8210,
            "lng": 80.2180,
            "address": "Crawford Main Road",
            "city": "Chennai",
            "pincode": "620012",
            "landmark": "Near St. Joseph Convent",
            "service_radius_km": 12.0,
            "base_charge_per_hour": 500.0,
            "cooperative_id": "coop-1",
            "cooperative_name": "Chennai Local Service Cooperative Society",
            "verifications": {"identity": "verified", "skill": "verified", "shop": "pending", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2023-08-01",
            "response_time_minutes": 14,
            "docs": [
                {"id": "doc-101", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/anthony_id.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-11",
            "user_id": "user-w-11",
            "name": "G. Kannan",
            "mobile": "+91 97892 45671",
            "email": "kannan.gardener@example.com",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
            "headline": "Organic Horticulturist & Terrace Garden Architect",
            "bio": "Specialist in drip irrigation setups, bonsai pruning, vermicompost enrichment, and seasonal flowering beds.",
            "primary_category": "Gardening & Lawn",
            "skills": ["Tree Pruning", "Lawn Mowing", "Soil Fertilization", "Terrace Garden Care"],
            "experience_years": 7,
            "rating": 4.79,
            "completed_jobs_count": 110,
            "availability": "available",
            "lat": 10.8380,
            "lng": 78.6820,
            "address": "Kallukuzhi, Cantonment North",
            "city": "Chennai",
            "pincode": "620020",
            "landmark": "Near Railway Stadium",
            "service_radius_km": 8.0,
            "base_charge_per_hour": 350.0,
            "cooperative_id": "coop-1",
            "cooperative_name": "Chennai Local Service Cooperative Society",
            "verifications": {"identity": "verified", "skill": "verified", "shop": "pending", "mobile": "verified"},
            "is_overall_verified": True,
            "joined_date": "2023-09-10",
            "response_time_minutes": 18,
            "docs": [
                {"id": "doc-111", "type": "identity", "name": "Govt Aadhaar ID", "file_url": "/docs/kannan_g_id.pdf", "status": "verified"}
            ]
        },
        {
            "id": "worker-12",
            "user_id": "user-w-12",
            "name": "V. Prakash",
            "mobile": "+91 94871 23456",
            "email": "prakash.applicant@example.com",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "headline": "Plumbing Apprentice & Sanitation Technician (Applicant)",
            "bio": "Recently completed vocational training in plumbing. Applied for membership with Chennai Cooperative for verification.",
            "primary_category": "Plumbing",
            "skills": ["Pipe Repair", "Tap Repair", "Drain Cleaning"],
            "experience_years": 2,
            "rating": 4.5,
            "completed_jobs_count": 12,
            "availability": "available",
            "lat": 10.8300,
            "lng": 78.6900,
            "address": "14, Periyar Nagar, Thillai Nagar East",
            "city": "Chennai",
            "pincode": "600017",
            "landmark": "Near Corporation Park",
            "service_radius_km": 5.0,
            "base_charge_per_hour": 280.0,
            "cooperative_id": "coop-1",
            "cooperative_name": "Chennai Local Service Cooperative Society",
            "shop": {
                "id": "shop-12",
                "name": "Cooperative Shared Workbench",
                "address": "Chennai Cooperative Workshop",
                "photoUrl": "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&auto=format&fit=crop&q=80",
                "lat": 10.8300,
                "lng": 78.6900,
                "establishedYear": 2024,
                "isShopVerified": False
            },
            "verifications": {"identity": "pending", "skill": "pending", "shop": "pending", "mobile": "verified"},
            "is_overall_verified": False,
            "joined_date": "2024-09-01",
            "response_time_minutes": 10,
            "docs": [
                {"id": "doc-121", "type": "identity", "name": "Govt Aadhaar Card (Applicant)", "file_url": "/docs/prakash_aadhaar_dummy.pdf", "status": "pending", "notes": "Submitted for verification by platform admin"},
                {"id": "doc-122", "type": "skill_certificate", "name": "Govt ITI Certificate in Plumbing", "file_url": "/docs/prakash_iti_dummy.pdf", "status": "pending", "notes": "ITI Chennai passing certificate 2023"},
                {"id": "doc-123", "type": "shop_proof", "name": "Workplace Workshop Photo", "file_url": "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&auto=format&fit=crop&q=80", "status": "pending", "notes": "Cooperative shared workbench"}
            ]
        }
    ]

    for w_data in workers_seed:
        w_data["lat"] = 13.1147
        w_data["lng"] = 80.1048
        w_data["address"] = "Avadi Main Road, Avadi"
        w_data["city"] = "Avadi"
        w_data["pincode"] = "600054"
        docs = w_data.pop("docs", [])
        worker = Worker(**w_data)
        db.add(worker)
        for d in docs:
            doc = WorkerDocument(
                id=d["id"],
                worker_id=w_data["id"],
                type=d["type"],
                name=d["name"],
                file_url=d["file_url"],
                status=d.get("status", "pending"),
                notes=d.get("notes")
            )
            db.add(doc)

    # 5. Seed Service Requests
    req1 = ServiceRequest(
        id="req-301",
        customer_id="cust-101",
        customer_name="Priya Sharma",
        customer_mobile="+91 98421 77312",
        service_category="Plumbing",
        required_skill="Pipe/Tap Repair",
        problem_description="My kitchen sink faucet is dripping constantly and lower pipe connection is leaking water under the cabinet.",
        urgency="medium",
        is_emergency=False,
        lat=13.0418,
        lng=80.2341,
        address="Flat 302, Cauvery Heights, Usman Road, T. Nagar",
        city="Chennai",
        pincode="600017",
        status="paid",
        assigned_worker_id="worker-1",
        match_score=94.0,
        match_reasons=[
            "Exact skill match: Tap & Pipe Repair",
            "Worker is just 1.4 km away",
            "Available immediately",
            "4.85 Rating with 127 verified jobs",
            "Certified member of Chennai Local Service Cooperative"
        ],
        created_at="2024-09-02T09:15:00Z",
        accepted_at="2024-09-02T09:18:00Z",
        arrived_at="2024-09-02T09:32:00Z",
        started_at="2024-09-02T09:35:00Z",
        completed_at="2024-09-02T10:20:00Z",
        paid_at="2024-09-02T10:25:00Z",
        amount=500.0,
        worker_earnings=425.0,  # 85%
        cooperative_contribution=50.0,  # 10%
        platform_fee=25.0,  # 5%
        payment_method="UPI",
        payment_status="completed",
        rating=5.0,
        review_text="Arun arrived on time, was very respectful and replaced the worn washer in 35 minutes. No more dripping! Proud to support cooperative workers.",
        verification_otp="7412"
    )
    db.add(req1)

    req2 = ServiceRequest(
        id="req-302",
        customer_id="cust-102",
        customer_name="K. Srinivasan",
        customer_mobile="+91 94431 55667",
        service_category="Electrical",
        required_skill="MCB Tripping Fault",
        problem_description="Main MCB switch continuously trips whenever AC is turned on in master bedroom.",
        urgency="high",
        is_emergency=False,
        lat=10.8320,
        lng=78.6910,
        address="18, Tennur High Road",
        city="Chennai",
        pincode="620017",
        status="completed",
        assigned_worker_id="worker-2",
        match_score=92.0,
        match_reasons=[
            "Licensed B-Grade electrical contractor",
            "1.1 km away",
            "Fast 5 min response time record"
        ],
        created_at="2024-09-03T11:00:00Z",
        completed_at="2024-09-03T12:15:00Z",
        amount=600.0,
        worker_earnings=510.0,  # 85%
        cooperative_contribution=60.0,  # 10%
        platform_fee=30.0,  # 5%
        payment_method="UPI",
        payment_status="completed",
        rating=5.0,
        review_text="Vikram detected an earthing leakage quickly. Very technical, safe work, brought genuine spare MCB.",
        verification_otp="5923"
    )
    db.add(req2)

    # 6. Seed Reviews
    reviews_data = [
        {
            "id": "rev-1",
            "service_request_id": "req-301",
            "worker_id": "worker-1",
            "customer_id": "cust-101",
            "customer_name": "Priya Sharma",
            "rating": 5.0,
            "review_text": "Arun arrived on time, was very respectful and replaced the worn washer in 35 minutes. No more dripping! Proud to support cooperative workers.",
            "created_at": "2024-09-02T10:26:00Z",
            "service_category": "Plumbing"
        },
        {
            "id": "rev-2",
            "service_request_id": "req-302",
            "worker_id": "worker-2",
            "customer_id": "cust-102",
            "customer_name": "K. Srinivasan",
            "rating": 5.0,
            "review_text": "Vikram detected an earthing leakage quickly. Very technical, safe work, brought genuine spare MCB.",
            "created_at": "2024-09-03T12:16:00Z",
            "service_category": "Electrical"
        },
        {
            "id": "rev-3",
            "service_request_id": "req-303",
            "worker_id": "worker-1",
            "customer_id": "cust-103",
            "customer_name": "Meenakshi Sundaram",
            "rating": 4.8,
            "review_text": "Fixed our overhead Sintex water tank float valve promptly before water overflowed.",
            "created_at": "2024-08-28T16:00:00Z",
            "service_category": "Plumbing"
        }
    ]
    for r in reviews_data:
        db.add(RatingReview(**r))

    # 7. Seed Notifications
    notifications_data = [
        {
            "id": "notif-1",
            "target_role": "worker",
            "target_user_id": "worker-1",
            "title": "New Service Request Nearby",
            "message": "Customer Priya Sharma requested Pipe/Tap Repair in Thillai Nagar (1.4 km).",
            "timestamp": "Just now",
            "is_read": False,
            "type": "job"
        },
        {
            "id": "notif-2",
            "target_role": "cooperative_admin",
            "target_user_id": None,
            "title": "High Demand Expected: Electrical & AC",
            "message": "AI Forecast predicts 45% surge in AC servicing & electrical repairs due to heat index.",
            "timestamp": "2 hours ago",
            "is_read": False,
            "type": "alert"
        },
        {
            "id": "notif-3",
            "target_role": "platform_admin",
            "target_user_id": None,
            "title": "New Worker Verification Submitted",
            "message": "Worker V. Prakash submitted Aadhaar and ITI Trade certificate for verification.",
            "timestamp": "1 day ago",
            "is_read": False,
            "type": "verification"
        }
    ]
    for n in notifications_data:
        db.add(Notification(**n))

    # 8. Seed Demand Forecasts
    forecasts_data = [
        {
            "id": "fc-1",
            "category": "Electrical & AC Servicing",
            "predicted_demand_change": "+48% surge",
            "urgency_notice": "Peak Load Expected Next 7 Days",
            "reason": "Local weather station reports 38°C average daytime temperature triggering widespread inverter tripping and AC refrigerant servicing calls.",
            "affected_zones": ["Thillai Nagar", "Tennur", "Cantonment", "Woraiyur"],
            "recommended_action": "Alert 14 currently inactive or busy electrical members in Ward 12 & 18 to enable availability."
        },
        {
            "id": "fc-2",
            "category": "Deep Cleaning & Sanitization",
            "predicted_demand_change": "+35% surge",
            "urgency_notice": "Upcoming Festival Season Prep",
            "reason": "Pre-festival household cleanup trends indicate 3x bookings for kitchen degreasing and sofa shampooing over the coming fortnight.",
            "affected_zones": ["K.K. Nagar", "Srirangam", "Palakkarai"],
            "recommended_action": "Form cooperative multi-member cleaning clusters to handle larger residential apartments efficiently."
        },
        {
            "id": "fc-3",
            "category": "Emergency Tyre & Puncture",
            "predicted_demand_change": "+22% rise",
            "urgency_notice": "High Arterial Road Traffic",
            "reason": "National Highway NH-45 bypass expansion work has caused sudden debris and sharp gravel, spiking two-wheeler tyre puncture requests.",
            "affected_zones": ["Karumandapam Bypass", "Central Bus Stand Perimeter"],
            "recommended_action": "Position mobile puncture assistance units near Karumandapam intersection during 5 PM - 9 PM."
        }
    ]
    for fc in forecasts_data:
        db.add(DemandForecast(**fc))

    db.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
