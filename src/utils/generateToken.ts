import { TokenPayload } from "./types";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';


export const generateToken = async ({ id, email, role }: TokenPayload): Promise<string> => {

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id, email, role }, secret, {
        expiresIn: "24h", // 7d, 30d,   
    });
    return token;

}