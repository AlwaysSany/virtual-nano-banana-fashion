// Simple IndexedDB-backed storage with fallbacks to localStorage/sessionStorage
// Provides getUserProducts and setUserProducts helpers.

import type { Product } from '../types';

const DB_NAME = 'virtual-fashion-db';
const STORE_NAME = 'kv';
const KEY_USER_PRODUCTS = 'userProducts';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const r = store.get(key);
      r.onsuccess = () => resolve((r.result as T) ?? null);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return null;
  }
}

async function idbSet<T>(key: string, val: T): Promise<boolean> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const r = store.put(val, key);
      r.onsuccess = () => resolve(true);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return false;
  }
}

export async function getUserProducts(): Promise<Product[] | null> {
  // Try IndexedDB
  const idb = await idbGet<Product[]>(KEY_USER_PRODUCTS);
  if (idb && Array.isArray(idb)) return idb;

  // Fallback: localStorage then sessionStorage
  try {
    const raw = localStorage.getItem(KEY_USER_PRODUCTS) || sessionStorage.getItem(KEY_USER_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Product[];
    }
  } catch {}
  return null;
}

export async function setUserProducts(products: Product[]): Promise<'idb' | 'local' | 'session' | 'none'> {
  // Try IndexedDB first
  const ok = await idbSet(KEY_USER_PRODUCTS, products);
  if (ok) return 'idb';

  try {
    localStorage.setItem(KEY_USER_PRODUCTS, JSON.stringify(products));
    return 'local';
  } catch {}
  try {
    sessionStorage.setItem(KEY_USER_PRODUCTS, JSON.stringify(products));
    return 'session';
  } catch {}
  return 'none';
}
