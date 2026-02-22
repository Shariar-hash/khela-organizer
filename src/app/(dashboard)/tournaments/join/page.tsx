"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/lib/i18n";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { Hash, ArrowLeft, Check } from "lucide-react";

export default function JoinTournamentPage() {
  const router = useRouter();
  const { t } = useLanguageStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setError(t.errors.required);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tournaments/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/tournaments/${data.tournament.id}`);
      } else {
        setError(data.error || t.tournament.invalidCode);
      }
    } catch {
      setError(t.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.common.back}
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {t.tournament.join}
        </h1>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t.tournament.enterCode}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {t.tournament.joinWithCode}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t.tournament.code}
                placeholder="XXXXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={10}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                <Check className="w-5 h-5 mr-2" />
                {t.tournament.join}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
