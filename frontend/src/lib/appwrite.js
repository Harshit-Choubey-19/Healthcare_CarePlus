import { Client, Account } from "appwrite";

export const client = new Client();

const projectID = process.env.PROJECT_ID;

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(projectID);

export const account = new Account(client);
export { ID } from "appwrite";
