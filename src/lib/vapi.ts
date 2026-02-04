// src/lib/vapi.ts
import Vapi from "@vapi-ai/web";

// Ensure this environment variable is set in your .env.local file
const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

if (!publicKey) {
  console.error("Vapi Public Key is missing! Check your .env file.");
}

export const vapi = new Vapi(publicKey || "dummy-key-to-prevent-crash");