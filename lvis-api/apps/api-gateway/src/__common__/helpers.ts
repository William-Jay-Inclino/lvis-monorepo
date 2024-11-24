import * as crypto from 'crypto';



export function decrypt_password(ciphertext: string, secretKey: string): string {
    
    const parts = ciphertext.split(':');
    if (parts.length !== 2) {
        throw new Error('Invalid ciphertext format. It should be in the format ivHex:encryptedData');
    }
    
    const [ivHex, encrypted] = parts;
    
    if (ivHex.length !== 32) {
        throw new Error('Invalid IV length: should be 32 hex characters (16 bytes)');
    }

    try {
        const iv = Buffer.from(ivHex, 'hex');  
        const encryptedBuffer = Buffer.from(encrypted, 'hex'); 

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedBuffer, null, 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted; 
    } catch (error) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}