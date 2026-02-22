import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-sans-bengali",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Khela Organizer - খেলা অর্গানাইজার",
  description: "Organize and manage tournaments with ease. Support for English and Bangla. সহজে টুর্নামেন্ট আয়োজন ও পরিচালনা করুন।",
  keywords: ["tournament", "sports", "cricket", "organizer", "team management", "khela", "bangla"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
