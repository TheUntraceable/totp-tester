"use client";

import { Tabs } from "@heroui/react";
import { Shield } from "lucide-react";
import { useState } from "react";
import { QRDisplay } from "@/components/qr-display";
import { SavedConfigs } from "@/components/saved-configs";
import { TOTPCodeViewer } from "@/components/totp-code-viewer";
import { TOTPConfigForm } from "@/components/totp-config-form";
import { saveConfig } from "@/lib/storage";
import type { TOTPConfig } from "@/lib/types";

export default function Home() {
    const [activeConfig, setActiveConfig] = useState<TOTPConfig | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeTab, setActiveTab] = useState("create");

    function handleConfigSubmit(config: TOTPConfig) {
        setActiveConfig(config);
        setIsSaved(false);
    }

    function handleSave() {
        if (activeConfig) {
            saveConfig(activeConfig);
            setIsSaved(true);
            setRefreshKey((k) => k + 1);
        }
    }

    function handleEdit(config: TOTPConfig) {
        setActiveConfig(config);
        setIsSaved(true);
        setActiveTab("create");
    }

    function handleNew() {
        setActiveConfig(null);
        setIsSaved(false);
    }

    return (
        <div className="min-h-screen px-4 py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-3xl">
                {/* Hero */}
                <div
                    className="text-center mb-10 animate-fade-up"
                    style={{ animationDelay: "0ms" }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent tracking-wide uppercase mb-5">
                        <Shield size={13} />
                        TOTP Toolkit
                    </div>
                    <h1 className="hero-title text-5xl md:text-6xl font-bold tracking-tight leading-none mb-3">
                        TOTP Tester
                    </h1>
                    <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
                        Configure, generate, and verify time-based one-time
                        passwords. Built for developers testing auth
                        implementations.
                    </p>
                </div>

                {/* Tabs */}
                <div
                    className="animate-fade-up"
                    style={{ animationDelay: "100ms" }}
                >
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={(k) => setActiveTab(String(k))}
                    >
                        <Tabs.ListContainer>
                            <Tabs.List aria-label="Sections">
                                <Tabs.Tab id="create">
                                    Create New
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="saved">
                                    Saved Configs
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>

                        <Tabs.Panel id="create">
                            <div
                                className="space-y-6 pt-2 animate-fade-up"
                                style={{ animationDelay: "150ms" }}
                            >
                                {!activeConfig ? (
                                    <TOTPConfigForm
                                        onSubmit={handleConfigSubmit}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <QRDisplay
                                                config={activeConfig}
                                                onSave={handleSave}
                                                isSaved={isSaved}
                                            />
                                            <TOTPCodeViewer
                                                config={activeConfig}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNew}
                                            className="text-xs text-accent/70 hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30"
                                        >
                                            Create another configuration
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel id="saved">
                            <div
                                className="pt-2 animate-fade-up"
                                style={{ animationDelay: "150ms" }}
                            >
                                <SavedConfigs
                                    onEdit={handleEdit}
                                    refreshKey={refreshKey}
                                />
                            </div>
                        </Tabs.Panel>
                    </Tabs>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <p className="text-[10px] tracking-widest uppercase text-muted/50">
                        All secrets stay in your browser. Nothing leaves this
                        device.
                    </p>
                </div>
            </div>
        </div>
    );
}
