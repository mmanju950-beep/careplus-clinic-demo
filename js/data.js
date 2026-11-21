/**
 * CarePlus Multispeciality Clinic - Core Data Store
 * Fictional Demo Data created for GrowthCraft Studio Website Showcase
 */

const CLINIC_DATA = {
  brand: {
    name: "CarePlus Multispeciality Clinic",
    nameKannada: "ಕೇರ್‌ಪ್ಲಸ್ ಮಲ್ಟಿಸ್ಪೆಷಾಲಿಟಿ ಕ್ಲಿನಿಕ್",
    tagline: "Your Health. Our Priority.",
    taglineKannada: "ನಿಮ್ಮ ಆರೋಗ್ಯ. ನಮ್ಮ ಆದ್ಯತೆ.",
    heroHeadline: "Compassionate Care. Better Health.",
    heroSubhead: "Modern, patient-focused multispeciality healthcare in Hubballi. Book verified specialists with zero waiting room hassle.",
    established: "2018 (Fictional Demo)",
    address: {
      line1: "Plot No. 42, Shirur Park Main Road",
      line2: "Near BVB College Campus, Vidyanagar",
      city: "Hubballi",
      state: "Karnataka",
      pincode: "580021",
      country: "India",
      googleMapsQuery: "Shirur+Park+Vidyanagar+Hubballi+Karnataka"
    },
    contact: {
      phoneDisplay: "+91 836 298 4400",
      phoneTel: "+918362984400",
      emergencyDisplay: "+91 836 298 4499",
      emergencyTel: "+918362984499",
      whatsappDisplay: "+91 94812 00000",
      whatsappLink: "https://wa.me/919481200000?text=Hello%20CarePlus%20Clinic%20(Demo)%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation.",
      email: "care@careplusclinicdemo.in"
    },
    hours: [
      { days: "Monday – Saturday", time: "8:00 AM – 8:30 PM", note: "Outpatient Consultations" },
      { days: "Sunday", time: "9:00 AM – 1:00 PM", note: "Emergency & Walk-in triage only" },
      { days: "Casualty / Helpline", time: "24/7 Helpline", note: "Demo Helpline Available" }
    ],
    showcase: {
      agencyName: "GrowthCraft Studio",
      agencyTagline: "Premium Digital Experiences for Healthcare Providers",
      badgeText: "DEMO PREVIEW • Healthcare Web Solution by GrowthCraft Studio"
    }
  },

  specialities: [
    {
      id: "general-medicine",
      name: "General Medicine",
      nameKannada: "ಜನರಲ್ ಮೆಡಿಸಿನ್",
      shortDesc: "Comprehensive diagnosis and management of adult chronic diseases, acute viral infections, and lifestyle disorders.",
      fullDesc: "Our Internal Medicine department provides holistic clinical assessments for adults. We focus on evidence-based management of hypertension, diabetes mellitus, cardiovascular risk factors, and complex seasonal viral illnesses.",
      icon: "stethoscope",
      headDoctor: "Dr. Rajeshwar Kulkarni",
      keyTreatments: [
        "Diabetes & Metabolic Syndrome Care",
        "Hypertension & Blood Pressure Control",
        "Seasonal Fevers, Dengue & Viral Infections",
        "Thyroid & Endocrine Disorders",
        "Senior Citizen Geriatric Health"
      ],
      roomNo: "Suite 101"
    },
    {
      id: "pediatrics",
      name: "Pediatrics & Child Care",
      nameKannada: "ಮಕ್ಕಳ ಚಿಕಿತ್ಸೆ",
      shortDesc: "Gentle, child-friendly care for newborns, toddlers, and adolescents, including vaccination and growth tracking.",
      fullDesc: "Dedicated to the physical and emotional wellbeing of your child. Our child-friendly clinic features gentle pediatricians, complete IAP-recommended immunization schedules, and developmental milestone tracking in a calm setting.",
      icon: "baby",
      headDoctor: "Dr. Sneha Patil",
      keyTreatments: [
        "IAP Recommended Vaccination Schedule",
        "Newborn & Infant Wellness Checks",
        "Pediatric Asthma & Allergy Management",
        "Growth, Height & Weight Monitoring",
        "Childhood Nutritional Guidance"
      ],
      roomNo: "Suite 102"
    },
    {
      id: "dermatology",
      name: "Dermatology & Skin Care",
      nameKannada: "ಚರ್ಮ ರೋಗ ಚಿಕಿತ್ಸೆ",
      shortDesc: "Clinical dermatology and medical aesthetic treatments for acne, eczema, hair loss, and chronic skin conditions.",
      fullDesc: "Expert clinical care for hair, nail, and skin disorders. We combine medical therapies with gentle cosmetic dermatological protocols to treat acne scarring, scalp conditions, psoriasis, and skin allergies safely.",
      icon: "sparkles",
      headDoctor: "Dr. Arvind Deshpande",
      keyTreatments: [
        "Chronic Acne & Post-Acne Scar Therapy",
        "Eczema, Psoriasis & Atopic Dermatitis",
        "Hair Fall, Alopecia & Scalp Disorders",
        "Fungal & Bacterial Skin Infections",
        "Hyperpigmentation & Sun Damage Care"
      ],
      roomNo: "Suite 201"
    },
    {
      id: "gynecology",
      name: "Gynecology & Women's Health",
      nameKannada: "ಮಹಿಳಾ ಮತ್ತು ಪ್ರಸೂತಿ ರೋಗ ಚಿಕಿತ್ಸೆ",
      shortDesc: "Compassionate women's health services across all life stages, from adolescent PCOS care to antenatal maternity care.",
      fullDesc: "A private, supportive environment for women's preventive and curative healthcare. We provide expert antenatal scans, menstrual health management, PCOD/PCOS lifestyle counseling, and cervical cancer screenings.",
      icon: "heart-handshake",
      headDoctor: "Dr. Priyamvada Joshi",
      keyTreatments: [
        "Antenatal & Postnatal Mother Care",
        "PCOD / PCOS Clinical Management",
        "Menstrual Irregularities & Hormonal Care",
        "Pap Smear & Well-Woman Screenings",
        "Perimenopause & Menopause Support"
      ],
      roomNo: "Suite 202"
    },
    {
      id: "preventive-checkups",
      name: "Preventive Health Checkups",
      nameKannada: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
      shortDesc: "Structured screening packages designed for early detection, cardiovascular evaluation, and lifestyle optimization.",
      fullDesc: "Early diagnosis saves lives and prevents chronic complications. Our comprehensive screening packages include blood profiles, ECG, HbA1c, liver & kidney panels, combined with a 1-on-1 lifestyle doctor review.",
      icon: "clipboard-check",
      headDoctor: "Dr. Anand Hegde",
      keyTreatments: [
        "Annual Comprehensive Master Health Checkup",
        "Senior Citizen Cardiac & Diabetic Wellness",
        "Corporate Executive Health Screenings",
        "Pre-Employment & Insurance Screenings",
        "Personalized Lifestyle Modification Plan"
      ],
      roomNo: "Wellness Lounge 103"
    }
  ],

  doctors: [
    {
      id: "doc-1",
      name: "Dr. Rajeshwar Kulkarni",
      credentials: "MBBS, MD (General Medicine), FICP",
      specialityId: "general-medicine",
      specialityName: "General Medicine",
      experienceYears: "16+ Years Experience (Demo Profile)",
      languages: ["English", "ಕನ್ನಡ (Kannada)", "Hindi"],
      fee: 450,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
      fallbackImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
      nextAvailable: "Today at 4:30 PM",
      availabilityBadge: "Available Today",
      consultationHours: "Mon – Sat: 9:00 AM – 1:00 PM & 4:30 PM – 8:00 PM",
      rating: "4.9 ★ (120+ Demo Reviews)",
      bio: "Dr. Rajeshwar Kulkarni is a senior consultant physician with 16 years of clinical experience in adult internal medicine and diabetology. Known for his methodical diagnostic approach and patient counseling on lifestyle modifications.",
      education: [
        "MBBS – Karnataka Institute of Medical Sciences (KIMS), Hubballi",
        "MD (General Medicine) – Mysore Medical College",
        "Fellow of the Indian College of Physicians (FICP)"
      ],
      expertise: [
        "Type 2 Diabetes Reversal & Management",
        "Cardiovascular Risk Stratification",
        "Seasonal Fevers & Tropical Infections",
        "Geriatric Care & Polypharmacy Review"
      ],
      slots: {
        morning: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
        afternoon: ["01:00 PM"],
        evening: ["04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"]
      }
    },
    {
      id: "doc-2",
      name: "Dr. Sneha Patil",
      credentials: "MBBS, DCH, DNB (Pediatrics)",
      specialityId: "pediatrics",
      specialityName: "Pediatrics & Child Care",
      experienceYears: "11+ Years Experience (Demo Profile)",
      languages: ["English", "ಕನ್ನಡ (Kannada)", "Hindi"],
      fee: 500,
      image: "https://images.unsplash.com/photo-1594824813524-81498b0c804f?auto=format&fit=crop&q=80&w=600",
      fallbackImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      nextAvailable: "Today at 5:00 PM",
      availabilityBadge: "Available Today",
      consultationHours: "Mon – Sat: 10:00 AM – 1:30 PM & 4:30 PM – 7:30 PM",
      rating: "4.9 ★ (98+ Demo Reviews)",
      bio: "Dr. Sneha Patil is a compassionate pediatrician loved by young children and parents alike. She specializes in newborn care, developmental screenings, vaccination protocols, and managing recurring childhood allergies and asthma.",
      education: [
        "MBBS – JJM Medical College, Davangere",
        "DCH – Father Muller Medical College, Mangalore",
        "DNB (Pediatrics) – National Board of Examinations, New Delhi"
      ],
      expertise: [
        "Vaccination & Immunization Counseling",
        "Pediatric Respiratory Allergies & Asthma",
        "Newborn Growth & Developmental Milestones",
        "Pediatric Nutrition & Feeding Concerns"
      ],
      slots: {
        morning: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM"],
        afternoon: ["01:30 PM"],
        evening: ["04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"]
      }
    },
    {
      id: "doc-3",
      name: "Dr. Arvind Deshpande",
      credentials: "MBBS, MD (DVL), FAAD",
      specialityId: "dermatology",
      specialityName: "Dermatology & Skin Care",
      experienceYears: "13+ Years Experience (Demo Profile)",
      languages: ["English", "ಕನ್ನಡ (Kannada)", "Hindi"],
      fee: 500,
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
      fallbackImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
      nextAvailable: "Tomorrow at 2:30 PM",
      availabilityBadge: "Slots for Tomorrow",
      consultationHours: "Mon, Wed, Thu, Sat: 2:00 PM – 7:30 PM",
      rating: "4.8 ★ (85+ Demo Reviews)",
      bio: "Dr. Arvind Deshpande brings over a decade of specialized clinical dermatology experience. He is dedicated to evidence-based therapies for chronic skin conditions, hair disorders, and gentle aesthetic protocols.",
      education: [
        "MBBS – SDM College of Medical Sciences, Dharwad",
        "MD (Dermatology, Venereology & Leprosy) – BMCRI Bengaluru",
        "Fellow – American Academy of Dermatology (FAAD)"
      ],
      expertise: [
        "Acne Vulgaris & Post-Acne Scarring",
        "Scalp Trichology & Hair Thinning Protocols",
        "Chronic Psoriasis & Eczema Therapy",
        "Safe Medical Peels & Dermato-surgery"
      ],
      slots: {
        morning: [],
        afternoon: ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"],
        evening: ["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"]
      }
    },
    {
      id: "doc-4",
      name: "Dr. Priyamvada Joshi",
      credentials: "MBBS, MS (Obstetrics & Gynecology), FMAS",
      specialityId: "gynecology",
      specialityName: "Gynecology & Women's Health",
      experienceYears: "14+ Years Experience (Demo Profile)",
      languages: ["English", "ಕನ್ನಡ (Kannada)", "Hindi", "Marathi"],
      fee: 500,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      fallbackImage: "https://images.unsplash.com/photo-1594824813524-81498b0c804f?auto=format&fit=crop&q=80&w=600",
      nextAvailable: "Today at 4:00 PM",
      availabilityBadge: "Available Today",
      consultationHours: "Mon – Sat: 9:30 AM – 1:00 PM & 4:00 PM – 6:30 PM",
      rating: "5.0 ★ (140+ Demo Reviews)",
      bio: "Dr. Priyamvada Joshi provides comprehensive care tailored to women at every life transition. She has deep expertise in antenatal monitoring, adolescent menstrual health, and lifestyle solutions for PCOS/PCOD.",
      education: [
        "MBBS – Karnataka Institute of Medical Sciences (KIMS), Hubballi",
        "MS (Obstetrics & Gynecology) – KMC Manipal",
        "Fellowship in Minimal Access Surgery (FMAS)"
      ],
      expertise: [
        "Antenatal Pregnancy Care & Monitoring",
        "PCOS / PCOD Diagnosis & Metabolic Guidance",
        "Cervical Cancer Screenings & Pap Smear",
        "Perimenopausal Health Management"
      ],
      slots: {
        morning: ["09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
        afternoon: [],
        evening: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"]
      }
    },
    {
      id: "doc-5",
      name: "Dr. Anand Hegde",
      credentials: "MBBS, MD (Preventive Medicine)",
      specialityId: "preventive-checkups",
      specialityName: "Preventive Health Checkups",
      experienceYears: "10+ Years Experience (Demo Profile)",
      languages: ["English", "ಕನ್ನಡ (Kannada)"],
      fee: 400,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
      fallbackImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
      nextAvailable: "Tomorrow at 8:30 AM",
      availabilityBadge: "Early Morning Slots",
      consultationHours: "Mon – Fri: 8:00 AM – 1:00 PM",
      rating: "4.8 ★ (75+ Demo Reviews)",
      bio: "Dr. Anand Hegde leads the preventive medicine and wellness screening wing. He specializes in early risk marker identification, metabolic disease reversal strategies, and personalized health roadmaps.",
      education: [
        "MBBS – JNMC Belagavi",
        "MD (Community & Preventive Medicine) – RGUHS Bengaluru",
        "Certified in Preventive Cardiology & Metabolic Health"
      ],
      expertise: [
        "Executive Comprehensive Health Evaluations",
        "Cardiometabolic Risk Score Calculation",
        "Pre-Diabetic Reversal Pathways",
        "Occupational Health & Ergonomics"
      ],
      slots: {
        morning: ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"],
        afternoon: [],
        evening: []
      }
    }
  ],

  testimonials: [
    {
      id: "test-1",
      patientName: "Rameshwar G.",
      patientRole: "Family Caregiver, Vidyanagar, Hubballi",
      quote: "Booking an evening consultation slot for my mother with Dr. Kulkarni was completely seamless. No endless waiting in crowded corridors, and the doctor spent 25 full minutes explaining her diabetes report clearly.",
      speciality: "General Medicine",
      rating: 5,
      date: "Demo Testimonial"
    },
    {
      id: "test-2",
      patientName: "Pooja & Chetan N.",
      patientRole: "Parents of 2-year-old, Shirur Park, Hubballi",
      quote: "Finding a gentle pediatrician who listens without rushing is rare. Dr. Sneha is wonderful with our toddler. The instant appointment SMS reminder and digital clinic check-in made our visit stress-free.",
      speciality: "Pediatrics & Child Care",
      rating: 5,
      date: "Demo Testimonial"
    },
    {
      id: "test-3",
      patientName: "Vinay B.",
      patientRole: "IT Professional, Hubballi",
      quote: "Completed the Executive Preventive Checkup in under 2 hours on a Saturday morning. Highly hygienic clinic, efficient lab sample collection, and clear doctor consultation afterward.",
      speciality: "Preventive Health Checkups",
      rating: 5,
      date: "Demo Testimonial"
    }
  ],

  faqs: [
    {
      question: "How does the online appointment booking work?",
      answer: "You can book an appointment in 6 simple steps right here on our website. Choose your required speciality, pick your preferred doctor, select a convenient date from our live calendar, pick a time slot, and enter basic patient details. You will receive an instant digital confirmation with a unique booking reference."
    },
    {
      question: "Are walk-in consultations accepted at CarePlus?",
      answer: "Yes, we accept walk-in patients during standard clinic hours. However, pre-booked appointments receive priority consultation times to minimize waiting periods. For urgent or emergency care, triage is performed immediately."
    },
    {
      question: "What are the clinic's operating hours and emergency contact?",
      answer: "CarePlus is open Monday through Saturday from 8:00 AM to 8:30 PM, and on Sundays from 9:00 AM to 1:00 PM for outpatient care. Our emergency and demo casualty support helpline (+91 836 298 4499) is staffed 24/7."
    },
    {
      question: "Can I reschedule or cancel my booked demo appointment?",
      answer: "Yes! In this demo website, any appointment you book is saved in your browser storage. You can click 'My Bookings' at the top of the page, view your active appointments, and easily cancel or reschedule them with one click."
    },
    {
      question: "Which specialities are available at CarePlus Multispeciality Clinic?",
      answer: "We currently offer five dedicated medical departments: General Medicine & Diabetology, Pediatrics & Child Health, Dermatology & Skin Care, Gynecology & Women's Health, and Preventive Health Checkups."
    },
    {
      question: "How can clinic owners launch a website like this for their own practice?",
      answer: "This demonstration website was crafted by GrowthCraft Studio. We specialize in building fast, modern, patient-converting websites and booking platforms for clinics, doctors, and hospitals. Contact GrowthCraft Studio to discuss tailored healthcare web development."
    }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.CLINIC_DATA = CLINIC_DATA;
}
