import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MyWellness - Mental Well-Being Monitoring",
  description: "A confidential self-assessment tool for FUTA students to track depression, anxiety, and stress levels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Adobe Fonts — Acumin Pro. Replace YOUR_KIT_ID with your Typekit kit ID from fonts.adobe.com */}
        <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster theme="light" richColors position="top-right" />
      </body>
    </html>
  );
}
