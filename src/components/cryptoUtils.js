import CryptoJS from "crypto-js";

const secretKey = "Rameshk"; // Same key as encryption

export const decryptID = (encryptedHex) => {
    const base64 = CryptoJS.enc.Hex.parse(encryptedHex).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(base64, secretKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
};