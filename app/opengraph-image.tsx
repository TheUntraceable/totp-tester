import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TOTP Tester";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    const iconData = await fetch(new URL("/icon.png", "http://localhost:3000"))
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
            const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
            return `data:image/png;base64,${base64}`;
        });

    return new ImageResponse(
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                background:
                    "linear-gradient(135deg, #0f1219 0%, #1a1f2e 50%, #0f1219 100%)",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                <img
                    src={iconData}
                    alt="TOTP Tester Icon"
                    width={120}
                    height={120}
                    style={{ borderRadius: 24 }}
                />
                <div
                    style={{
                        display: "flex",
                        fontSize: 64,
                        fontWeight: 800,
                        color: "white",
                        letterSpacing: "-0.02em",
                    }}
                >
                    TOTP Tester
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 24,
                        color: "#9ca3af",
                        maxWidth: 640,
                        textAlign: "center",
                        lineHeight: 1.5,
                    }}
                >
                    Configure, generate, and test TOTP implementations locally.
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 16,
                        padding: "10px 24px",
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.05)",
                        fontSize: 16,
                        color: "#60a5fa",
                        fontWeight: 600,
                    }}
                >
                    🔐 All secrets stay in your browser
                </div>
            </div>
        </div>,
        { ...size },
    );
}
