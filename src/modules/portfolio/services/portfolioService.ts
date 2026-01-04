import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '../../../shared/lib/firebase';
import { PortfolioItem } from '../../../shared/types/types';

const COLLECTION_NAME = 'portfolio';

export const portfolioService = {
    /**
     * Fetch all portfolio items
     */
    getPortfolioItems: async (): Promise<PortfolioItem[]> => {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('uploadDate', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as PortfolioItem));
        } catch (error) {
            console.error("Error fetching portfolio items:", error);
            throw error;
        }
    },

    /**
     * Upload a new image and create a portfolio item
     */
    addPortfolioItem: async (file: File, title: string, category: string): Promise<PortfolioItem> => {
        try {
            // 1. Upload Image to Storage
            const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save Metadata to Firestore
            const newItem = {
                imageUrl: downloadURL,
                title,
                category,
                uploadDate: serverTimestamp(),
                storagePath: snapshot.ref.fullPath // Keep track for deletion
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), newItem);

            return {
                id: docRef.id,
                ...newItem,
                uploadDate: new Date() // Return local date for immediate UI update
            } as PortfolioItem;
        } catch (error) {
            console.error("Error adding portfolio item:", error);
            throw error;
        }
    },

    /**
     * Delete a portfolio item (Firestore doc + Storage file)
     */
    deletePortfolioItem: async (id: string, imageUrl: string): Promise<void> => {
        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, COLLECTION_NAME, id));

            // 2. Delete from Storage
            // We try to reconstruct the ref from the URL or use a saved storagePath if we had one.
            // For now, let's try to extract it or just ignore if it fails (not ideal but safe).
            // A better approach is saving 'storagePath' in the doc (added above).
            // If the doc didn't have storagePath (old data), we might skip storage delete or try parsing URL.

            try {
                const storageRef = ref(storage, imageUrl); // This often works if imageUrl is a standard firebase storage URL
                await deleteObject(storageRef);
            } catch (storageError) {
                console.warn("Could not delete file from storage (might verify path):", storageError);
            }

        } catch (error) {
            console.error("Error deleting portfolio item:", error);
            throw error;
        }
    }
};
