"use client";

import { Button, Card, Chip } from "@heroui/react";
import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { computeCode } from "@/lib/totp";
import type { TOTPConfig } from "@/lib/types";

interface ConfigCardProps {
    config: TOTPConfig;
    onEdit: (config: TOTPConfig) => void;
    onDelete: (config: TOTPConfig) => void;
}

export function ConfigCard({ config, onEdit, onDelete }: ConfigCardProps) {
    const [code, setCode] = useState("");
    const [remaining, setRemaining] = useState(config.period);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        function tick() {
            const result = computeCode(config);
            setCode(result.code);
            setRemaining(result.remaining);
        }

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [config]);

    const progress = remaining / config.period;
    const isUrgent = remaining <= 5;

    async function handleCopy() {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Card className="group">
            <Card.Header>
                <div className="flex items-start justify-between w-full">
                    <div className="space-y-0.5 min-w-0">
                        <Card.Title className="text-sm font-semibold truncate">
                            {config.issuer || "No issuer"}
                        </Card.Title>
                        <Card.Description className="text-xs truncate">
                            {config.label || "No account"}
                        </Card.Description>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-2">
                        <Chip size="sm" variant="soft">
                            {config.algorithm}
                        </Chip>
                    </div>
                </div>
            </Card.Header>

            <Card.Content>
                <div className="text-center space-y-3">
                    <p
                        className={`totp-code font-mono text-3xl font-bold tracking-[0.2em] tabular-nums transition-colors duration-300 ${isUrgent ? "text-danger" : "text-accent"}`}
                    >
                        {code || "------"}
                    </p>
                    <div className="flex items-center justify-center gap-2.5">
                        <div className="totp-progress-track w-24 h-1 rounded-full overflow-hidden">
                            <div
                                className="totp-progress-fill h-full rounded-full"
                                data-urgent={isUrgent}
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                        <span
                            className={`font-mono text-[11px] tabular-nums w-6 text-right transition-colors duration-300 ${isUrgent ? "text-danger" : "text-muted"}`}
                        >
                            {remaining}s
                        </span>
                    </div>
                </div>
            </Card.Content>

            <Card.Footer>
                <div className="flex gap-1.5 w-full">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onPress={handleCopy}
                    >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        isIconOnly
                        onPress={() => onEdit(config)}
                        aria-label="Edit config"
                    >
                        <Pencil size={13} />
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        isIconOnly
                        onPress={() => onDelete(config)}
                        aria-label="Delete config"
                    >
                        <Trash2 size={13} />
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}
