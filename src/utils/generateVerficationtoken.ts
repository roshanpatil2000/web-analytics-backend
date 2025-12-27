import crypto from 'crypto'
export const generateVerificationToken = (): string => {
    const otp = crypto.randomInt(100000, 1000000).toString();
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}
