// import type { Metadata, Viewport } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import "./globals.css";
import "./theme-vercel.css";

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });
//: Viewport
export const viewport = {
        themeColor: "#1a2e1a",
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
};
// : Metadata
export const metadata = {
        title: "Fridge Tracker - Vegetable Shelf Life Manager",
        description: "Track your fridge vegetables, prioritize by shelf life, reduce food waste.",
        generator: "v0.app",
        icons: {
                icon: [
                        {
                                url: "/icon-light-32x32.png",
                                media: "(prefers-color-scheme: light)",
                        },
                        {
                                url: "/icon-dark-32x32.png",
                                media: "(prefers-color-scheme: dark)",
                        },
                        {
                                url: "/icon.svg",
                                type: "image/svg+xml",
                        },
                ],
                apple: "/apple-icon.png",
        },
};

import { LevaVisibility } from "@/components/leva-visibility";
import { ThemeRoot } from "@/components/theme-root";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        return (
                <ThemeRoot>
                        <LevaVisibility />
                        {children}
                        <Toaster />
                </ThemeRoot>
        );
}

// <html lang="en" className="dark">
//   <body className="font-sans antialiased">
//     {children}
//   </body>
// </html>
