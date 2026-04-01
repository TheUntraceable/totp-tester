import QRCode from "qrcode";

export async function generateQrSvg(uri: string): Promise<string> {
    return QRCode.toString(uri, {
        type: "svg",
        margin: 2,
        width: 256,
        color: {
            dark: "#000000",
            light: "#ffffff",
        },
    });
}
