import { getFirestore, collection, getDocs } from "firebase/firestore";

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})), // Mock Firestore instance
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })), // Mock Firestore query
}));

describe("Firestore Tests", () => {
  test("getFirestore should be called", () => {
    const db = getFirestore();
    expect(db).toBeDefined();
  });

  test("collection should be called with correct params", () => {
    const db = getFirestore();
    const colRef = collection(db, "users");
    expect(collection).toHaveBeenCalledWith(db, "users");
  });

  test("getDocs should return an empty array", async () => {
    const db = getFirestore();
    const colRef = collection(db, "users");
    const snapshot = await getDocs(colRef);
    expect(snapshot.docs).toEqual([]);
  });
});
