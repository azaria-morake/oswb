const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// Webhook endpoint for payment provider (e.g., PayStack/Yoco)
exports.handlePaymentWebhook = functions.https.onRequest(async (req, res) => {
  // 1. Verify webhook signature here (pseudo-code)
  // const isValid = verifyProviderSignature(req.headers, req.rawBody);
  // if (!isValid) return res.status(400).send("Invalid signature");

  // Parse payload (assuming payload contains orderId and status)
  const payload = req.body;
  const orderId = payload.orderId;
  const paymentStatus = payload.status; // e.g., 'success'

  if (paymentStatus !== 'success') {
    // Handle failed payment (e.g., mark order as failed)
    return res.status(200).send("Payment not successful, ignoring.");
  }

  const orderRef = db.collection("orders").doc(orderId);

  try {
    await db.runTransaction(async (transaction) => {
      const orderDoc = await transaction.get(orderRef);

      if (!orderDoc.exists) {
        throw new Error("Order does not exist!");
      }

      const orderData = orderDoc.data();

      // Prevent double processing
      if (orderData.status === 'paid') {
        throw new Error("Order already marked as paid!");
      }

      const items = orderData.itemsSnapshot || [];
      
      // We will read all product docs first to comply with Firestore transaction rules (read before write)
      const productDocs = [];
      for (const item of items) {
        const productRef = db.collection("products").doc(item.productId);
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists) {
          throw new Error(`Product ${item.productId} does not exist!`);
        }
        productDocs.push({ ref: productRef, snap: productSnap, item });
      }

      // Check stock and apply decrements
      for (const productData of productDocs) {
        const data = productData.snap.data();
        const size = productData.item.size || 'M'; // Assuming size is required
        const currentStock = data.inventory[size] || 0;
        const requestedQuantity = productData.item.quantity || 1;

        if (currentStock < requestedQuantity) {
          // If stock is 0 or less than requested, fail transaction
          // Here we would ideally trigger a refund process with the payment provider
          throw new Error(`Insufficient stock for product ${productData.item.productId} size ${size}`);
        }

        // Prepare the updated inventory
        const newInventory = { ...data.inventory };
        newInventory[size] -= requestedQuantity;

        // Queue the write
        transaction.update(productData.ref, { inventory: newInventory });
      }

      // Update the order status to 'paid'
      transaction.update(orderRef, { status: 'paid', paidAt: admin.firestore.FieldValue.serverTimestamp() });
    });

    console.log(`Successfully processed order ${orderId}`);
    res.status(200).send("Webhook handled successfully");

  } catch (error) {
    console.error(`Transaction failed for order ${orderId}:`, error);
    // In production, trigger an alert or refund API here
    res.status(500).send(`Transaction failed: ${error.message}`);
  }
});
