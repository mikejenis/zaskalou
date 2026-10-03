import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Za Skálou",
  description: "Ověřené koncerty a vystoupení spojené s Františkem Skálou."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
