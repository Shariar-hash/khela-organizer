"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { useLanguageStore } from "@/lib/i18n";
import { LanguageToggle } from "@/components/layout";
import { Trophy, Phone, User, ArrowRight, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguageStore();
  const [step, setStep] = useState<"phone" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!phone) {
      setError(t.auth.phoneRequired);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, action: "login" }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.requiresName) {
          setStep("name");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        setError(data.error || t.common.error);
      }
    } catch {
      setError(t.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name) {
      setError(t.auth.nameRequired);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, action: "login" }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || t.common.error);
      }
    } catch {
      setError(t.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Khela Organizer</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {t.nav.docs}
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t.auth.loginTitle}
              </h1>
              <p className="text-gray-500 mt-2">
                {t.auth.loginSubtitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Phone Step */}
            {step === "phone" && (
              <div className="space-y-4">
                <Input
                  label={t.auth.phoneNumber}
                  type="tel"
                  placeholder="01XXX-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone size={20} />}
                />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleLogin}
                  loading={loading}
                >
                  {t.common.login}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Name Step (for new users) */}
            {step === "name" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center mb-2">
                  {t.auth.newUser} {t.auth.signupSubtitle}
                </p>
                <Input
                  label={t.auth.playerName}
                  type="text"
                  placeholder={t.auth.playerName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User size={20} />}
                />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSignup}
                  loading={loading}
                >
                  {t.common.signup}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <button
                  onClick={() => setStep("phone")}
                  className="w-full text-sm text-primary-600 hover:text-primary-700"
                >
                  ← {t.common.back}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        © 2026 Khela Organizer. All rights reserved.
      </footer>
    </div>
  );
}
