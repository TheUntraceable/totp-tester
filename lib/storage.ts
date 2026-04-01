import type { TOTPConfig } from "./types";
import { STORAGE_KEY } from "./types";

export function loadConfigs(): TOTPConfig[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as TOTPConfig[];
    } catch {
        return [];
    }
}

export function saveConfig(config: TOTPConfig): void {
    const configs = loadConfigs();
    configs.push(config);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export function updateConfig(config: TOTPConfig): void {
    const configs = loadConfigs();
    const index = configs.findIndex((c) => c.id === config.id);
    if (index !== -1) {
        configs[index] = config;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    }
}

export function deleteConfig(id: string): void {
    const configs = loadConfigs().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}
