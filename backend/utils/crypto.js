require("dotenv").config();
const crypto = require("node:crypto");

const secret = process.env.CRYPTO_SECRET;
const algorithm = "aes-256-ctr";
const ivLength = 16; // 16 bytes para o AES

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const key = crypto.createHash("sha256").update(secret).digest();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;

}

function decrypt(encryptedText) {
  const [ivHex, encryptedHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

module.exports = { encrypt, decrypt };
