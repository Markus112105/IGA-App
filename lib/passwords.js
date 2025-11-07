import crypto from "node:crypto";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password, storedHash, storedSalt) {
  const hash = crypto.scryptSync(password, storedSalt, 64).toString("hex");
  return hash === storedHash;
}
