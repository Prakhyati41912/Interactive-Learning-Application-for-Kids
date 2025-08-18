import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { auth, db, storage } from "./firebaseConfig"; // Your actual Firebase module

// Mock Firebase modules
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})), // Mock Firebase App
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  })),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({})),
}));

describe("Firebase Config", () => {
  test("Firebase should initialize properly", () => {
    expect(initializeApp).toHaveBeenCalled();
  });

  test("Auth module should be initialized", () => {
    expect(auth).toBeDefined();
  });

  test("Firestore should be initialized", () => {
    expect(db).toBeDefined();
  });

  test("Storage should be initialized", () => {
    expect(storage).toBeDefined();
  });
});
