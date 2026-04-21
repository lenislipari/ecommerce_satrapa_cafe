import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env.local");
const env = fs.readFileSync(envPath, "utf8");

const emailMatch = env.match(/^GOOGLE_SA_EMAIL\s*=\s*(.+)$/m);
const keyMatch = env.match(/^GOOGLE_SA_KEY\s*=\s*"([\s\S]+?)"\s*$/m);

if (!emailMatch || !keyMatch) {
  console.error("No encontré GOOGLE_SA_EMAIL o GOOGLE_SA_KEY en .env.local");
  process.exit(1);
}

const client_email = emailMatch[1].trim();
const private_key = keyMatch[1];

const json = JSON.stringify({ client_email, private_key });
const b64 = Buffer.from(json, "utf8").toString("base64");

console.log(b64);
