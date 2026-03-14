import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Trophy, Users, Shuffle, Bell, Sparkles, Shield, Globe, ArrowRight } from "lucide-react";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Khela Organizer</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-200">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Khela Organizer
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-2 font-medium">
            খেলা অর্গানাইজার — Tournament Management Made Easy
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            The free tournament management app for cricket and sports. Create tournaments, manage teams and players,
            distribute players randomly into balanced teams, and keep everyone updated with announcements.
            Works in <strong>English</strong> and <strong>বাংলা</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-700 rounded-xl font-semibold text-lg border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
            >
              Read Documentation
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-4 pb-16 sm:pb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Everything You Need to Organize Tournaments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Trophy,
                title: "Create Tournaments",
                desc: "Set up cricket tournaments in seconds. Share a unique 6-character code with players to join.",
              },
              {
                icon: Users,
                title: "Manage Players",
                desc: "Add players, assign categories like Batsman or Bowler, and organize your roster with ease.",
              },
              {
                icon: Shuffle,
                title: "Random Team Distribution",
                desc: "Automatically generate balanced teams with category-aware random distribution.",
              },
              {
                icon: Bell,
                title: "Announcements",
                desc: "Post updates, pin important announcements, and keep all players informed in real time.",
              },
              {
                icon: Sparkles,
                title: "AI Logo Generation",
                desc: "Generate a unique tournament logo with AI. Just describe what you want and it's created.",
              },
              {
                icon: Globe,
                title: "Bilingual Support",
                desc: "Full support for English and বাংলা (Bangla). Switch languages with one click.",
              },
            ].map((feature, i) => (
              <article
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white border-y border-gray-100 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
              How Khela Organizer Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Create a Tournament", desc: "Enter your tournament name and details. You'll get a unique code to share." },
                { step: "2", title: "Players Join", desc: "Share the 6-character code. Players enter it to join your tournament instantly." },
                { step: "3", title: "Manage & Play", desc: "Create teams, post announcements, generate logos, and run your tournament." },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Ready to Organize Your Tournament?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join Khela Organizer today — it&apos;s completely free. No credit card, no sign-up hassle. Just your phone number.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg shadow-primary-200"
          >
            Start Organizing Now
            <Trophy className="w-5 h-5" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500 border-t bg-white/80">
        <p>© 2026 Khela Organizer (খেলা অর্গানাইজার). All rights reserved.</p>
        <p className="mt-1">
          Free tournament management for cricket and sports in Bangladesh and beyond.
        </p>
        <p className="mt-1">
          Built with ❤️ by{" "}
          <a
            href="https://montasir-mogumder-shariar.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Montasir Mogumder Shariar
          </a>
        </p>
      </footer>
    </div>
  );
}
