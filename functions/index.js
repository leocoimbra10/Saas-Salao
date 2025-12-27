const { onRequest, onCall } = require("firebase-functions/v2/https");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Mercado Pago Client Configuration
 */
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-6421571520111111-122718-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Default or env
});

/**
 * processScheduledReminders
 * Runs every day at 9 AM to check for upcoming wedding milestones
 */
exports.processScheduledReminders = onSchedule("0 9 * * *", async (event) => {
    logger.info("Checking for upcoming bridal milestones...");

    // 1. Scan all 'bridal_packages' where status is not 'completed'
    // 2. Scan their 'timeline' sub-collection for dates in the next 3/7 days
    // 3. Trigger WhatsApp reminder via notification API/service

    return null;
});

/**
 * resizeAvatar
 * Triggered when an image is uploaded to the avatars/ or moodboards/ bucket
 */
exports.resizeAvatar = onObjectFinalized(async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const contentType = event.data.contentType;

    if (!contentType.startsWith("image/")) {
        return logger.log("This is not an image.");
    }

    logger.info(`Resizing image ${filePath} for better performance`);
    // Implementation using 'sharp' would go here
    return null;
});

/**
 * Atomic Commission Calculation
 * Triggered when an appointment is completed
 */
exports.calculateCommissions = onDocumentUpdated("appointments/{appointmentId}", async (event) => {
    const change = event.data;
    if (!change) return null;

    const newData = change.after.data();
    const oldData = change.before.data();

    // Only run if status changed to 'completed'
    if (newData.status !== "completed" || oldData.status === "completed") {
        return null;
    }

    logger.info(`Calculating commission for appointment ${event.params.appointmentId}`);

    const data = newData;

    logger.info(`Calculating commission for appointment ${event.params.appointmentId}`);

    const staffId = data.staffId;
    const totalAmount = data.totalAmount;

    if (!staffId || !totalAmount) {
        logger.error(`Missing staffId or totalAmount for appointment ${event.params.appointmentId}`);
        return null;
    }

    try {
        // Fetch staff profile to get commission rate
        let staffDoc = await admin.firestore().collection("staff").doc(staffId).get();
        let staffData = staffDoc.exists ? staffDoc.data() : {};

        // Fallback to 'users' collection if not found in 'staff'
        if (!staffDoc.exists) {
            staffDoc = await admin.firestore().collection("users").doc(staffId).get();
            staffData = staffDoc.exists ? staffDoc.data() : {};
        }

        const commissionRate = staffData.commissionRate || 10; // Default 10%

        const commissionAmount = (totalAmount * commissionRate) / 100;

        // Create/Update commission record in staff_commissions collection
        await admin.firestore().collection("staff_commissions").add({
            appointmentId: event.params.appointmentId,
            staffId,
            amount: commissionAmount,
            totalAmount,
            commissionRate,
            date: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        });

        logger.info(`Commission of ${commissionAmount} calculated for staff ${staffId}`);
    } catch (error) {
        logger.error("Error calculating commission: ", error);
    }

    return null;
});

/**
 * createMercadoPagoPreference
 * Creates a payment preference for the checkout
 */
exports.createMercadoPagoPreference = onCall(async (request) => {
    const { appointmentId, amount, items } = request.data;

    logger.info(`Creating MP preference for appointment ${appointmentId}`);

    const preference = new Preference(client);

    try {
        const body = {
            items: items || [{
                title: "Serviço de Beleza",
                unit_price: Number(amount),
                quantity: 1,
            }],
            external_reference: appointmentId,
            notification_url: "https://handlemercadopagowebhook-zzzzzzzzz-uc.a.run.app", // Fallback URL
            back_urls: {
                success: "https://salao-beauty.web.app/booking/success",
                failure: "https://salao-beauty.web.app/checkout",
                pending: "https://salao-beauty.web.app/checkout",
            },
            auto_return: "approved",
        };

        const response = await preference.create({ body });
        return { preferenceId: response.id };
    } catch (error) {
        logger.error("Error creating preference:", error);
        throw new Error("Failed to create preference");
    }
});

/**
 * processMercadoPagoPayment
 * Processes a payment from the Payment Brick
 */
exports.processMercadoPagoPayment = onCall(async (request) => {
    const paymentData = request.data;

    logger.info("Processing MP payment through Brick");

    const payment = new Payment(client);

    try {
        const idempotencyKey = paymentData.idempotencyKey || `pay_${paymentData.external_reference}_${Date.now()}`;
        const requestOptions = { idempotencyKey };

        const response = await payment.create({ body: paymentData, requestOptions });

        // Update payment status in Firestore if needed
        const appointmentId = paymentData.external_reference;
        if (appointmentId && response.status === "approved") {
            await admin.firestore().collection("appointments").doc(appointmentId).update({
                paymentStatus: "paid",
                paidAmount: response.transaction_amount,
                paymentMethod: response.payment_method_id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        return {
            status: response.status,
            paymentId: response.id,
            pixData: response.point_of_interaction?.transaction_data
        };
    } catch (error) {
        logger.error("Error processing payment:", error);
        throw new Error("Payment processing failed");
    }
});

/**
 * handleMercadoPagoWebhook
 * Listens for Mercado Pago payment updates
 */
exports.handleMercadoPagoWebhook = onRequest(async (request, response) => {
    const idempotencyKey = request.headers["x-idempotency-key"];
    const topic = request.query.topic || request.body.topic;
    const id = request.query.id || (request.body.data && request.body.data.id);

    logger.info(`MP Webhook received: ${topic} ID: ${id} Idempotency: ${idempotencyKey}`);

    if (topic === "payment") {
        try {
            const payment = new Payment(client);
            const data = await payment.get({ id });

            const appointmentId = data.external_reference;
            const status = data.status; // approved, pending, rejected

            logger.info(`Payment ${id} for appointment ${appointmentId} is ${status}`);

            if (appointmentId) {
                const paymentStatusMap = {
                    approved: "paid",
                    pending: "pending",
                    rejected: "failed",
                    cancelled: "failed"
                };

                if (appointmentId) {
                    // Idempotency: Check if already processed
                    const eventRef = admin.firestore().collection('webhook_events').doc(id);
                    const eventDoc = await eventRef.get();

                    if (eventDoc.exists) {
                        logger.info(`Event ${id} already processed.`);
                        response.status(200).send("OK");
                        return;
                    }

                    await eventRef.set({
                        topic,
                        idempotencyKey: idempotencyKey || null,
                        processedAt: admin.firestore.FieldValue.serverTimestamp(),
                        status: status
                    });

                    const paymentStatusMap = {
                        approved: "paid",
                        pending: "pending",
                        rejected: "failed",
                        cancelled: "failed"
                    };

                    await admin.firestore().collection("appointments").doc(appointmentId).update({
                        paymentStatus: paymentStatusMap[status] || "pending",
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    // Link to payments collection
                    await admin.firestore().collection("payments")
                        .where("appointmentId", "==", appointmentId)
                        .limit(1)
                        .get()
                        .then(snapshot => {
                            if (!snapshot.empty) {
                                snapshot.docs[0].ref.update({
                                    status: status === "approved" ? "completed" : "failed",
                                    mp_payment_id: id,
                                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                                });
                            }
                        });
                }
            } catch (error) {
                logger.error("Error processing MP webhook:", error);
            }
        }

    response.status(200).send("OK");
    });

/**
 * Simple HelloWorld for testing
 */
exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from SaaS-Salao Cloud Functions!");
});
