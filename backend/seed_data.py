"""
Seed data for NEXAGRI - Indian Agricultural Marketplace
Includes States, Districts, Mandis, Crops, Prices, Buyers, Logistics, Storage, and AI Forecasts.
"""

from typing import List, Dict, Any

INDIAN_STATES = [
    {
        "id": "TN",
        "name": "Tamil Nadu",
        "districts": [
            {
                "id": "TN_CBE",
                "name": "Coimbatore",
                "markets": ["Mettupalayam", "Coimbatore Main Mandi", "Pollachi", "Sulur", "Annur"]
            },
            {
                "id": "TN_ERO",
                "name": "Erode",
                "markets": ["Perundurai", "Erode Main Regulated Market", "Gobichettipalayam", "Sathyamangalam"]
            },
            {
                "id": "TN_SLM",
                "name": "Salem",
                "markets": ["Salem Main Market", "Attur", "Mecheri", "Omalur"]
            },
            {
                "id": "TN_MDU",
                "name": "Madurai",
                "markets": ["Madurai Mattuthavani", "Paravai Central Market", "Melur", "Usilampatti"]
            },
            {
                "id": "TN_CHN",
                "name": "Chennai",
                "markets": ["Koyambedu Wholesale Market", "Madhavaram"]
            },
            {
                "id": "TN_DGL",
                "name": "Dindigul",
                "markets": ["Dindigul Market", "Oddanchatram Vegetable Market", "Palani"]
            }
        ]
    },
    {
        "id": "MH",
        "name": "Maharashtra",
        "districts": [
            {
                "id": "MH_NSK",
                "name": "Nashik",
                "markets": ["Lasalgaon (Asia's Largest Onion Market)", "Pimpalgaon", "Nashik APMC", "Yeola", "Sinnar"]
            },
            {
                "id": "MH_PUN",
                "name": "Pune",
                "markets": ["Gultekdi Pune APMC", "Manchar", "Junner", "Baramati", "Shirur"]
            },
            {
                "id": "MH_NAG",
                "name": "Nagpur",
                "markets": ["Kalamna Market", "Nagpur APMC", "Katol Orange Mandi"]
            },
            {
                "id": "MH_AHM",
                "name": "Ahmednagar",
                "markets": ["Ahmednagar APMC", "Rahata", "Shrirampur", "Kopargaon"]
            },
            {
                "id": "MH_SOL",
                "name": "Solapur",
                "markets": ["Solapur APMC", "Karmala", "Pandharpur"]
            }
        ]
    },
    {
        "id": "KA",
        "name": "Karnataka",
        "districts": [
            {
                "id": "KA_BLR",
                "name": "Bengaluru Urban",
                "markets": ["Yeshwanthpur APMC", "K.R. Market", "Binny Mill", "Dasarahalli"]
            },
            {
                "id": "KA_KOL",
                "name": "Kolar",
                "markets": ["Kolar APMC (Mega Tomato Mandi)", "Malur", "Mulbagal", "Bangarapet"]
            },
            {
                "id": "KA_MYS",
                "name": "Mysuru",
                "markets": ["Bandipalya APMC Mysuru", "Nanjangud", "Hunsur"]
            },
            {
                "id": "KA_BEL",
                "name": "Belagavi",
                "markets": ["Belagavi APMC", "Bailhongal", "Gokak"]
            }
        ]
    },
    {
        "id": "AP",
        "name": "Andhra Pradesh",
        "districts": [
            {
                "id": "AP_GNT",
                "name": "Guntur",
                "markets": ["Guntur Mirchi Yard (Asia's Largest Chilli Mandi)", "Tenali", "Narasaraopet"]
            },
            {
                "id": "AP_KRN",
                "name": "Kurnool",
                "markets": ["Kurnool APMC", "Adoni (Cotton Mandi)", "Yemmiganur"]
            },
            {
                "id": "AP_CTR",
                "name": "Chittoor",
                "markets": ["Madanapalle (Tomato Hub)", "Palamaner", "Chittoor Market"]
            }
        ]
    },
    {
        "id": "UP",
        "name": "Uttar Pradesh",
        "districts": [
            {
                "id": "UP_AGR",
                "name": "Agra",
                "markets": ["Agra Mandi (Potato Hub)", "Fatehabad", "Achhnera"]
            },
            {
                "id": "UP_VNS",
                "name": "Varanasi",
                "markets": ["Varanasi APMC", "Chandhauli", "Raja Ka Talab"]
            },
            {
                "id": "UP_LKO",
                "name": "Lucknow",
                "markets": ["Dubagga Wholesale Mandi", "Sitapur Road APMC"]
            }
        ]
    },
    {
        "id": "PB",
        "name": "Punjab",
        "districts": [
            {
                "id": "PB_LDH",
                "name": "Ludhiana",
                "markets": ["Ludhiana Grain Market", "Khanna (Largest Grain Market in Asia)", "Jagraon"]
            },
            {
                "id": "PB_ASR",
                "name": "Amritsar",
                "markets": ["Bhagtanwala Dana Mandi", "Rayya", "Majitha"]
            }
        ]
    },
    {
        "id": "GJ",
        "name": "Gujarat",
        "districts": [
            {
                "id": "GJ_UNJ",
                "name": "Mehsana",
                "markets": ["Unjha APMC (Asia's Largest Cumin & Spice Mandi)", "Visnagar", "Kadi"]
            },
            {
                "id": "GJ_RJK",
                "name": "Rajkot",
                "markets": ["Bedi Rajkot APMC (Groundnut & Cotton Hub)", "Gondal", "Jetpur"]
            }
        ]
    },
    {
        "id": "RJ",
        "name": "Rajasthan",
        "districts": [
            {
                "id": "RJ_JPR",
                "name": "Jaipur",
                "markets": ["Muhana Mandi Jaipur", "Surajpole", "Chomu"]
            },
            {
                "id": "RJ_KTA",
                "name": "Kota",
                "markets": ["Bhamashah Mandi Kota", "Ramganj Mandi (Coriander Hub)"]
            }
        ]
    },
    {
        "id": "KL",
        "name": "Kerala",
        "districts": [
            {
                "id": "KL_IDK",
                "name": "Idukki",
                "markets": ["Kumily Spices Park", "Nedumkandam (Cardamom Hub)", "Vandanmedu"]
            },
            {
                "id": "KL_EKM",
                "name": "Ernakulam",
                "markets": ["Ernakulam Central Market", "Aluva APMC", "Muvattupuzha Banana Market"]
            }
        ]
    },
    {
        "id": "WB",
        "name": "West Bengal",
        "districts": [
            {
                "id": "WB_HGY",
                "name": "Hooghly",
                "markets": ["Sheoraphuli Market", "Tarakeswar Potato Mandi", "Singur"]
            },
            {
                "id": "WB_KOL",
                "name": "Kolkata",
                "markets": ["Koley Market Sealdah", "Posta Wholesale Market", "Mechua Fruit Market"]
            }
        ]
    }
]

CROPS_CATALOG = [
    # Vegetables
    {
        "id": "tomato",
        "name": "Tomato",
        "hindi": "टमाटर",
        "tamil": "தக்காளி",
        "category": "Vegetables",
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 32.0,
        "min_price": 26.0,
        "max_price": 36.0,
        "trend_pct": 8.4,
        "arrival_status": "Moderate",
        "arrival_trend": -12.5,
        "shelf_life_days": 7
    },
    {
        "id": "onion",
        "name": "Onion",
        "hindi": "प्याज",
        "tamil": "வெங்காயம்",
        "category": "Vegetables",
        "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 28.5,
        "min_price": 24.0,
        "max_price": 31.0,
        "trend_pct": -2.1,
        "arrival_status": "Heavy Arrivals",
        "arrival_trend": 18.0,
        "shelf_life_days": 30
    },
    {
        "id": "potato",
        "name": "Potato",
        "hindi": "आलू",
        "tamil": "உருளைக்கிழங்கு",
        "category": "Vegetables",
        "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 22.0,
        "min_price": 18.0,
        "max_price": 25.0,
        "trend_pct": 3.4,
        "arrival_status": "Normal",
        "arrival_trend": -3.2,
        "shelf_life_days": 45
    },
    {
        "id": "brinjal",
        "name": "Brinjal (Eggplant)",
        "hindi": "बैंगन",
        "tamil": "கத்தரிக்காய்",
        "category": "Vegetables",
        "image": "https://images.unsplash.com/photo-1628773822503-930a84d4b1a1?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 35.0,
        "min_price": 28.0,
        "max_price": 40.0,
        "trend_pct": 5.2,
        "arrival_status": "Moderate",
        "arrival_trend": -5.0,
        "shelf_life_days": 6
    },
    {
        "id": "carrot",
        "name": "Carrot (Ooty/Hybrid)",
        "hindi": "गाजर",
        "tamil": "கேரட்",
        "category": "Vegetables",
        "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 45.0,
        "min_price": 38.0,
        "max_price": 52.0,
        "trend_pct": 4.1,
        "arrival_status": "Low Arrivals",
        "arrival_trend": -14.0,
        "shelf_life_days": 14
    },
    {
        "id": "green_chilli",
        "name": "Green Chilli",
        "hindi": "हरी मिर्च",
        "tamil": "பச்சை மிளகாய்",
        "category": "Vegetables",
        "image": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 60.0,
        "min_price": 52.0,
        "max_price": 68.0,
        "trend_pct": 9.5,
        "arrival_status": "High Demand",
        "arrival_trend": -8.0,
        "shelf_life_days": 10
    },
    # Fruits
    {
        "id": "banana",
        "name": "Banana (G9 / Robusta / Nendran)",
        "hindi": "केला",
        "tamil": "வாழைப்பழம்",
        "category": "Fruits",
        "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 38.0,
        "min_price": 32.0,
        "max_price": 44.0,
        "trend_pct": 6.7,
        "arrival_status": "Normal",
        "arrival_trend": 2.0,
        "shelf_life_days": 8
    },
    {
        "id": "mango",
        "name": "Mango (Alphonso / Banganapalli)",
        "hindi": "आम",
        "tamil": "மாம்பழம்",
        "category": "Fruits",
        "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 95.0,
        "min_price": 75.0,
        "max_price": 120.0,
        "trend_pct": 12.0,
        "arrival_status": "Seasonal Spike",
        "arrival_trend": -15.0,
        "shelf_life_days": 10
    },
    {
        "id": "pomegranate",
        "name": "Pomegranate (Bhagwa)",
        "hindi": "अनार",
        "tamil": "மாதுளை",
        "category": "Fruits",
        "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "kg",
        "modal_price": 110.0,
        "min_price": 85.0,
        "max_price": 130.0,
        "trend_pct": 3.8,
        "arrival_status": "Steady",
        "arrival_trend": 1.5,
        "shelf_life_days": 21
    },
    # Grains
    {
        "id": "rice_paddy",
        "name": "Paddy / Basmati Rice",
        "hindi": "धान / चावल",
        "tamil": "நெல் / அரிசி",
        "category": "Grains",
        "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "quintal",
        "modal_price": 2350.0,
        "min_price": 2183.0,
        "max_price": 2600.0,
        "trend_pct": 2.2,
        "arrival_status": "Procurement Active",
        "arrival_trend": 5.0,
        "shelf_life_days": 365
    },
    {
        "id": "wheat",
        "name": "Wheat (Sharbati / Lokwan)",
        "hindi": "गेहूं",
        "tamil": "கோதுமை",
        "category": "Grains",
        "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "quintal",
        "modal_price": 2420.0,
        "min_price": 2275.0,
        "max_price": 2580.0,
        "trend_pct": 1.8,
        "arrival_status": "Stable",
        "arrival_trend": 0.5,
        "shelf_life_days": 365
    },
    # Cash Crops
    {
        "id": "cotton",
        "name": "Raw Cotton (Kapas)",
        "hindi": "कपास",
        "tamil": "பருத்தி",
        "category": "Cash Crops",
        "image": "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "quintal",
        "modal_price": 7450.0,
        "min_price": 6900.0,
        "max_price": 7800.0,
        "trend_pct": 4.5,
        "arrival_status": "High Buyer Demand",
        "arrival_trend": -8.0,
        "shelf_life_days": 180
    },
    {
        "id": "turmeric",
        "name": "Turmeric (Salem / Erode Finger)",
        "hindi": "हल्दी",
        "tamil": "மஞ்சள்",
        "category": "Spices",
        "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "quintal",
        "modal_price": 14200.0,
        "min_price": 12800.0,
        "max_price": 15600.0,
        "trend_pct": 11.2,
        "arrival_status": "Strong Export Demand",
        "arrival_trend": -18.0,
        "shelf_life_days": 360
    },
    {
        "id": "red_chilli",
        "name": "Dry Red Chilli (Guntur Teja)",
        "hindi": "सूखी लाल मिर्च",
        "tamil": "வத்தல் மிளகாய்",
        "category": "Spices",
        "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60",
        "standard_unit": "quintal",
        "modal_price": 18500.0,
        "min_price": 16000.0,
        "max_price": 21000.0,
        "trend_pct": 7.8,
        "arrival_status": "Export Spike",
        "arrival_trend": -10.0,
        "shelf_life_days": 240
    }
]

VERIFIED_BUYERS = [
    {
        "id": "BUY_001",
        "name": "Kaveri Agro Foods Pvt Ltd",
        "owner": "R. Selvaraj",
        "verified": True,
        "gst_verified": True,
        "phone_verified": True,
        "reliability_score": 98,
        "rating": 4.9,
        "completed_orders": 1420,
        "location": "Coimbatore, Tamil Nadu",
        "distance_km": 32,
        "crop_required": "Tomato",
        "variety": "Shivam / S-7",
        "quantity_required": "15 Tonnes",
        "offered_price_per_kg": 34.0,
        "payment_terms": "Instant UPI upon Mandi Gate inspection (within 4 hrs)",
        "badge": "Top Buyer",
        "contact_masked": "+91 98421 *****"
    },
    {
        "id": "BUY_002",
        "name": "ITC e-Choupal Procurement Hub",
        "owner": "Regional Agri Manager",
        "verified": True,
        "gst_verified": True,
        "phone_verified": True,
        "reliability_score": 99,
        "rating": 4.9,
        "completed_orders": 5890,
        "location": "Erode, Tamil Nadu",
        "distance_km": 68,
        "crop_required": "Turmeric",
        "variety": "Salem Supreme Finger",
        "quantity_required": "40 Quintals",
        "offered_price_per_kg": 145.0,
        "payment_terms": "Direct Bank NEFT / Escrow UPI within 12 hrs",
        "badge": "Institutional Buyer",
        "contact_masked": "+91 94432 *****"
    },
    {
        "id": "BUY_003",
        "name": "FreshCart Retail Logistics",
        "owner": "Ananya Sharma",
        "verified": True,
        "gst_verified": True,
        "phone_verified": True,
        "reliability_score": 96,
        "rating": 4.7,
        "completed_orders": 980,
        "location": "Mettupalayam, Coimbatore",
        "distance_km": 14,
        "crop_required": "Carrot (Ooty/Hybrid)",
        "variety": "Super Kuroda",
        "quantity_required": "8 Tonnes",
        "offered_price_per_kg": 47.0,
        "payment_terms": "50% advance on vehicle loading + 50% at delivery",
        "badge": "Verified Enterprise",
        "contact_masked": "+91 97910 *****"
    },
    {
        "id": "BUY_004",
        "name": "Deccan Spices & Condiments Ltd",
        "owner": "P. Venkat Reddy",
        "verified": True,
        "gst_verified": True,
        "phone_verified": True,
        "reliability_score": 97,
        "rating": 4.8,
        "completed_orders": 2340,
        "location": "Guntur / Chennai Yard",
        "distance_km": 210,
        "crop_required": "Dry Red Chilli (Guntur Teja)",
        "variety": "Teja Stemless Grade A",
        "quantity_required": "25 Quintals",
        "offered_price_per_kg": 192.0,
        "payment_terms": "Escrow secured digital release on delivery",
        "badge": "Verified Exporter",
        "contact_masked": "+91 98840 *****"
    },
    {
        "id": "BUY_005",
        "name": "Sahyadri Farmers Producer Co. (FPC)",
        "owner": "K. Patil",
        "verified": True,
        "gst_verified": True,
        "phone_verified": True,
        "reliability_score": 99,
        "rating": 5.0,
        "completed_orders": 4120,
        "location": "Lasalgaon, Nashik",
        "distance_km": 45,
        "crop_required": "Onion",
        "variety": "Garwa (Red Storage)",
        "quantity_required": "30 Tonnes",
        "offered_price_per_kg": 29.5,
        "payment_terms": "Immediate APMC Mandi Account Credit",
        "badge": "Apex FPO",
        "contact_masked": "+91 98220 *****"
    }
]

LOGISTICS_FLEET = [
    {
        "id": "LOG_001",
        "provider_name": "Gramin Agro Transporters",
        "vehicle_type": "Tata Ace (Chota Hathi)",
        "capacity_kg": 1000,
        "rate_per_km": 16.0,
        "base_fare": 350.0,
        "driver_name": "M. Kumar",
        "rating": 4.8,
        "verified": True,
        "contact_masked": "+91 97890 *****",
        "features": ["Tarpaulin Cover", "Crate Strapping Included", "Live GPS Tracker"]
    },
    {
        "id": "LOG_002",
        "provider_name": "Kissan Logistics Express",
        "vehicle_type": "Mahindra Bolero Maxi Truck",
        "capacity_kg": 2500,
        "rate_per_km": 24.0,
        "base_fare": 600.0,
        "driver_name": "V. Murugan",
        "rating": 4.9,
        "verified": True,
        "contact_masked": "+91 98430 *****",
        "features": ["High Side Deck", "Ventilated Body", "Trained in Agri Handling"]
    },
    {
        "id": "LOG_003",
        "provider_name": "Deccan Cold-Chain Logistics",
        "vehicle_type": "Eicher Reefer (Insulated Cold Truck)",
        "capacity_kg": 6000,
        "rate_per_km": 42.0,
        "base_fare": 1800.0,
        "driver_name": "S. Rajesh",
        "rating": 4.9,
        "verified": True,
        "contact_masked": "+91 99400 *****",
        "features": ["4°C to 12°C Controlled Temp", "Data Logger", "Zero Spoilage Guarantee"]
    }
]

STORAGE_FACILITIES = [
    {
        "id": "STR_001",
        "name": "Coimbatore Agri Cold Chain & Warehouse Hub",
        "location": "Pollachi Road, Eachanari, Coimbatore",
        "distance_km": 22,
        "storage_type": "Cold Storage (2°C - 10°C)",
        "total_capacity_mt": 3500,
        "available_capacity_mt": 820,
        "price_per_quintal_per_month": 95.0,
        "price_per_day_kg": 0.05,
        "suitable_crops": ["Tomato", "Carrot", "Potato", "Apple", "Banana"],
        "rating": 4.8,
        "humidity_control": "85% - 90% RH with Nitrogen Purge",
        "verified": True,
        "contact": "+91 422 261****"
    },
    {
        "id": "STR_002",
        "name": "Mettupalayam Nilgiris Cooperative Cold Store",
        "location": "Near Regulated Market, Mettupalayam",
        "distance_km": 11,
        "storage_type": "Controlled Atmosphere Storage",
        "total_capacity_mt": 2000,
        "available_capacity_mt": 410,
        "price_per_quintal_per_month": 110.0,
        "price_per_day_kg": 0.06,
        "suitable_crops": ["Carrot", "Potato", "Cabbage", "Pomegranate"],
        "rating": 4.9,
        "humidity_control": "Automated Microclimate Sensors",
        "verified": True,
        "contact": "+91 4254 22****"
    },
    {
        "id": "STR_003",
        "name": "Tamil Nadu State Warehousing Corp (TNSWC) Erode",
        "location": "Industrial Estate, Perundurai, Erode",
        "distance_km": 64,
        "storage_type": "Scientific Dry Grain Warehouse",
        "total_capacity_mt": 12000,
        "available_capacity_mt": 2400,
        "price_per_quintal_per_month": 45.0,
        "price_per_day_kg": 0.02,
        "suitable_crops": ["Turmeric", "Paddy / Basmati Rice", "Wheat", "Cotton"],
        "rating": 4.7,
        "humidity_control": "Moisture Proof Fumigated Bins",
        "verified": True,
        "contact": "+91 424 253****"
    }
]
