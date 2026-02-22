"use client";

import { useLanguageStore } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  Trophy,
  Users,
  UserPlus,
  Hash,
  Shuffle,
  Bell,
  Sparkles,
  Phone,
  Shield,
  Globe,
} from "lucide-react";

export default function DocsPage() {
  const { t, language } = useLanguageStore();

  const docs = {
    en: {
      title: "Documentation",
      subtitle: "Learn how to use Kela Organizer",
      sections: [
        {
          icon: Trophy,
          title: "Getting Started",
          content: `Welcome to Kela Organizer! This app helps you organize tournaments easily. Here's how to get started:

1. **Login with Phone**: Enter your phone number and verify with OTP
2. **Create Tournament**: Go to "Create Tournament" and fill in the details
3. **Share Code**: Share the unique 6-character code with players
4. **Manage Everything**: Add teams, players, and announcements`,
        },
        {
          icon: Phone,
          title: "Login & Registration",
          content: `**How to Login:**
1. Enter your phone number (e.g., +880 1712345678)
2. Click "Next" to receive OTP
3. Enter the 6-digit OTP code
4. If you're new, enter your name
5. You're logged in!

**Note:** For demo, the OTP is shown on screen. In production, it would be sent via SMS.`,
        },
        {
          icon: Trophy,
          title: "Creating a Tournament",
          content: `**Steps to Create:**
1. Click "Create Tournament" from dashboard
2. Enter tournament name (e.g., "Cricket League 2026")
3. Add description (optional)
4. Set start and end dates (optional)
5. Set maximum players (optional)
6. Click "Create Tournament"

You'll receive a unique 6-character code (like "ABC123") to share with players.`,
        },
        {
          icon: Hash,
          title: "Joining a Tournament",
          content: `**How to Join:**
1. Get the tournament code from the organizer
2. Go to "Join Tournament" from dashboard
3. Enter the 6-character code
4. Click "Join"

You're now a player in that tournament!`,
        },
        {
          icon: Users,
          title: "Managing Players",
          content: `**As an Admin:**
- View all players in the "Players" tab
- Assign categories to players (Batsman, Bowler, etc.)
- Remove players if needed
- Search for specific players

**Player Categories:**
Categories help in creating balanced teams. You can set minimum players from each category per team.`,
        },
        {
          icon: Shuffle,
          title: "Creating Teams",
          content: `**Manual Team Creation:**
1. Go to "Teams" tab
2. Click "Create Team"
3. Enter team name
4. Select players to add
5. Save the team

**Random Team Distribution:**
1. Click "Random Teams"
2. Choose number of teams
3. Enable "Use Categories" for balanced distribution
4. Click "Generate"

The system will automatically distribute players fairly across teams.`,
        },
        {
          icon: Shield,
          title: "Admin Management",
          content: `**Adding Admins:**
1. Go to "Settings" tab
2. Click "Add Admin"
3. Select a player to make admin
4. They can now help manage the tournament

**Admin Permissions:**
- Create and delete teams
- Add/remove players
- Post announcements
- Generate logo
- Manage categories`,
        },
        {
          icon: Bell,
          title: "Announcements",
          content: `**Posting Announcements:**
1. Go to "Announcements" tab
2. Click "Create Announcement"
3. Enter title and content
4. Choose type (Announcement/News/Update)
5. Pin important ones to top

All players will see announcements when they visit the tournament page.`,
        },
        {
          icon: Sparkles,
          title: "AI Logo Generation",
          content: `**Generate a Logo:**
1. Go to "Settings" tab
2. Find "AI Logo Generator" section
3. Enter a prompt describing your logo
4. Click "Generate"
5. If you like it, click "Use This Logo"

**Tips for Good Prompts:**
- "Modern cricket tournament logo with bat and ball"
- "Football league emblem with flames"
- "Minimalist sports trophy icon"

**Note:** Requires Gemini API key in environment variables.`,
        },
        {
          icon: Globe,
          title: "Language Support",
          content: `**Switching Languages:**
- Click the language toggle (🌐) in the sidebar
- Choose between English and বাংলা
- The entire app will switch languages

The app fully supports both English and Bangla for all features.`,
        },
      ],
    },
    bn: {
      title: "ডকুমেন্টেশন",
      subtitle: "কেলা অর্গানাইজার কীভাবে ব্যবহার করবেন শিখুন",
      sections: [
        {
          icon: Trophy,
          title: "শুরু করুন",
          content: `কেলা অর্গানাইজারে স্বাগতম! এই অ্যাপ আপনাকে সহজে টুর্নামেন্ট আয়োজন করতে সাহায্য করে। শুরু করতে:

১. **ফোন দিয়ে লগইন**: আপনার ফোন নম্বর দিন এবং OTP দিয়ে ভেরিফাই করুন
২. **টুর্নামেন্ট তৈরি**: "টুর্নামেন্ট তৈরি করুন" এ যান এবং বিস্তারিত পূরণ করুন
৩. **কোড শেয়ার করুন**: ৬-অক্ষরের ইউনিক কোড খেলোয়াড়দের সাথে শেয়ার করুন
৪. **সব ম্যানেজ করুন**: দল, খেলোয়াড় এবং ঘোষণা যোগ করুন`,
        },
        {
          icon: Phone,
          title: "লগইন ও রেজিস্ট্রেশন",
          content: `**কীভাবে লগইন করবেন:**
১. আপনার ফোন নম্বর দিন (যেমন, +৮৮০ ১৭১২৩৪৫৬৭৮)
২. OTP পেতে "পরবর্তী" ক্লিক করুন
৩. ৬-সংখ্যার OTP কোড দিন
৪. নতুন হলে, আপনার নাম দিন
৫. লগইন সম্পন্ন!

**নোট:** ডেমোতে, OTP স্ক্রিনে দেখানো হয়। প্রোডাকশনে, এটি SMS এর মাধ্যমে পাঠানো হবে।`,
        },
        {
          icon: Trophy,
          title: "টুর্নামেন্ট তৈরি করা",
          content: `**তৈরির ধাপ:**
১. ড্যাশবোর্ড থেকে "টুর্নামেন্ট তৈরি করুন" ক্লিক করুন
২. টুর্নামেন্টের নাম দিন (যেমন, "ক্রিকেট লিগ ২০২৬")
৩. বর্ণনা যোগ করুন (ঐচ্ছিক)
৪. শুরু ও শেষের তারিখ দিন (ঐচ্ছিক)
৫. সর্বোচ্চ খেলোয়াড় সংখ্যা দিন (ঐচ্ছিক)
৬. "টুর্নামেন্ট তৈরি করুন" ক্লিক করুন

আপনি একটি ৬-অক্ষরের ইউনিক কোড পাবেন (যেমন "ABC123") খেলোয়াড়দের সাথে শেয়ার করতে।`,
        },
        {
          icon: Hash,
          title: "টুর্নামেন্টে যোগদান",
          content: `**কীভাবে যোগদান করবেন:**
১. আয়োজকের কাছ থেকে টুর্নামেন্ট কোড নিন
২. ড্যাশবোর্ড থেকে "টুর্নামেন্টে যোগদান" এ যান
৩. ৬-অক্ষরের কোড দিন
৪. "যোগদান" ক্লিক করুন

আপনি এখন সেই টুর্নামেন্টের একজন খেলোয়াড়!`,
        },
        {
          icon: Users,
          title: "খেলোয়াড় ব্যবস্থাপনা",
          content: `**অ্যাডমিন হিসেবে:**
- "খেলোয়াড়" ট্যাবে সব খেলোয়াড় দেখুন
- খেলোয়াড়দের ক্যাটাগরি দিন (ব্যাটসম্যান, বোলার, ইত্যাদি)
- প্রয়োজনে খেলোয়াড় সরান
- নির্দিষ্ট খেলোয়াড় খুঁজুন

**খেলোয়াড় ক্যাটাগরি:**
ক্যাটাগরি সুষম দল তৈরিতে সাহায্য করে। আপনি প্রতি দলে প্রতিটি ক্যাটাগরি থেকে ন্যূনতম খেলোয়াড় সংখ্যা নির্ধারণ করতে পারেন।`,
        },
        {
          icon: Shuffle,
          title: "দল তৈরি করা",
          content: `**ম্যানুয়াল দল তৈরি:**
১. "দল" ট্যাবে যান
২. "দল তৈরি করুন" ক্লিক করুন
৩. দলের নাম দিন
৪. যোগ করতে খেলোয়াড় নির্বাচন করুন
৫. দল সেভ করুন

**র‍্যান্ডম দল বিতরণ:**
১. "র‍্যান্ডম দল" ক্লিক করুন
২. দলের সংখ্যা বেছে নিন
৩. সুষম বিতরণের জন্য "ক্যাটাগরি ব্যবহার করুন" চালু করুন
৪. "জেনারেট" ক্লিক করুন

সিস্টেম স্বয়ংক্রিয়ভাবে খেলোয়াড়দের দলে সুষমভাবে বিতরণ করবে।`,
        },
        {
          icon: Shield,
          title: "অ্যাডমিন ব্যবস্থাপনা",
          content: `**অ্যাডমিন যোগ করা:**
১. "সেটিংস" ট্যাবে যান
২. "অ্যাডমিন যোগ করুন" ক্লিক করুন
৩. অ্যাডমিন করতে একজন খেলোয়াড় নির্বাচন করুন
৪. তারা এখন টুর্নামেন্ট ম্যানেজ করতে সাহায্য করতে পারবে

**অ্যাডমিন অনুমতি:**
- দল তৈরি ও মুছে ফেলা
- খেলোয়াড় যোগ/সরানো
- ঘোষণা পোস্ট করা
- লোগো জেনারেট করা
- ক্যাটাগরি ম্যানেজ করা`,
        },
        {
          icon: Bell,
          title: "ঘোষণা",
          content: `**ঘোষণা পোস্ট করা:**
১. "ঘোষণা" ট্যাবে যান
২. "ঘোষণা তৈরি করুন" ক্লিক করুন
৩. শিরোনাম ও বিষয়বস্তু লিখুন
৪. ধরন বেছে নিন (ঘোষণা/খবর/আপডেট)
৫. গুরুত্বপূর্ণগুলো উপরে পিন করুন

সব খেলোয়াড় টুর্নামেন্ট পেজে ঘোষণা দেখতে পাবে।`,
        },
        {
          icon: Sparkles,
          title: "AI লোগো জেনারেশন",
          content: `**লোগো জেনারেট করুন:**
১. "সেটিংস" ট্যাবে যান
২. "AI লোগো জেনারেটর" সেকশন খুঁজুন
৩. আপনার লোগো বর্ণনা করে একটি প্রম্পট দিন
৪. "জেনারেট" ক্লিক করুন
৫. পছন্দ হলে, "এই লোগো ব্যবহার করুন" ক্লিক করুন

**ভালো প্রম্পটের টিপস:**
- "ব্যাট ও বল সহ আধুনিক ক্রিকেট টুর্নামেন্ট লোগো"
- "আগুনের সাথে ফুটবল লিগ প্রতীক"
- "মিনিমালিস্ট স্পোর্টস ট্রফি আইকন"

**নোট:** এনভায়রনমেন্ট ভেরিয়েবলে Gemini API কী প্রয়োজন।`,
        },
        {
          icon: Globe,
          title: "ভাষা সাপোর্ট",
          content: `**ভাষা পরিবর্তন:**
- সাইডবারে ভাষা টগল (🌐) ক্লিক করুন
- English এবং বাংলার মধ্যে বেছে নিন
- পুরো অ্যাপ ভাষা পরিবর্তন করবে

অ্যাপটি সব ফিচারের জন্য সম্পূর্ণরূপে ইংরেজি ও বাংলা সাপোর্ট করে।`,
        },
      ],
    },
  };

  const currentDocs = docs[language];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentDocs.title}
        </h1>
        <p className="text-gray-500">{currentDocs.subtitle}</p>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-6">
        {currentDocs.sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                {section.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-gray-900">
                      {part}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {language === "en" ? "💡 Quick Tips" : "💡 দ্রুত টিপস"}
          </h3>
          <ul className="space-y-2 text-gray-600">
            {language === "en" ? (
              <>
                <li>• Use the search bar to quickly find players</li>
                <li>• Pin important announcements to keep them visible</li>
                <li>• Create categories before generating random teams</li>
                <li>• Share the tournament code via WhatsApp or SMS</li>
                <li>• Add multiple admins to help manage large tournaments</li>
              </>
            ) : (
              <>
                <li>• দ্রুত খেলোয়াড় খুঁজতে সার্চ বার ব্যবহার করুন</li>
                <li>• গুরুত্বপূর্ণ ঘোষণা পিন করে রাখুন</li>
                <li>• র‍্যান্ডম দল তৈরির আগে ক্যাটাগরি তৈরি করুন</li>
                <li>• WhatsApp বা SMS এর মাধ্যমে টুর্নামেন্ট কোড শেয়ার করুন</li>
                <li>• বড় টুর্নামেন্ট ম্যানেজ করতে একাধিক অ্যাডমিন যোগ করুন</li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
