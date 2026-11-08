"use server";

import { revalidatePath } from "next/cache";
import { ID, InputFile, Query } from "node-appwrite";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// UPDATE PATIENT MEDICAL INFO
export const updatePatientMedicalInfo = async ({
  patientId,
  ...medicalInfo
}: UpdatePatientMedicalInfoParams) => {
  try {
    const payload = Object.fromEntries(
      Object.entries(medicalInfo).filter(([, value]) => value !== undefined)
    );

    const updatedPatient = await databases.updateDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId,
      payload
    );

    revalidatePath("/admin");
    return parseStringify(updatedPatient);
  } catch (error) {
    console.error("An error occurred while updating patient medical info:", error);

    const appwriteMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { message?: string } }).response?.message ===
        "string"
        ? (error as { response?: { message?: string } }).response!.message
        : undefined;

    if (appwriteMessage) {
      throw new Error(appwriteMessage);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(
      "An unexpected error occurred while updating patient medical info. Please try again."
    );
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  treatmentConsent,
  disclosureConsent,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        treatmentConsent,
        disclosureConsent,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    const appwriteMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { message?: string } }).response?.message ===
        "string"
        ? (error as { response?: { message?: string } }).response!.message
        : undefined;

    if (appwriteMessage) {
      throw new Error(appwriteMessage);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(
      "An unexpected error occurred while creating a new patient. Please try again."
    );
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
