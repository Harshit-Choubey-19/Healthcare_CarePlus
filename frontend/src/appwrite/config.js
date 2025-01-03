import { Client, Databases, Storage, Messaging } from "appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  VITE_ENDPOINT,
} = process.env;

const client = new Client();

client.setEndpoint(VITE_ENDPOINT).setProject(PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const messaging = new Messaging(client);
