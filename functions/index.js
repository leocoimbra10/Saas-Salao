const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp();
}

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
exports.calculateCommissions = onDocumentCreated("appointments/{appointmentId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;

    const data = snapshot.data();
    if (data.status !== "completed") return null;

    logger.info(`Calculating commission for appointment ${event.params.appointmentId}`);

    // Logic to update staff balance or create a commission document
    // This ensures calculations happen server-side and are tamper-proof
    return null;
});

/**
 * Simple HelloWorld for testing
 */
exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from SaaS-Salao Cloud Functions!");
});
