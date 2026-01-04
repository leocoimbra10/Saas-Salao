/**
 * BRIDE SERVICE
 * Firestore operations for the Bride Portal
 */
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../shared/lib/firebase';
import { BridalPackage, Attendant, MoodboardPhoto, TimelineMilestone, ATTENDANT_SERVICES } from '../types/brideTypes';

const BRIDAL_PACKAGES_COLLECTION = 'bridal_packages';
const BRIDAL_SERVICES_COLLECTION = 'bridal_services';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
        return timestamp;
    }
    return new Date(timestamp);
};

// --- BRIDAL PACKAGES (Clients/Leads) OPERATIONS ---

// Create a new bridal package
export const createBridalPackage = async ({
    clientId,
    clientName,
    clientPhone,
    orgId,
    weddingDate
}: {
    clientId: string;
    clientName: string;
    clientPhone: string;
    orgId: string;
    weddingDate: Date;
}): Promise<string> => {
    const newPackage: Omit<BridalPackage, 'id'> = {
        clientId,
        clientName,
        clientPhone,
        orgId,
        weddingDate,
        status: 'lead',
        // Timeline and Moodboard are handled via sub-collections
        attendants: [],
        packageValue: 0,
        depositPaid: 0,
        balanceDue: 0,
        brideServices: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, BRIDAL_PACKAGES_COLLECTION), {
        ...newPackage,
        weddingDate: Timestamp.fromDate(weddingDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    // Initialize sub-collections with default milestones
    const timelineRef = collection(db, BRIDAL_PACKAGES_COLLECTION, docRef.id, 'timeline');
    const defaultMilestones = [
        { id: 'trial', type: 'trial', date: null, status: 'pending' },
        { id: 'pre_wedding', type: 'pre_wedding', date: null, status: 'pending' },
        { id: 'wedding_day', type: 'wedding_day', date: weddingDate, status: 'pending' },
    ];

    for (const milestone of defaultMilestones) {
        await addDoc(timelineRef, {
            ...milestone,
            date: milestone.date ? Timestamp.fromDate(milestone.date) : null
        });
    }

    return docRef.id;
};

// Get bridal package by ID
export const getBridalPackage = async (packageId: string): Promise<BridalPackage | null> => {
    const docRef = doc(db, BRIDAL_PACKAGES_COLLECTION, packageId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        weddingDate: convertTimestamp(data.weddingDate),
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
    } as BridalPackage;
};

// Get full bride data (Consolidated package + sub-collections)
export const getFullBrideData = async (packageId: string): Promise<BridalPackage | null> => {
    const pkg = await getBridalPackage(packageId);
    if (!pkg) return null;

    const [timeline, moodboard] = await Promise.all([
        getTimeline(packageId),
        getMoodboard(packageId)
    ]);

    return {
        ...pkg,
        timeline,
        moodboardPhotos: moodboard
    };
};

// Get all bridal packages for an organization
export const getBridalPackagesByOrg = async (orgId: string): Promise<BridalPackage[]> => {
    const q = query(
        collection(db, BRIDAL_PACKAGES_COLLECTION),
        where('orgId', '==', orgId),
        orderBy('weddingDate', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        weddingDate: convertTimestamp(doc.data().weddingDate),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as BridalPackage[];
};

// Subscribe to bridal packages updates
export const subscribeToBridalPackages = (
    orgId: string,
    callback: (packages: BridalPackage[]) => void
) => {
    const q = query(
        collection(db, BRIDAL_PACKAGES_COLLECTION),
        where('orgId', '==', orgId),
        orderBy('weddingDate', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const packages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            weddingDate: convertTimestamp(doc.data().weddingDate),
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt),
        })) as BridalPackage[];
        callback(packages);
    });
};

// Update bridal package
export const updateBridalPackage = async (
    packageId: string,
    updates: Partial<BridalPackage>
): Promise<void> => {
    const docRef = doc(db, BRIDAL_PACKAGES_COLLECTION, packageId);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
};

// Add attendant to package
export const addAttendant = async (
    packageId: string,
    attendant: Omit<Attendant, 'id'>
): Promise<void> => {
    const pkg = await getBridalPackage(packageId);
    if (!pkg) throw new Error('Package not found');

    const newAttendant: Attendant = {
        ...attendant,
        id: Date.now().toString(),
    };

    const updatedAttendants = [...pkg.attendants, newAttendant];
    // Recalculate based on services logic might be needed here if pricing is complex
    // For now assuming totalPrice is passed correctly

    await updateBridalPackage(packageId, {
        attendants: updatedAttendants,
        packageValue: pkg.packageValue + attendant.totalPrice,
        balanceDue: (pkg.packageValue + attendant.totalPrice) - pkg.depositPaid,
    });
};

// Remove attendant from package
export const removeAttendant = async (packageId: string, attendantId: string): Promise<void> => {
    const pkg = await getBridalPackage(packageId);
    if (!pkg) throw new Error('Package not found');

    const attendantToRemove = pkg.attendants.find(a => a.id === attendantId);
    if (!attendantToRemove) return;

    const updatedAttendants = pkg.attendants.filter(a => a.id !== attendantId);

    await updateBridalPackage(packageId, {
        attendants: updatedAttendants,
        packageValue: pkg.packageValue - attendantToRemove.totalPrice,
        balanceDue: (pkg.packageValue - attendantToRemove.totalPrice) - pkg.depositPaid,
    });
};

// Get timeline milestones
export const getTimeline = async (packageId: string): Promise<TimelineMilestone[]> => {
    const q = query(
        collection(db, BRIDAL_PACKAGES_COLLECTION, packageId, 'timeline'),
        orderBy('date', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineMilestone));
};

// Update timeline milestone in sub-collection
export const updateTimelineMilestone = async (
    packageId: string,
    milestoneId: string,
    updates: Partial<TimelineMilestone>
): Promise<void> => {
    const docRef = doc(db, BRIDAL_PACKAGES_COLLECTION, packageId, 'timeline', milestoneId);
    await updateDoc(docRef, { ...updates });
};

// Get moodboard photos
export const getMoodboard = async (packageId: string): Promise<MoodboardPhoto[]> => {
    const q = query(
        collection(db, BRIDAL_PACKAGES_COLLECTION, packageId, 'moodboard'),
        orderBy('uploadDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: convertTimestamp(doc.data().uploadDate)
    } as MoodboardPhoto));
};

// Upload moodboard photo to sub-collection
export const uploadMoodboardPhoto = async (
    packageId: string,
    file: File,
    category: MoodboardPhoto['category'],
    notes?: string
): Promise<string> => {
    const fileName = `moodboards/${packageId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    const newPhoto: Omit<MoodboardPhoto, 'id'> = {
        imageUrl,
        category,
        uploadDate: new Date(),
        notes,
    };

    await addDoc(collection(db, BRIDAL_PACKAGES_COLLECTION, packageId, 'moodboard'), {
        ...newPhoto,
        uploadDate: Timestamp.now()
    });

    return imageUrl;
};

// Delete moodboard photo from sub-collection
export const deleteMoodboardPhoto = async (packageId: string, photoId: string): Promise<void> => {
    const docRef = doc(db, BRIDAL_PACKAGES_COLLECTION, packageId, 'moodboard', photoId);
    await deleteDoc(docRef);
};

// Calculate attendant price based on services
export const calculateAttendantPrice = (serviceIds: string[]): number => {
    // This function relied on hardcoded ATTENDANT_SERVICES which we are moving away from.
    // Ideally this should fetch from the new service catalog or be passed the service objects.
    // For migration compatibility, we might leave it but warn.
    return serviceIds.reduce((total, serviceId) => {
        const service = ATTENDANT_SERVICES.find(s => s.id === serviceId);
        return total + (service?.price || 0);
    }, 0);
};

// Update deposit paid
export const updateDeposit = async (packageId: string, depositAmount: number): Promise<void> => {
    const pkg = await getBridalPackage(packageId);
    if (!pkg) throw new Error('Package not found');

    await updateBridalPackage(packageId, {
        depositPaid: depositAmount,
        balanceDue: pkg.packageValue - depositAmount,
    });
};

// Check if a user/appointment is a bride
export const checkIfBride = async (clientId: string, orgId: string): Promise<BridalPackage | null> => {
    const q = query(
        collection(db, BRIDAL_PACKAGES_COLLECTION),
        where('clientId', '==', clientId),
        where('orgId', '==', orgId),
        where('status', 'in', ['lead', 'confirmed', 'trial_done'])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
        weddingDate: convertTimestamp(doc.data().weddingDate),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
    } as BridalPackage;
};

// --- BRIDAL CATALOG SERVICES OPERATIONS (Admin Managed) ---

export interface BridalServiceData {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: 'bride' | 'attendant' | 'mother' | 'trial' | 'package';
    isActive: boolean;
    hasDiscount: boolean;
    discountPercentage: number;
    customFields: any[];
    order: number;
    orgId: string;
}

export const getBridalServices = async (orgId: string): Promise<BridalServiceData[]> => {
    const q = query(
        collection(db, BRIDAL_SERVICES_COLLECTION),
        where('orgId', '==', orgId),
        orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BridalServiceData));
};

export const createBridalService = async (service: BridalServiceData): Promise<string> => {
    const { id, ...data } = service; // Remove ID if present
    const docRef = await addDoc(collection(db, BRIDAL_SERVICES_COLLECTION), data);
    return docRef.id;
};

export const updateBridalService = async (serviceId: string, updates: Partial<BridalServiceData>): Promise<void> => {
    const docRef = doc(db, BRIDAL_SERVICES_COLLECTION, serviceId);
    await updateDoc(docRef, updates);
};

export const deleteBridalService = async (serviceId: string): Promise<void> => {
    const docRef = doc(db, BRIDAL_SERVICES_COLLECTION, serviceId);
    await deleteDoc(docRef);
};
