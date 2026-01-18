import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { WidgetProvider } from "@/context/WidgetContext";
import { Toaster } from "sonner";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard by Karthik | Time, Weather & Productivity Widgets",
  description: "A minimalist personal dashboard featuring world clocks, weather updates, and a Pomodoro timer. Track time across Melbourne, Chennai, Berlin, and Dubai with real-time weather data.",
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/icons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hankenGrotesk.variable} font-sans antialiased`}
      >
        <WidgetProvider>{children}</WidgetProvider>
        <Toaster />
      </body>
    </html>
  );
}
