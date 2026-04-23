import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

if (!firebaseConfig.apiKey) throw new Error('Missing VITE_FIREBASE_API_KEY')
if (!firebaseConfig.authDomain) throw new Error('Missing VITE_FIREBASE_AUTH_DOMAIN')
if (!firebaseConfig.projectId) throw new Error('Missing VITE_FIREBASE_PROJECT_ID')
if (!firebaseConfig.appId) throw new Error('Missing VITE_FIREBASE_APP_ID')

export const firebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)

const g = globalThis as any

export const firebaseAuth = g.__FANNU_FIREBASE_AUTH__ ?? getAuth(firebaseApp)
g.__FANNU_FIREBASE_AUTH__ = firebaseAuth

export const firebaseDb =
  g.__FANNU_FIREBASE_DB__ ??
  (() => {
    try {
      return initializeFirestore(firebaseApp, { ignoreUndefinedProperties: true })
    } catch {
      return getFirestore(firebaseApp)
    }
  })()

g.__FANNU_FIREBASE_DB__ = firebaseDb
