

import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";

export const metadata: Metadata = {
  title: "Login NASA Panel",
  description: "Login to your account",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
