import type { Metadata, Viewport } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Za Skálou",
  description: "Ověřený přehled koncertů a živých vystoupení Františka Skály a jeho hudebních projektů."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
