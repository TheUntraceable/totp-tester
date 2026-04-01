export interface TOTPConfig {
    id: string;
    issuer: string;
    label: string;
    secret: string;
    algorithm: "SHA1" | "SHA256" | "SHA512";
    digits: 6 | 8;
    period: number;
    createdAt: number;
}

export const STORAGE_KEY = "totp-tester-configs";

export const DEFAULT_CONFIG: Omit<TOTPConfig, "id" | "createdAt"> = {
    issuer: "",
    label: "",
    secret: "",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
};
