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

// Create a new bridal package
export const createBridalPackage = async (
    clientId: string,
    clientName: string,
    clientPhone: string,
    orgId: string,
    weddingDate: Date
): Promise<string> => {
    const newPackage: Omit<BridalPackage, 'id'> = {
        clientId,
        clientName,
        clientPhone,
        orgId,
        weddingDate,
        status: 'lead',
        timeline: [
            { id: 'trial', type: 'trial', date: null, status: 'pending' },
            { id: 'pre_wedding', type: 'pre_wedding', date: null, status: 'pending' },
            { id: 'wedding_day', type: 'wedding_day', date: weddingDate, status: 'pending' },
        ],
        attendants: [],
        moodboardPhotos: [],
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
    const totalAttendantValue = updatedAttendants.reduce((sum, a) => sum + a.totalPrice, 0);

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

// Upload moodboard photo
export const uploadMoodboardPhoto = async (
    packageId: string,
    file: File,
    category: MoodboardPhoto['category'],
    notes?: string
): Promise<string> => {
    // Upload to Firebase Storage
    const fileName = `moodboards/${packageId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    // Add to package
    const pkg = await getBridalPackage(packageId);
    if (!pkg) throw new Error('Package not found');

    const newPhoto: MoodboardPhoto = {
        id: Date.now().toString(),
        imageUrl,
        category,
        uploadDate: new Date(),
        notes,
    };

    await updateBridalPackage(packageId, {
        moodboardPhotos: [...pkg.moodboardPhotos, newPhoto],
    });

    return imageUrl;
};

// Delete moodboard photo
export const deleteMoodboardPhoto = async (packageId: string, photoId: string): Promise<void> => {
    const pkg = await getBridalPackage(packageId);
    if (!pkg) throw new Error('Package not found');

    await updateBridalPackage(packageId, {
        moodboardPhotos: pkg.moodboardPhotos.filter(p => p.id !== photoId),
    });
};

// Update timeline milestone
export const updateTimelineMilestone = async (
    packageId: string,
    milestoneId: string,
    updates: Partial<TimelineMilestone>
): Promise<void> => {
    const pkg = await getBridalPackage(packageId);
    if (!pkg) throw new Error('Package not found');

    const updatedTimeline = pkg.timeline.map(m =>
        m.id === milestoneId ? { ...m, ...updates } : m
    );

    await updateBridalPackage(packageId, {
        timeline: updatedTimeline,
    });
};

// Calculate attendant price based on services
export const calculateAttendantPrice = (serviceIds: string[]): number => {
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
