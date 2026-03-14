import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - Khela Organizer | How to Use Guide",
  description:
    "Learn how to use Khela Organizer to create and manage cricket tournaments. Step-by-step guide for creating tournaments, managing teams and players, random team distribution, AI logo generation, and more. খেলা অর্গানাইজার ব্যবহারের নির্দেশিকা।",
  keywords: [
    "khela organizer documentation",
    "khela organizer guide",
    "tournament management guide",
    "cricket tournament help",
    "খেলা অর্গানাইজার ডকুমেন্টেশন",
  ],
  openGraph: {
    title: "Documentation - Khela Organizer",
    description:
      "Complete guide to using Khela Organizer for tournament management. Create tournaments, manage teams, and more.",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
