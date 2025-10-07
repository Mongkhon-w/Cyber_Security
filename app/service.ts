import * as crypto from "crypto";

const algorithm = "aes-256-cbc";

// อ่านจาก environment
const key = Buffer.from(process.env.SECRET_KEY || "", "hex"); 
const iv = Buffer.from(process.env.SECRET_IV || "", "hex");   

if (key.length !== 32) {
  throw new Error("SECRET_KEY ต้องยาว 32 bytes (hex 64 chars)");
}
if (iv.length !== 16) {
  throw new Error("SECRET_IV ต้องยาว 16 bytes (hex 32 chars)");
}

export const encode = (password: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(password, "utf-8", "base64");
  const encryptedStr = encrypted + cipher.final("base64");
  console.log(`encode `, encryptedStr);
  return encryptedStr;
};

export const decode = (encryptedStr: string) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = decipher.update(encryptedStr, "base64", "utf-8");
  const decryptedStr = decrypted + decipher.final("utf-8");
  console.log(`decode `, decryptedStr);
  return decryptedStr;
};