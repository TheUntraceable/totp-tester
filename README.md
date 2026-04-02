# TOTP Tester

A developer tool for configuring, generating, and verifying Time-based One-Time Passwords (TOTP). Built for testing authentication implementations.

## What It Does

- **Create TOTP configurations** with custom issuer, label, secret, algorithm (SHA1/SHA256/SHA512), digits (6 or 8), and period
- **Generate live TOTP codes** with a countdown timer showing remaining validity
- **Display QR codes** for scanning into authenticator apps
- **Parse `otpauth://` URIs** to import existing configurations
- **Save configurations** locally in the browser for reuse
- **Auto-generate random secrets** for quick testing

All data stays in your browser — nothing leaves the device.

## Tech Stack

- **Next.js 16** with Turbopack
- **React 19**
- **HeroUI v3** components
- **TailwindCSS v4**
- **otpauth** library for TOTP computation
- **qrcode** for QR code generation
- **Biome** for linting and formatting

## Getting Started

Install dependencies:

```bash
bun install
# or
npm install
```

Run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.
