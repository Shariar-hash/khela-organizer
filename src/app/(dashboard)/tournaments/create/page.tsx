"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { Trophy, ArrowLeft, Calendar, Users, Check } from "lucide-react";

export default function CreateTournamentPage() {
  const router = useRouter();
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdTournament, setCreatedTournament] = useState<{
    id: string;
    code: string;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    maxPlayers: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      setError(t.errors.required);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          maxPlayers: formData.maxPlayers ? parseInt(formData.maxPlayers) : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setCreatedTournament(data.tournament);
      } else {
        setError(data.error || t.common.error);
      }
    } catch {
      setError(t.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (createdTournament) {
      navigator.clipboard.writeText(createdTournament.code);
    }
  };

  if (success && createdTournament) {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.tournament.created}
            </h2>
            <p className="text-gray-500 mb-6">{createdTournament.name}</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">{t.tournament.code}</p>
              <p className="text-3xl font-mono font-bold text-primary-600 tracking-wider">
                {createdTournament.code}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={copyCode} variant="outline" className="flex-1">
                {t.tournament.copyCode}
              </Button>
              <Link href={`/tournaments/${createdTournament.id}`} className="flex-1">
                <Button className="w-full">
                  {t.tournament.viewTournament}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {t.tournament.create}
        </h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              {t.tournament.tournamentDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t.tournament.name}
                placeholder={t.tournament.name}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                leftIcon={<Trophy size={20} />}
              />

              <Textarea
                label={t.tournament.description}
                placeholder={t.tournament.description}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t.tournament.startDate}
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  leftIcon={<Calendar size={20} />}
                />

                <Input
                  label={t.tournament.endDate}
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  leftIcon={<Calendar size={20} />}
                />
              </div>

              <Input
                label={t.tournament.maxPlayers}
                type="number"
                placeholder="50"
                value={formData.maxPlayers}
                onChange={(e) =>
                  setFormData({ ...formData, maxPlayers: e.target.value })
                }
                leftIcon={<Users size={20} />}
                min="2"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                {t.common.create}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
