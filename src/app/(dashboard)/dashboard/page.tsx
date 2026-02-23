"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguageStore, getTranslation } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  EmptyState,
  Loader,
} from "@/components/ui";
import {
  Trophy,
  Plus,
  Users,
  Calendar,
  ArrowRight,
  Hash,
} from "lucide-react";

type Translations = ReturnType<typeof getTranslation>;

interface Tournament {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(true);
  const [createdTournaments, setCreatedTournaments] = useState<Tournament[]>([]);
  const [joinedTournaments, setJoinedTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournaments");
      const data = await res.json();
      setCreatedTournaments(data.created || []);
      setJoinedTournaments(data.joined || []);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text={t.common.loading} />
      </div>
    );
  }

  const hasTournaments = createdTournaments.length > 0 || joinedTournaments.length > 0;

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {t.dashboard.title}
        </h1>
        <p className="text-gray-500 mt-1">{t.common.welcome}!</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
        <Link href="/tournaments/create">
          <Card hover className="h-full">
            <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {t.dashboard.createTournament}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{t.tournament.create}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tournaments/join">
          <Card hover className="h-full">
            <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                <Hash className="w-6 h-6 sm:w-7 sm:h-7 text-accent-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {t.dashboard.joinTournament}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{t.tournament.joinWithCode}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {!hasTournaments ? (
        <EmptyState
          icon={<Trophy className="w-8 h-8" />}
          title={t.dashboard.noTournaments}
          description={t.dashboard.startFirst}
          action={
            <Link href="/tournaments/create">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                {t.tournament.create}
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Created Tournaments */}
          {createdTournaments.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t.dashboard.myTournaments}
                </h2>
                <Link
                  href="/tournaments"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {t.common.viewAll}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdTournaments.slice(0, 3).map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    isAdmin
                    t={t}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Joined Tournaments */}
          {joinedTournaments.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t.dashboard.joinedTournaments}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedTournaments.slice(0, 3).map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    isAdmin={false}
                    t={t}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function TournamentCard({
  tournament,
  isAdmin,
  t,
}: {
  tournament: Tournament;
  isAdmin: boolean;
  t: Translations;
}) {
  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <Card hover className="h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Badge variant="primary">{t.tournament.admin}</Badge>
              )}
              <Badge variant={tournament.isActive ? "success" : "default"}>
                {tournament.isActive ? t.tournament.active : t.tournament.inactive}
              </Badge>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{tournament.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash className="w-4 h-4" />
            <span className="font-mono">{tournament.code}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
