import { collection, getDocs, query, where, doc, getDoc, setDoc, onSnapshot, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./config";

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

export const listenToActiveProducts = (callback) => {
  const q = query(collection(db, "products"), where("status", "==", "active"));
  return onSnapshot(q, (querySnapshot) => {
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    callback(products);
  }, (error) => {
    console.error("Error listening to active products:", error);
    callback([]);
  });
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

export const listenToDrops = (callback) => {
  const q = query(collection(db, "drops"), where("status", "in", ["active", "upcoming"]));
  return onSnapshot(q, (querySnapshot) => {
    const drops = [];
    querySnapshot.forEach((doc) => {
      drops.push({ id: doc.id, ...doc.data() });
    });
    callback(drops);
  }, (error) => {
    console.error("Error listening to drops:", error);
    callback([]);
  });
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

// --- Admin Operations ---

export const listenToAllProducts = (callback) => {
  const q = query(collection(db, "products"));
  return onSnapshot(q, (querySnapshot) => {
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    callback(products);
  }, (error) => {
    console.error("Error listening to all products:", error);
    callback([]);
  });
};

export const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProductStatus = async (productId, status) => {
  try {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};

export const uploadAdminAsset = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading asset:", error);
    throw error;
  }
};

export const deleteAdminAsset = async (fileUrl) => {
  if (!fileUrl || !fileUrl.includes('firebasestorage.googleapis.com')) return false;
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error("Error deleting asset:", error);
    return false;
  }
};

export const assignProductToDrop = async (product, dropName) => {
  try {
    const dropData = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || '',
      images: product.images || (product.image ? [product.image] : []),
      spec: `CAT: ${product.category || 'N/A'}`,
      stock: product.stock,
      status: 'active', // default to active for Drops page
      dropName: dropName,
      assignedAt: new Date()
    };
    
    // We add it to the drops collection
    const docRef = await addDoc(collection(db, "drops"), dropData);
    return docRef.id;
  } catch (error) {
    console.error("Error assigning product to drop:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updateData) => {
  try {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, "products", productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// --- Drop Containers ---

export const getDropContainers = async () => {
  try {
    const q = query(collection(db, "drop_containers"));
    const querySnapshot = await getDocs(q);
    const containers = [];
    querySnapshot.forEach((doc) => {
      containers.push({ id: doc.id, ...doc.data() });
    });
    return containers;
  } catch (error) {
    console.error("Error fetching drop containers:", error);
    return [];
  }
};

export const listenToDropContainers = (callback) => {
  const q = query(collection(db, "drop_containers"));
  return onSnapshot(q, (querySnapshot) => {
    const containers = [];
    querySnapshot.forEach((doc) => {
      containers.push({ id: doc.id, ...doc.data() });
    });
    callback(containers);
  }, (error) => {
    console.error("Error listening to drop containers:", error);
    callback([]);
  });
};

export const createDropContainer = async (name) => {
  try {
    const docRef = await addDoc(collection(db, "drop_containers"), {
      name,
      status: 'draft', // default status
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating drop container:", error);
    throw error;
  }
};

export const deleteDropContainer = async (containerId) => {
  try {
    const docRef = doc(db, "drop_containers", containerId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting drop container:", error);
    throw error;
  }
};

export const updateDropContainerStatus = async (containerId, status) => {
  try {
    const docRef = doc(db, "drop_containers", containerId);
    await updateDoc(docRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating drop container status:", error);
    throw error;
  }
};

// --- Homepage Configuration ---

export const listenToHomepageConfig = (callback) => {
  const docRef = doc(db, "config", "homepage");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({ heroImage: '', featuredProductIds: new Array(8).fill(null) });
    }
  }, (error) => {
    console.error("Error listening to homepage config:", error);
    callback({ heroImage: '', featuredProductIds: new Array(8).fill(null) });
  });
};

export const updateHomepageConfig = async (configData) => {
  try {
    const docRef = doc(db, "config", "homepage");
    await setDoc(docRef, configData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating homepage config:", error);
    throw error;
  }
};


