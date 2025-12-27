export const generateVerificationToken = (): string => {
    // const otp = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
} 