import * as bcrypt from 'bcrypt'
import { envVar } from "src/config/envVar";

async function passwordHash(password: string) {
    try {
        const saltRounds = Number(envVar.PASSWORD_SALT);

        if (isNaN(saltRounds)) {
            throw new Error("Invalid salt rounds value.");
        }

        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error("Password hashing error:", error);
        throw new Error("Failed to hash password.");
    }
}

async function passwordCompare(plainPassword: string, hashedPassword: string) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error("Password compare error:", error);
        throw new Error("Failed to compare password.");
    }
}

export const passwordUtils = {
    passwordHash,
    passwordCompare
}