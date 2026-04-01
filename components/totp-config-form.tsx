"use client";

import {
    Button,
    Card,
    Input,
    Label,
    ListBox,
    Select,
    TextField,
} from "@heroui/react";
import { RefreshCw, Zap } from "lucide-react";
import { useState } from "react";
import { generateSecret } from "@/lib/totp";
import type { TOTPConfig } from "@/lib/types";

interface TOTPConfigFormProps {
    onSubmit: (config: TOTPConfig) => void;
    initialConfig?: TOTPConfig;
}

export function TOTPConfigForm({
    onSubmit,
    initialConfig,
}: TOTPConfigFormProps) {
    const [issuer, setIssuer] = useState(initialConfig?.issuer ?? "");
    const [label, setLabel] = useState(initialConfig?.label ?? "");
    const [secret, setSecret] = useState(initialConfig?.secret ?? "");
    const [algorithm, setAlgorithm] = useState<TOTPConfig["algorithm"]>(
        initialConfig?.algorithm ?? "SHA1",
    );
    const [digits, setDigits] = useState<TOTPConfig["digits"]>(
        initialConfig?.digits ?? 6,
    );
    const [period, setPeriod] = useState(initialConfig?.period ?? 30);

    function handleGenerateSecret() {
        setSecret(generateSecret());
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!secret) return;

        onSubmit({
            id: initialConfig?.id ?? crypto.randomUUID(),
            issuer,
            label,
            secret,
            algorithm,
            digits,
            period,
            createdAt: initialConfig?.createdAt ?? Date.now(),
        });
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <Card.Content>
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <TextField
                                value={issuer}
                                onChange={(v) => setIssuer(String(v))}
                            >
                                <Label>Issuer</Label>
                                <Input placeholder="e.g. My App" />
                            </TextField>

                            <TextField
                                value={label}
                                onChange={(v) => setLabel(String(v))}
                            >
                                <Label>Account Name</Label>
                                <Input placeholder="e.g. user@example.com" />
                            </TextField>
                        </div>

                        <div className="space-y-2">
                            <Label>Secret (Base32)</Label>
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Base32 encoded secret"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    className="font-mono text-sm tracking-wider"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    isIconOnly
                                    size="lg"
                                    onPress={handleGenerateSecret}
                                    aria-label="Generate random secret"
                                >
                                    <RefreshCw size={16} />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-1.5">
                                <Label>Algorithm</Label>
                                <Select
                                    selectedKey={algorithm}
                                    onSelectionChange={(key) =>
                                        setAlgorithm(
                                            key as TOTPConfig["algorithm"],
                                        )
                                    }
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            <ListBox.Item id="SHA1">
                                                SHA1
                                            </ListBox.Item>
                                            <ListBox.Item id="SHA256">
                                                SHA256
                                            </ListBox.Item>
                                            <ListBox.Item id="SHA512">
                                                SHA512
                                            </ListBox.Item>
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Digits</Label>
                                <Select
                                    selectedKey={String(digits)}
                                    onSelectionChange={(key) =>
                                        setDigits(
                                            Number(key) as TOTPConfig["digits"],
                                        )
                                    }
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            <ListBox.Item id="6">
                                                6 digits
                                            </ListBox.Item>
                                            <ListBox.Item id="8">
                                                8 digits
                                            </ListBox.Item>
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            <TextField
                                value={String(period)}
                                onChange={(v) => setPeriod(Number(v) || 30)}
                            >
                                <Label>Period (sec)</Label>
                                <Input type="number" min={1} max={120} />
                            </TextField>
                        </div>
                    </div>
                </Card.Content>
                <Card.Footer className="mt-4">
                    <Button type="submit" fullWidth isDisabled={!secret}>
                        <Zap size={15} />
                        Generate
                    </Button>
                </Card.Footer>
            </form>
        </Card>
    );
}
