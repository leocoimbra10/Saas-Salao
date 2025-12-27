/**
 * NOTIFICATION SERVICE
 * Handles alerts, reminders and communication via WhatsApp/Email stubs
 */
import { toast } from 'sonner';

export interface NotificationPayload {
    to: string;
    message: string;
    type: 'whatsapp' | 'email' | 'in_app';
    metadata?: Record<string, any>;
}

export const notificationService = {
    /**
     * Send a manual alert to a client
     */
    sendManualAlert: async (payload: NotificationPayload) => {
        console.log(`[NotificationService] Sending ${payload.type} to ${payload.to}:`, payload.message);

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));

        if (payload.type === 'whatsapp') {
            toast.success(`WhatsApp enviado para ${payload.to}`);
        } else {
            toast.success('Notificação enviada com sucesso');
        }

        return { success: true, messageId: `msg_${Date.now()}` };
    },

    /**
     * Queue a reminder for an upcoming appointment or milestone
     */
    queueReminder: async (payload: NotificationPayload, scheduledFor: Date) => {
        console.log(`[NotificationService] Queuing reminder for ${scheduledFor}:`, payload);

        // In a real scenario, this would write to a 'notifications_queue' collection
        // which a Cloud Function would then pick up.

        return { success: true, queueId: `q_${Date.now()}` };
    },

    /**
     * Send automated bridal milestone alert
     */
    sendMilestoneAlert: async (brideName: string, bridePhone: string, milestoneTitle: string) => {
        const message = `Olá ${brideName}! Faltam poucos dias para o seu: ${milestoneTitle}. Já está tudo pronto? 💍`;

        return notificationService.sendManualAlert({
            to: bridePhone,
            message,
            type: 'whatsapp'
        });
    }
};
