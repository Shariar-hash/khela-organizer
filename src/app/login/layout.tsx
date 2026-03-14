import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Khela Organizer | Free Tournament Management App",
  description:
    "Login to Khela Organizer to create and manage cricket tournaments. Free tournament management app with random team distribution, player categories, and bilingual support. খেলা অর্গানাইজারে লগইন করুন।",
  keywords: [
    "khela organizer login",
    "tournament app login",
    "cricket tournament login",
    "খেলা অর্গানাইজার লগইন",
  ],
  openGraph: {
    title: "Login - Khela Organizer",
    description:
      "Login to create and manage cricket tournaments for free. Random team distribution, player management, and more.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
