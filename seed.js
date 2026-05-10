import * as dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const featuredProducts = [
  { name: 'Silicon Melt Hoodie', price: 1880, images: ['/assets/hoodie1.png'], isLimited: true, status: 'active', stock: 4 },
  { name: 'Silicon Melt Hoodie', price: 7800, images: ['/assets/hoodie2.png'], isLimited: true, status: 'active', stock: 4 },
  { name: 'Refined Stock', price: 1580, images: ['/assets/can.png'], isLimited: false, status: 'active', stock: 15 },
  { name: 'Malian & Patche', price: 1300, images: ['/assets/beanie.png'], isLimited: false, status: 'active', stock: 0 }
];

const drops = [
  { name: 'SILICON_MELT_HOODIE_01', price: 1880, image: '/assets/hoodie2.png', spec: 'WEIGHT: 400GSM', stock: 8, status: 'active' },
  { name: 'SPIKE_TSHIRT_01', price: 850, image: '/assets/tshirt1.png', spec: 'WEIGHT: 220GSM', stock: 3, status: 'active' },
  { name: 'REFINED_STOCK_CAN', price: 150, image: '/assets/can.png', spec: 'COMP: ALUMINUM', stock: 15, status: 'active' },
  { name: 'MALIAN_PATCHE_BEANIE', price: 450, image: '/assets/beanie.png', spec: 'COMP: ACRYLIC', stock: 0, status: 'active' }
];

async function seed() {
  console.log("Starting seed process...");

  try {
    const productsCollection = collection(db, 'products');
    const dropsCollection = collection(db, 'drops');

    console.log("Seeding featured products...");
    for (const product of featuredProducts) {
      await addDoc(productsCollection, product);
    }

    console.log("Seeding drops...");
    for (const drop of drops) {
      await addDoc(dropsCollection, drop);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
