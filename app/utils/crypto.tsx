import CryptoJS from 'crypto-js';

export async function decryptData(encryptedData: string) {
    const encryptKey = process.env.REACT_APP_CRYPT_KEY
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, encryptKey!)
    return decryptedData.toString(CryptoJS.enc.Utf8)
}
