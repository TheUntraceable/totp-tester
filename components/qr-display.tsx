"use client";

import { Button, Card } from "@heroui/react";
import { Check, Copy, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { generateQrSvg } from "@/lib/qrcode";
import { buildOtpauthUri } from "@/lib/totp";
import type { TOTPConfig } from "@/lib/types";

interface QRDisplayProps {
    config: TOTPConfig;
    onSave: () => void;
    isSaved: boolean;
}

export function QRDisplay({ config, onSave, isSaved }: QRDisplayProps) {
    const [svg, setSvg] = useState("");
    const [copied, setCopied] = useState(false);
    const uri = buildOtpauthUri(config);

    useEffect(() => {
        generateQrSvg(uri).then(setSvg);
    }, [uri]);

    async function handleCopy() {
        await navigator.clipboard.writeText(uri);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title className="text-xs font-semibold tracking-widest uppercase text-muted">
                    QR Code
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <div
                    className="qr-container flex justify-center mb-4"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />

                <div className="space-y-2">
                    <p className="text-[10px] tracking-wider uppercase text-muted/60 font-semibold">
                        otpauth URI
                    </p>
                    <div className="flex gap-2 items-start">
                        <code className="code-block flex-1">{uri}</code>
                        <Button
                            variant="outline"
                            isIconOnly
                            size="sm"
                            onPress={handleCopy}
                            aria-label="Copy URI"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                    </div>
                </div>
            </Card.Content>
            {!isSaved && (
                <Card.Footer>
                    <Button fullWidth onPress={onSave}>
                        <Save size={15} />
                        Save Configuration
                    </Button>
                </Card.Footer>
            )}
        </Card>
    );
}
