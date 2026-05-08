import { collection, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";

// --- Products ---

export const getActiveProducts = async () => {
  try {
    const q = query(collection(db, "products"), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
};

export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such product!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// --- Drops ---

export const getDrops = async () => {
  try {
    const q = query(collection(db, "drops"), where("status", "in", ["active", "upcoming"]));
    const querySnapshot = await getDocs(q);
    const drops = [];
    querySnapshot.forEach((doc) => {
      drops.push({ id: doc.id, ...doc.data() });
    });
    return drops;
  } catch (error) {
    console.error("Error fetching drops:", error);
    return [];
  }
};

// --- Accounts ---

export const getUserAccount = async (uid) => {
  try {
    const docRef = doc(db, "accounts", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user account:", error);
    return null;
  }
};

export const createUserAccount = async (uid, userData) => {
  try {
    await setDoc(doc(db, "accounts", uid), userData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error creating user account:", error);
    return false;
  }
};
