import * as OTPAuth from "otpauth";

import type { TOTPConfig } from "./types";

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateSecret(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    let result = "";
    for (let i = 0; i < bytes.length; i++) {
        result += BASE32_CHARS[bytes[i] % 32];
    }
    return result;
}

export function createTOTP(config: TOTPConfig): OTPAuth.TOTP {
    return new OTPAuth.TOTP({
        issuer: config.issuer || undefined,
        label: config.label || undefined,
        secret: OTPAuth.Secret.fromBase32(config.secret),
        algorithm: config.algorithm,
        digits: config.digits,
        period: config.period,
    });
}

export function computeCode(config: TOTPConfig): {
    code: string;
    remaining: number;
} {
    const totp = createTOTP(config);
    const code = totp.generate();
    const remaining =
        config.period - (Math.floor(Date.now() / 1000) % config.period);
    return { code, remaining };
}

export function buildOtpauthUri(config: TOTPConfig): string {
    const totp = createTOTP(config);
    return totp.toString();
}

export function parseOtpauthUri(uri: string): Partial<TOTPConfig> {
    try {
        const parsed = OTPAuth.URI.parse(uri);
        if (parsed instanceof OTPAuth.TOTP) {
            return {
                issuer: parsed.issuer || "",
                label: parsed.label || "",
                secret: parsed.secret.base32,
                algorithm: parsed.algorithm as TOTPConfig["algorithm"],
                digits: parsed.digits as TOTPConfig["digits"],
                period: parsed.period,
            };
        }
    } catch {
        // invalid URI
    }
    return {};
}
