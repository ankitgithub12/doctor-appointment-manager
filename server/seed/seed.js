import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { Treatment } from '../models/Treatment.js';
import { Review } from '../models/Review.js';
import { SuccessStory } from '../models/SuccessStory.js';

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the environment.');
  process.exit(1);
}

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();
    await Treatment.deleteMany();
    await Review.deleteMany();
    await SuccessStory.deleteMany();
    console.log('Existing DB records cleared.');

    // 1. Seed Users (Admin & Patient)
    const users = await User.create([
      {
        name: 'HomeHub Administrator',
        email: 'admin@homehub.com',
        password: 'Admin@123', // Will be hashed by pre-save middleware
        phone: '9829593852',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'patient@homehub.com',
        password: 'Patient@123', // Will be hashed by pre-save middleware
        phone: '9876543210',
        role: 'patient',
      },
    ]);
    console.log('Seeded users:', users.length);

    // 2. Seed Doctors
    const doctors = await Doctor.create([
      {
        name: 'Dr. Abhishek Khandelwal',
        title: 'Founder & Chief Homeopath',
        qualification: 'BHMS, MD (Homeopathy)',
        experience: 12,
        certifications: ['CCH Certified', 'Govt. Registered'],
        expertise: ['Diabetes', 'Respiratory Care', 'Chronic Allergies'],
        initials: 'AK',
        photo: '',
        bio: 'Dr. Abhishek Khandelwal has been practicing homeopathy for over 12 years and has helped thousands of patients recover from chronic health issues.',
        isActive: true,
      },
      {
        name: 'Dr. Sneha Kapoor',
        title: 'Senior Homeopathy Consultant',
        qualification: 'BHMS, PGDND',
        experience: 9,
        certifications: ['IACH Member', 'Nutrition Cert.'],
        expertise: ['Skin & Hair', 'Women’s Health', 'Thyroid'],
        initials: 'SK',
        photo: '',
        bio: 'Dr. Sneha Kapoor is an expert in women\'s wellness and dermatological homeopathy treatments, focusing on side-effect-free recoveries.',
        isActive: true,
      },
      {
        name: 'Dr. Rohan Malhotra',
        title: 'Pediatric & Wellness Specialist',
        qualification: 'BHMS, MD (Paediatrics)',
        experience: 10,
        certifications: ['IAP Affiliated', 'Child Care Cert.'],
        expertise: ['Child Immunity', 'ENT Issues', 'Behavioural Care'],
        initials: 'RM',
        photo: '',
        bio: 'Dr. Rohan Malhotra specializes in pediatric homeopathy, helping children build long-term immunity against common respiratory and throat conditions.',
        isActive: true,
      },
    ]);
    console.log('Seeded doctors:', doctors.length);

    // 3. Seed Treatments
    const treatments = await Treatment.create([
      {
        slug: 'respiratory-care',
        icon: '🫁',
        name: 'Respiratory Care',
        category: 'Chronic',
        color: '#1f74e0',
        shortDesc: 'Asthma, COPD, bronchitis & recurrent chest infections — eased at the root.',
        successRate: 92,
        avgDuration: '4–6 months',
        patientCount: 28000,
        symptoms: ['Breathlessness', 'Wheezing', 'Chronic cough', 'Chest tightness'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Detailed case-taking & constitutional remedy' },
          { stage: 'Month 1–2', duration: '1-2 Months', details: 'Reduced attack frequency, less inhaler use' },
          { stage: 'Month 3–4', duration: '3-4 Months', details: 'Improved lung capacity & stamina' },
          { stage: 'Month 5–6', duration: '5-6 Months', details: 'Lasting relief on a maintenance dose' },
        ],
        isActive: true,
      },
      {
        slug: 'diabetes-management',
        icon: '🩸',
        name: 'Diabetes Management',
        category: 'Lifestyle',
        color: '#16a34a',
        shortDesc: 'Stabilise blood sugar and reduce medication dependence, naturally.',
        successRate: 88,
        avgDuration: '6–9 months',
        patientCount: 34000,
        symptoms: ['High sugar levels', 'Fatigue', 'Frequent urination', 'Slow healing'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Baseline workup & personalised diet plan' },
          { stage: 'Month 1–3', duration: '1-3 Months', details: 'Sugar levels begin to stabilise' },
          { stage: 'Month 4–6', duration: '4-6 Months', details: 'Energy returns, dosage tapered with your physician' },
          { stage: 'Month 7–9', duration: '7-9 Months', details: 'Sustained control & lifestyle locked in' },
        ],
        isActive: true,
      },
      {
        slug: 'skin-and-psoriasis',
        icon: '🌿',
        name: 'Skin & Psoriasis',
        category: 'Skin & Hair',
        color: '#0ea5e9',
        shortDesc: 'Eczema, psoriasis, acne & pigmentation cleared without steroids.',
        successRate: 90,
        avgDuration: '5–8 months',
        patientCount: 22000,
        symptoms: ['Itching', 'Flare-ups', 'Redness', 'Scaling / dryness'],
        timeline: [
          { stage: 'Week 1–3', duration: '1-3 Weeks', details: 'Calm acute flare-ups & itching' },
          { stage: 'Month 1–3', duration: '1-3 Months', details: 'Visible reduction in patches' },
          { stage: 'Month 4–6', duration: '4-6 Months', details: '70–90% clearance of affected skin' },
          { stage: 'Month 7–8', duration: '7-8 Months', details: 'Relapse-free skin, confidence restored' },
        ],
        isActive: true,
      },
      {
        slug: 'kidney-disease',
        icon: '🫘',
        name: 'Kidney Disease',
        category: 'Chronic',
        color: '#6366f1',
        shortDesc: 'Supportive care to slow progression and improve kidney function.',
        successRate: 84,
        avgDuration: '6–12 months',
        patientCount: 9500,
        symptoms: ['Swelling', 'Fatigue', 'High creatinine', 'Reduced appetite'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Reports review & gentle remedy plan' },
          { stage: 'Month 1–3', duration: '1-3 Months', details: 'Swelling & fatigue improve' },
          { stage: 'Month 4–8', duration: '4-8 Months', details: 'Function markers stabilise' },
          { stage: 'Month 9–12', duration: '9-12 Months', details: 'Quality of life markedly improved' },
        ],
        isActive: true,
      },
      {
        slug: 'joints-and-arthritis',
        icon: '🦴',
        name: 'Joints & Arthritis',
        category: 'Chronic',
        color: '#f97316',
        shortDesc: 'Rheumatoid & osteoarthritis pain managed without long-term painkillers.',
        successRate: 87,
        avgDuration: '4–7 months',
        patientCount: 17000,
        symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Reduced mobility'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Pain-relief remedy & mobility check' },
          { stage: 'Month 1–2', duration: '1-2 Months', details: 'Morning stiffness eases' },
          { stage: 'Month 3–5', duration: '3-5 Months', details: 'Swelling down, movement freer' },
          { stage: 'Month 6–7', duration: '6-7 Months', details: 'Active life without daily painkillers' },
        ],
        isActive: true,
      },
      {
        slug: 'digestive-health',
        icon: '🍽️',
        name: 'Digestive Health',
        category: 'Lifestyle',
        color: '#14b8a6',
        shortDesc: 'IBS, acidity, constipation & piles treated gently at the cause.',
        successRate: 91,
        avgDuration: '3–5 months',
        patientCount: 20000,
        symptoms: ['Acidity', 'Bloating', 'Irregular bowels', 'Cramps'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Gut-soothing remedy & food map' },
          { stage: 'Month 1–2', duration: '1-2 Months', details: 'Acidity & bloating settle' },
          { stage: 'Month 3–4', duration: '3-4 Months', details: 'Regular, comfortable digestion' },
          { stage: 'Month 5', duration: '5 Months', details: 'Stable gut, no dependence on antacids' },
        ],
        isActive: true,
      },
      {
        slug: 'womens-health',
        icon: '🌸',
        name: "Women's Health",
        category: "Women's",
        color: '#ec4899',
        shortDesc: 'PCOD, thyroid, irregular cycles & fertility support.',
        successRate: 86,
        avgDuration: '5–8 months',
        patientCount: 19000,
        symptoms: ['Irregular periods', 'Weight gain', 'Hormonal acne', 'Mood swings'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Hormonal assessment & remedy' },
          { stage: 'Month 1–3', duration: '1-3 Months', details: 'Cycles begin to regularise' },
          { stage: 'Month 4–6', duration: '4-6 Months', details: 'Hormones balance, symptoms fade' },
          { stage: 'Month 7–8', duration: '7-8 Months', details: 'Stable cycle & improved fertility' },
        ],
        isActive: true,
      },
      {
        slug: 'child-immunity',
        icon: '👶',
        name: 'Child Immunity',
        category: 'Pediatric',
        color: '#22c55e',
        shortDesc: 'Recurrent colds, allergies & low immunity in children.',
        successRate: 93,
        avgDuration: '3–6 months',
        patientCount: 15000,
        symptoms: ['Frequent colds', 'Allergies', 'Poor appetite', 'Low energy'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Gentle, child-safe constitutional remedy' },
          { stage: 'Month 1–2', duration: '1-2 Months', details: 'Fewer infections & better appetite' },
          { stage: 'Month 3–4', duration: '3-4 Months', details: 'Stronger immunity, more active' },
          { stage: 'Month 5–6', duration: '5-6 Months', details: 'Rarely falls sick, thriving' },
        ],
        isActive: true,
      },
      {
        slug: 'mind-and-stress',
        icon: '🧠',
        name: 'Mind & Stress',
        category: 'Mental',
        color: '#8b5cf6',
        shortDesc: 'Anxiety, depression, insomnia & stress with therapy + homeopathy.',
        successRate: 89,
        avgDuration: '3–6 months',
        patientCount: 12000,
        symptoms: ['Anxiety', 'Poor sleep', 'Low mood', 'Overthinking'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Counselling + calming remedy' },
          { stage: 'Month 1–2', duration: '1-2 Months', details: 'Sleep improves, anxiety lowers' },
          { stage: 'Month 3–4', duration: '3-4 Months', details: 'Stable mood & coping tools' },
          { stage: 'Month 5–6', duration: '5-6 Months', details: 'Resilient, balanced wellbeing' },
        ],
        isActive: true,
      },
      {
        slug: 'hair-and-scalp',
        icon: '💇',
        name: 'Hair & Scalp',
        category: 'Skin & Hair',
        color: '#0891b2',
        shortDesc: 'Hair fall, alopecia & dandruff reversed by treating the root cause.',
        successRate: 85,
        avgDuration: '4–7 months',
        patientCount: 13000,
        symptoms: ['Excess hair fall', 'Thinning', 'Dandruff', 'Bald patches'],
        timeline: [
          { stage: 'Week 1–3', duration: '1-3 Weeks', details: 'Scalp analysis & internal remedy' },
          { stage: 'Month 1–2', duration: '1-2 Months', details: 'Hair fall reduces noticeably' },
          { stage: 'Month 3–5', duration: '3-5 Months', details: 'New regrowth begins' },
          { stage: 'Month 6–7', duration: '6-7 Months', details: 'Fuller, healthier hair' },
        ],
        isActive: true,
      },
      {
        slug: 'allergy-and-sinus',
        icon: '🤧',
        name: 'Allergy & Sinus',
        category: 'Chronic',
        color: '#3b82f6',
        shortDesc: 'Allergic rhinitis, sinusitis & urticaria — break the cycle for good.',
        successRate: 90,
        avgDuration: '4–6 months',
        patientCount: 21000,
        symptoms: ['Sneezing', 'Blocked nose', 'Itchy eyes', 'Hives'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Trigger mapping & constitutional remedy' },
          { stage: 'Month 1–2', duration: '1-2 Months', details: 'Sneezing & congestion drop' },
          { stage: 'Month 3–4', duration: '3-4 Months', details: 'Reduced sensitivity to triggers' },
          { stage: 'Month 5–6', duration: '5-6 Months', details: 'Allergy-free seasons' },
        ],
        isActive: true,
      },
      {
        slug: 'thyroid-care',
        icon: '🦋',
        name: 'Thyroid Care',
        category: 'Lifestyle',
        color: '#10b981',
        shortDesc: 'Hypo & hyperthyroid balanced naturally with constitutional care.',
        successRate: 86,
        avgDuration: '5–9 months',
        patientCount: 11000,
        symptoms: ['Weight changes', 'Fatigue', 'Hair fall', 'Mood swings'],
        timeline: [
          { stage: 'Week 1–2', duration: '1-2 Weeks', details: 'Thyroid profile review & remedy' },
          { stage: 'Month 1–3', duration: '1-3 Months', details: 'Energy & weight begin to balance' },
          { stage: 'Month 4–6', duration: '4-6 Months', details: 'Levels trend toward normal' },
          { stage: 'Month 7–9', duration: '7-9 Months', details: 'Stable thyroid, tapered dosage' },
        ],
        isActive: true,
      },
    ]);
    console.log('Seeded treatments:', treatments.length);

    // 4. Seed Reviews (Google/Practo Testimonials)
    const reviews = await Review.create([
      {
        patientName: 'Priya Mehta',
        condition: 'Allergic Rhinitis',
        initials: 'PM',
        rating: 5,
        videoUrl: 'dQw4w9WgXcQ',
        text: "Dr. Khandelwal actually listens. After 6 years of seasonal allergies, I'm finally living without daily antihistamines. Truly life-changing care.",
        isApproved: true,
      },
      {
        patientName: 'Rakesh Gupta',
        condition: 'Type 2 Diabetes',
        initials: 'RG',
        rating: 5,
        videoUrl: '',
        text: "My blood sugar is the most stable it's been in 8 years. The personalised plan and constant check-ins made all the difference.",
        isApproved: true,
      },
      {
        patientName: 'Neha Sharma',
        condition: 'Bronchial Asthma',
        initials: 'NS',
        rating: 5,
        videoUrl: 'dQw4w9WgXcQ',
        text: "I came in for chronic asthma and left with a complete wellness routine. The clinic feels warm, never rushed. Highly recommend.",
        isApproved: true,
      },
      {
        patientName: 'Arjun Verma',
        condition: 'Psoriasis',
        initials: 'AV',
        rating: 5,
        videoUrl: '',
        text: "95% clear skin in 9 months after years of failed steroid creams. I finally have my confidence back. Forever grateful to this team.",
        isApproved: true,
      },
      {
        patientName: 'Meera Iyer',
        condition: 'Thyroid & Weight',
        initials: 'MI',
        rating: 5,
        videoUrl: '',
        text: "Lost 11kg and my thyroid levels normalised without any harsh medication. The diet + homeopathy combo genuinely works.",
        isApproved: true,
      },
      {
        patientName: 'Sandeep Rao',
        condition: "Child's Immunity",
        initials: 'SR',
        rating: 5,
        videoUrl: 'dQw4w9WgXcQ',
        text: "My son used to fall sick every month. After treatment he's barely missed a school day all year. Wonderful pediatric care.",
        isApproved: true,
      },
    ]);
    console.log('Seeded reviews:', reviews.length);

    // 5. Seed Success Stories
    const stories = await SuccessStory.create([
      {
        name: 'Priya Mehta',
        age: 34,
        condition: 'Chronic Allergic Rhinitis',
        initials: 'PM',
        before: 'Daily antihistamines, constant sneezing, sleepless nights for 6 years.',
        after: 'Completely medicine-free for 14 months. Breathing freely again.',
        duration: '5 months of treatment',
        youtubeId: 'dQw4w9WgXcQ',
        isActive: true,
      },
      {
        name: 'Rakesh Gupta',
        age: 52,
        condition: 'Type 2 Diabetes',
        initials: 'RG',
        before: 'HbA1c of 9.2, rising insulin dependence, low energy.',
        after: 'HbA1c down to 6.1, reduced medication, back to morning walks.',
        duration: '8 months of treatment',
        youtubeId: 'dQw4w9WgXcQ',
        isActive: true,
      },
      {
        name: 'Neha Sharma',
        age: 28,
        condition: 'Bronchial Asthma',
        initials: 'NS',
        before: 'Inhaler 3x a day, frequent attacks, missed work regularly.',
        after: 'Zero attacks in 10 months. Inhaler retired completely.',
        duration: '6 months of treatment',
        youtubeId: 'dQw4w9WgXcQ',
        isActive: true,
      },
      {
        name: 'Arjun Verma',
        age: 41,
        condition: 'Psoriasis',
        initials: 'AV',
        before: 'Painful flare-ups on 40% of body, steroid creams stopped working.',
        after: '95% clear skin, no relapses, confidence fully restored.',
        duration: '9 months of treatment',
        youtubeId: 'dQw4w9WgXcQ',
        isActive: true,
      },
    ]);
    console.log('Seeded success stories:', stories.length);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
