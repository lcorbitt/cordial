import type { Metadata } from "next";
import { DM_Sans, Libre_Caslon_Text } from "next/font/google";

import { BODY_CLASS, SKIP_LINK_CLASS } from "@/app/root/constants";
import { PRODUCT_NAME } from "@/config/brand";
import { Providers } from "@/components/providers";
import { Hosts } from "@/hosts";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: PRODUCT_NAME,
  description: "A community platform for thoughtful people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${libreCaslon.variable} ${BODY_CLASS}`}
      >
        <a href="#main-content" className={SKIP_LINK_CLASS}>
          Skip to main content
        </a>
        <Providers>
          {children}
          <Hosts />
        </Providers>
      </body>
    </html>
  );
}
