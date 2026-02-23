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
  title: {
    default: "Khela Organizer - Tournament Management App | খেলা অর্গানাইজার",
    template: "%s | Khela Organizer",
  },
  description: "Khela Organizer is the ultimate free tournament management platform. Create cricket tournaments, organize teams, manage players with random team distribution. Support for English and Bangla. সহজে টুর্নামেন্ট আয়োজন ও পরিচালনা করুন।",
  keywords: [
    "tournament organizer",
    "cricket tournament app",
    "team management software",
    "sports tournament manager",
    "khela organizer",
    "খেলা অর্গানাইজার",
    "tournament management",
    "random team generator",
    "player management",
    "cricket team maker",
    "free tournament app",
    "bangla tournament app",
    "bd cricket",
    "bangladesh cricket tournament",
  ],
  authors: [{ name: "Montasir Mogumder Shariar", url: "https://montasir-mogumder-shariar.vercel.app/" }],
  creator: "Montasir Mogumder Shariar",
  publisher: "Khela Organizer",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://khela-organizer.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "bn": "/bn",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
    url: "/",
    siteName: "Khela Organizer",
    title: "Khela Organizer - Free Tournament Management App",
    description: "Create and manage cricket tournaments effortlessly. Random team distribution, player categories, announcements, and more. Works in English and Bangla.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khela Organizer - Tournament Management App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khela Organizer - Free Tournament Management App",
    description: "Create and manage cricket tournaments effortlessly. Random team distribution, player categories, announcements, and more.",
    images: ["/og-image.png"],
    creator: "@shariar_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "Sports & Recreation",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Khela Organizer",
    "alternateName": "খেলা অর্গানাইজার",
    "description": "Free tournament management platform for cricket and sports. Create tournaments, manage teams and players.",
    "url": "https://khela-organizer.vercel.app",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Montasir Mogumder Shariar",
      "url": "https://montasir-mogumder-shariar.vercel.app/"
    },
    "inLanguage": ["en", "bn"]
  };

  return (
    <html lang="en" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
