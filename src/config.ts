import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
  "HOST_IP",
  "SUB_ID",
  "R_GROUP",
  // generate later
  "SUPABASE_URL",
  "SUPABASE_KEY",
];

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable],
);

if (missingVariables.length > 0) {
  console.error("Missing environment variables:");
  missingVariables.forEach((variable) => console.error(`- ${variable}`));
  throw new Error("One or more environment variables are missing.");
}

export const config = {
  DISCORD_TOKEN: process.env["DISCORD_TOKEN"]!,
  DISCORD_CLIENT_ID: process.env["DISCORD_CLIENT_ID"]!,
  HOST_IP: process.env["HOST_IP"]!,
  SUB_ID: process.env["SUB_ID"]!,
  R_GROUP: process.env["R_GROUP"]!,
  SUPABASE_URL: process.env["SUPABASE_URL"]!,
  SUPABASE_KEY: process.env["SUPABASE_KEY"]!,
};
