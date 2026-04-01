"use client";

import { Button, Card, Modal, useOverlayState } from "@heroui/react";
import { AlertTriangle, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteConfig, loadConfigs } from "@/lib/storage";
import type { TOTPConfig } from "@/lib/types";
import { ConfigCard } from "./config-card";

interface SavedConfigsProps {
    onEdit: (config: TOTPConfig) => void;
    refreshKey: number;
}

export function SavedConfigs({ onEdit, refreshKey }: SavedConfigsProps) {
    const [configs, setConfigs] = useState<TOTPConfig[]>([]);
    const [toDelete, setToDelete] = useState<TOTPConfig | null>(null);
    const deleteModal = useOverlayState();

    useEffect(() => {
        setConfigs(loadConfigs());
    }, [refreshKey]);

    function handleDeleteRequest(config: TOTPConfig) {
        setToDelete(config);
        deleteModal.open();
    }

    function handleConfirmDelete() {
        if (toDelete) {
            deleteConfig(toDelete.id);
            setConfigs(loadConfigs());
        }
        setToDelete(null);
        deleteModal.close();
    }

    if (configs.length === 0) {
        return (
            <Card>
                <Card.Content>
                    <div className="py-10 text-center space-y-3">
                        <Inbox
                            size={32}
                            className="mx-auto text-muted/40"
                            strokeWidth={1.5}
                        />
                        <div>
                            <p className="text-sm font-medium text-muted/80">
                                No saved configurations
                            </p>
                            <p className="text-xs text-muted/50 mt-1">
                                Create a TOTP config and save it to see it here.
                            </p>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                {configs.map((config, i) => (
                    <div
                        key={config.id}
                        className="animate-fade-up"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <ConfigCard
                            config={config}
                            onEdit={onEdit}
                            onDelete={handleDeleteRequest}
                        />
                    </div>
                ))}
            </div>

            <Modal.Backdrop
                variant="opaque"
                isOpen={deleteModal.isOpen}
                onOpenChange={deleteModal.setOpen}
            >
                <Modal.Container size="sm">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading className="flex items-center gap-2">
                                <AlertTriangle
                                    size={18}
                                    className="text-danger"
                                />
                                Delete Configuration
                            </Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-sm">
                                Delete the configuration for{" "}
                                <strong className="text-foreground">
                                    {toDelete?.issuer || "No issuer"} /{" "}
                                    {toDelete?.label || "No account"}
                                </strong>
                                ?
                            </p>
                            <p className="text-xs text-muted mt-2">
                                This cannot be undone.
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline" slot="close">
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onPress={handleConfirmDelete}
                            >
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </>
    );
}
