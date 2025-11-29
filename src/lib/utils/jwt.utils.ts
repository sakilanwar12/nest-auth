import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { envVar } from 'src/config/envVar';
export interface JwtPayload {
    sub: string;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
}
export class JwtUtils {
    private static jwtService = new JwtService();

    private static async generateToken(
        payload: JwtPayload,
        options: { secret: string; expiresIn: string | number }
    ) {
        try {
            return await this.jwtService.signAsync(payload, options as JwtSignOptions);
        } catch (error) {
            console.error("JWT generation error:", error);
            throw new Error("Failed to generate token.");
        }
    }

    static accessToken(payload: JwtPayload) {
        return this.generateToken(payload, {
            secret: envVar.NEST_AUTH_ACCESS_TOKEN_SECRET,
            expiresIn: envVar.NEST_AUTH_ACCESS_TOKEN_EXPIRES_IN,
        });
    }

    static refreshToken(payload: JwtPayload) {
        return this.generateToken(payload, {
            secret: envVar.NEST_AUTH_REFRESH_TOKEN_SECRET,
            expiresIn: envVar.NEST_AUTH_REFRESH_TOKEN_EXPIRES_IN,
        });
    }

    static async verifyRefreshToken(token: string): Promise<JwtPayload> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: envVar.NEST_AUTH_REFRESH_TOKEN_SECRET,
            });
        } catch (error) {
            throw new Error("Invalid refresh token");
        }
    }
}
