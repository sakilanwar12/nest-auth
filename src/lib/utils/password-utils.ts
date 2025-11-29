import * as bcrypt from 'bcrypt';
import { envVar } from "src/config/envVar";

class PasswordUtils {
    static async hash(password: string) {
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

    static async compare(plainPassword: string, hashedPassword: string) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error("Password compare error:", error);
            throw new Error("Failed to compare password.");
        }
    }
}

export default PasswordUtils;
