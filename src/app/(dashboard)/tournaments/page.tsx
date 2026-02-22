"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguageStore, getTranslation } from "@/lib/i18n";
import {
  Card,
  CardContent,
  Button,
  Badge,
  EmptyState,
  Loader,
} from "@/components/ui";
import { Trophy, Plus, Hash, ArrowRight } from "lucide-react";

type Translations = ReturnType<typeof getTranslation>;

interface Tournament {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function TournamentsPage() {
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

  const allTournaments = [...createdTournaments, ...joinedTournaments];

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {t.nav.tournaments}
          </h1>
          <p className="text-gray-500 mt-1">
            {allTournaments.length} {t.nav.tournaments.toLowerCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/tournaments/join">
            <Button variant="outline">
              <Hash className="w-5 h-5 mr-2" />
              {t.tournament.join}
            </Button>
          </Link>
          <Link href="/tournaments/create">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              {t.tournament.create}
            </Button>
          </Link>
        </div>
      </div>

      {allTournaments.length === 0 ? (
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t.dashboard.myTournaments}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdTournaments.map((tournament) => (
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t.dashboard.joinedTournaments}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedTournaments.map((tournament) => (
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
          {tournament.description && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
              {tournament.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash className="w-4 h-4" />
            <span className="font-mono">{tournament.code}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
