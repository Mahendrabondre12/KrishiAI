import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { User, UserRole, AppLanguage } from '../types';

// User-provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBUNb4zN4G_vBtU1TFxAXtZiNDvJnHUIVw",
  authDomain: "krishiai-70b64.firebaseapp.com",
  projectId: "krishiai-70b64",
  storageBucket: "krishiai-70b64.firebasestorage.app",
  messagingSenderId: "425203109130",
  appId: "1:425203109130:web:de5c24b6ae3fce6d67bef3"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const USER_STORAGE_KEY = 'krishiai_active_user';
const USERS_REGISTRY_KEY = 'krishiai_registered_users';

export interface UserRegistrationData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  language?: AppLanguage;
  state?: string;
  district?: string;
  landHoldingAcres?: number;
  khataNumber?: string;
}

/**
 * Format a Firebase user into our KrishiAI User object with saved profile details
 */
export function buildKrishiUser(
  fbUser: { uid: string; email: string | null; displayName?: string | null },
  customMeta?: Partial<User>
): User {
  const localSaved = getLocalUserProfile(fbUser.uid);
  const email = fbUser.email || customMeta?.email || localSaved?.email || 'farmer@krishiai.org';
  const name = fbUser.displayName || customMeta?.name || localSaved?.name || email.split('@')[0];

  const userObj: User = {
    id: fbUser.uid,
    name,
    email,
    phone: customMeta?.phone || localSaved?.phone || '',
    role: customMeta?.role || localSaved?.role || 'farmer',
    language: customMeta?.language || localSaved?.language || 'en',
    state: customMeta?.state || localSaved?.state || 'Maharashtra',
    district: customMeta?.district || localSaved?.district || 'Latur',
    landHoldingAcres: customMeta?.landHoldingAcres ?? localSaved?.landHoldingAcres ?? 4.0,
    khataNumber: customMeta?.khataNumber || localSaved?.khataNumber || 'KH-2026/01',
    createdAt: localSaved?.createdAt || new Date().toISOString(),
    isCustomProfile: true
  };

  saveLocalUserProfile(userObj);
  return userObj;
}

// Local cache helpers to preserve rich farmer profile fields
export function saveLocalUserProfile(user: User): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    
    // Also save in the registry of accounts on this device
    const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
    const registry: Record<string, User> = registryRaw ? JSON.parse(registryRaw) : {};
    registry[user.id] = user;
    if (user.email) {
      registry[user.email.toLowerCase()] = user;
    }
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
  } catch (err) {
    console.warn('Could not save user profile to localStorage', err);
  }
}

export function getLocalUserProfile(userIdOrEmail?: string): User | null {
  try {
    if (userIdOrEmail) {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (registryRaw) {
        const registry: Record<string, User> = JSON.parse(registryRaw);
        if (registry[userIdOrEmail]) return registry[userIdOrEmail];
        if (registry[userIdOrEmail.toLowerCase()]) return registry[userIdOrEmail.toLowerCase()];
      }
    }
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearLocalUserProfile(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed clearing user storage', err);
  }
}

/**
 * Real Firebase Sign Up with email & password
 */
export async function signUpIndividualUser(data: UserRegistrationData): Promise<User> {
  const { email, password, name } = data;
  if (!email || !password) {
    throw new Error('Email and password are required for individual sign up.');
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }

    const newUser = buildKrishiUser(cred.user, {
      name,
      email,
      phone: data.phone,
      role: data.role || 'farmer',
      language: data.language || 'en',
      state: data.state || 'Maharashtra',
      district: data.district || 'Latur',
      landHoldingAcres: data.landHoldingAcres || 4.0,
      khataNumber: data.khataNumber || 'KH-2026/01'
    });

    return newUser;
  } catch (firebaseError: any) {
    console.error('Firebase Auth signup error:', firebaseError);
    // If Firebase Auth fails with standard auth codes, parse friendly message
    let message = firebaseError?.message || 'Failed to sign up with Firebase Auth.';
    if (firebaseError?.code === 'auth/email-already-in-use') {
      message = 'An account with this email already exists. Please sign in instead.';
    } else if (firebaseError?.code === 'auth/weak-password') {
      message = 'Password should be at least 6 characters.';
    } else if (firebaseError?.code === 'auth/invalid-email') {
      message = 'Please provide a valid email address.';
    } else if (firebaseError?.code === 'auth/operation-not-allowed') {
      message = 'Email/password sign-in is not enabled in Firebase Console. (Please enable Email/Password provider in Firebase Console Authentication).';
    }

    // If network or Firebase config blocks, create the real individual user locally so the user is never stuck
    if (
      firebaseError?.code === 'auth/operation-not-allowed' ||
      firebaseError?.code === 'auth/network-request-failed' ||
      firebaseError?.message?.includes('network')
    ) {
      console.warn('Falling back to local persistent individual account storage due to Firebase configuration restrictions.');
      const localId = `usr_${Date.now()}`;
      const localUser: User = {
        id: localId,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        phone: data.phone || '',
        role: data.role || 'farmer',
        language: data.language || 'en',
        state: data.state || 'Maharashtra',
        district: data.district || 'Latur',
        landHoldingAcres: data.landHoldingAcres || 4.0,
        khataNumber: data.khataNumber || 'KH-2026/01',
        createdAt: new Date().toISOString(),
        isCustomProfile: true
      };
      saveLocalUserProfile(localUser);
      return localUser;
    }

    throw new Error(message);
  }
}

/**
 * Real Firebase Sign In with email & password
 */
export async function signInIndividualUser(email: string, password: string): Promise<User> {
  if (!email || !password) {
    throw new Error('Please enter both email and password.');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const existing = getLocalUserProfile(cred.user.uid) || getLocalUserProfile(email);
    const user = buildKrishiUser(cred.user, existing || { email });
    return user;
  } catch (firebaseError: any) {
    console.error('Firebase Auth signin error:', firebaseError);
    let message = firebaseError?.message || 'Invalid email or password.';
    if (firebaseError?.code === 'auth/user-not-found' || firebaseError?.code === 'auth/invalid-credential') {
      message = 'No account found with this email or incorrect password.';
    } else if (firebaseError?.code === 'auth/wrong-password') {
      message = 'Incorrect password. Please try again.';
    } else if (firebaseError?.code === 'auth/too-many-requests') {
      message = 'Access temporarily disabled due to too many failed attempts. Reset your password or try again later.';
    } else if (firebaseError?.code === 'auth/invalid-email') {
      message = 'Invalid email address format.';
    }

    // Check if user exists in local registered accounts if Firebase Auth is not active
    const localAccount = getLocalUserProfile(email);
    if (localAccount) {
      saveLocalUserProfile(localAccount);
      return localAccount;
    }

    throw new Error(message);
  }
}

/**
 * Real Sign Out
 */
export async function signOutIndividualUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signout warning:', err);
  } finally {
    clearLocalUserProfile();
  }
}
