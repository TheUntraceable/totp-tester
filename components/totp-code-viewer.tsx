"use client";

import { Card } from "@heroui/react";
import { useEffect, useState } from "react";
import { computeCode } from "@/lib/totp";
import type { TOTPConfig } from "@/lib/types";

interface TOTPCodeViewerProps {
    config: TOTPConfig;
}

export function TOTPCodeViewer({ config }: TOTPCodeViewerProps) {
    const [code, setCode] = useState("");
    const [remaining, setRemaining] = useState(config.period);

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

    return (
        <Card>
            <Card.Header>
                <div className="flex items-center justify-between w-full">
                    <Card.Title className="text-xs font-semibold tracking-widest uppercase text-muted">
                        Live Code
                    </Card.Title>
                    <span className="font-mono text-[11px] tabular-nums text-muted">
                        {config.algorithm} / {config.digits}d / {config.period}s
                    </span>
                </div>
            </Card.Header>
            <Card.Content>
                <div className="text-center py-4 space-y-5">
                    {/* The TOTP code — hero element */}
                    <p
                        className={`totp-code font-mono text-5xl font-bold tracking-[0.25em] tabular-nums transition-colors duration-300 ${isUrgent ? "text-danger" : "text-accent"}`}
                    >
                        {code || "------"}
                    </p>

                    {/* Countdown bar */}
                    <div className="space-y-2">
                        <div className="totp-progress-track h-1.5 rounded-full overflow-hidden mx-auto max-w-[200px]">
                            <div
                                className="totp-progress-fill h-full rounded-full"
                                data-urgent={isUrgent}
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                        <p
                            className={`font-mono text-xs tabular-nums transition-colors duration-300 ${isUrgent ? "text-danger" : "text-muted"}`}
                        >
                            {remaining}s remaining
                        </p>
                    </div>
                </div>
            </Card.Content>
        </Card>
    );
}
