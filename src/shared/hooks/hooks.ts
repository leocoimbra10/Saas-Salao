/**
 * BEAUTY SALON NEOMORPHIC APP - Firebase Hooks
 */
import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth, storage } from '../lib/firebase';
import {
  Service,
  Appointment,
  Client,
  PortfolioItem,
  SERVICES_DATA
} from '../types/types';

// Initialize services in Firestore if not exists
export function useInitializeServices() {
  useEffect(() => {
    const initServices = async () => {
      try {
        const servicesRef = collection(db, 'services');
        const snapshot = await getDocs(servicesRef);

        if (snapshot.empty) {
          // Add initial services
          for (const service of SERVICES_DATA) {
            await addDoc(servicesRef, {
              ...service,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
          }
          console.log('Services initialized');
        }
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };

    initServices();
  }, []);
}

// Auth Hook - REMOVED (Use AuthContext)
/*
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    return signOut(auth);
  }, []);

  return { user, loading, login, register, logout };
}
*/


// Services Hook
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        setServices(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addService = useCallback(async (service: Omit<Service, 'id'>) => {
    return addDoc(collection(db, 'services'), {
      ...service,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }, []);

  const updateService = useCallback(async (id: string, data: Partial<Service>) => {
    return updateDoc(doc(db, 'services', id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteService = useCallback(async (id: string) => {
    return deleteDoc(doc(db, 'services', id));
  }, []);

  return { services, loading, addService, updateService, deleteService };
}

// Appointments Hook
export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'appointments'),
      orderBy('date'),
      orderBy('time')
    );

    if (date) {
      q = query(
        collection(db, 'appointments'),
        where('date', '==', date),
        orderBy('time')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          } as Appointment;
        });
        setAppointments(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [date]);

  const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addDoc(collection(db, 'appointments'), {
      ...appointment,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }, []);

  const updateAppointment = useCallback(async (id: string, data: Partial<Appointment>) => {
    return updateDoc(doc(db, 'appointments', id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteAppointment = useCallback(async (id: string) => {
    return deleteDoc(doc(db, 'appointments', id));
  }, []);

  return { appointments, loading, addAppointment, updateAppointment, deleteAppointment };
}

// Clients Hook
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'clients'), orderBy('name')),
      (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            lastVisit: data.lastVisit?.toDate?.() || undefined,
          } as Client;
        });
        setClients(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addClient = useCallback(async (client: Omit<Client, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent'>) => {
    return addDoc(collection(db, 'clients'), {
      ...client,
      totalVisits: 0,
      totalSpent: 0,
      createdAt: Timestamp.now(),
    });
  }, []);

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
    return updateDoc(doc(db, 'clients', id), data);
  }, []);

  const getClient = useCallback(async (id: string) => {
    const docRef = doc(db, 'clients', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Client;
    }
    return null;
  }, []);

  return { clients, loading, addClient, updateClient, getClient };
}

// Portfolio Hook
export function usePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'portfolio'), orderBy('uploadDate', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            uploadDate: data.uploadDate?.toDate?.() || new Date(),
          } as PortfolioItem;
        });
        setItems(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching portfolio:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const uploadImage = useCallback(async (file: File, title: string, category: string) => {
    const imageRef = ref(storage, `portfolio/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);

    return addDoc(collection(db, 'portfolio'), {
      imageUrl: url,
      title,
      category,
      uploadDate: Timestamp.now(),
    });
  }, []);

  const deleteItem = useCallback(async (id: string, imageUrl: string) => {
    // Delete image from storage
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
    // Delete document
    return deleteDoc(doc(db, 'portfolio', id));
  }, []);

  return { items, loading, uploadImage, deleteItem };
}

// Analytics Hook
export function useAnalytics(month?: number, year?: number) {
  const [stats, setStats] = useState({
    monthlyRevenue: 0,
    monthlyAppointments: 0,
    clientRetention: 0,
    topServices: [],
    revenueByDay: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const now = new Date();
        const targetMonth = month ?? now.getMonth();
        const targetYear = year ?? now.getFullYear();

        const appointmentsRef = collection(db, 'appointments');
        const snapshot = await getDocs(appointmentsRef);

        const monthlyAppointments = snapshot.docs
          .map(doc => doc.data())
          .filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate.getMonth() === targetMonth &&
              aptDate.getFullYear() === targetYear &&
              apt.status !== 'cancelled';
          });

        const monthlyRevenue = monthlyAppointments.reduce(
          (sum, apt) => sum + (apt.totalAmount || 0), 0
        );

        // Calculate revenue by day
        const revenueMap = new Map<string, number>();
        monthlyAppointments.forEach(apt => {
          const current = revenueMap.get(apt.date) || 0;
          revenueMap.set(apt.date, current + (apt.totalAmount || 0));
        });
        const revenueByDay = Array.from(revenueMap.entries())
          .map(([date, amount]) => ({ date, amount }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Calculate client retention (simplified)
        const uniqueClients = new Set(monthlyAppointments.map(apt => apt.clientId)).size;
        const returningClients = monthlyAppointments.filter(
          (apt, idx, arr) => arr.findIndex(a => a.clientId === apt.clientId) !== idx
        ).length;
        const retention = uniqueClients > 0
          ? Math.round((returningClients / uniqueClients) * 100)
          : 0;

        setStats({
          monthlyRevenue,
          monthlyAppointments: monthlyAppointments.length,
          clientRetention: retention,
          topServices: [],
          revenueByDay,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [month, year]);

  return { stats, loading };
}
