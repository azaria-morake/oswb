import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../src/firebase/config";

async function seedRegistry() {
  const codes = [
    {
      code: "TGGL-01-LBL-000732",
      status: "available",
      version: "01.0.732",
      registeredTo: null,
      registeredAt: null
    },
    {
      code: "TGGL-01-LBL-000001",
      status: "registered",
      version: "01.0.001",
      registeredTo: "SYSTEM_ROOT",
      registeredAt: new Date()
    },
    {
      code: "TGGL-01-LBL-000999",
      status: "available",
      version: "01.0.999",
      registeredTo: null,
      registeredAt: null
    }
  ];

  console.log("Seeding Toggle Registry Codes...");

  for (const item of codes) {
    const q = query(collection(db, "registry_codes"), where("code", "==", item.code));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      await addDoc(collection(db, "registry_codes"), item);
      console.log(`Added: ${item.code}`);
    } else {
      console.log(`Skipped (Exists): ${item.code}`);
    }
  }

  console.log("Seeding complete.");
}

seedRegistry().catch(console.error);
