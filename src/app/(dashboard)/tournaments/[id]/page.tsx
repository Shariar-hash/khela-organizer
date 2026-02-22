"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useLanguageStore, getTranslation } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Avatar,
  Tabs,
  Input,
  Modal,
  EmptyState,
  Loader,
  Select,
  Textarea,
} from "@/components/ui";
import {
  Trophy,
  Users,
  Bell,
  Settings,
  Copy,
  Share2,
  ArrowLeft,
  UserPlus,
  Shuffle,
  Plus,
  Search,
  Trash2,
  Crown,
  Shield,
  Hash,
  Sparkles,
  Image as ImageIcon,
  Megaphone,
  Calendar,
  X,
} from "lucide-react";

interface TournamentData {
  tournament: {
    id: string;
    name: string;
    code: string;
    description?: string;
    logoUrl?: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    maxPlayers?: number;
  };
  admins: Array<{
    id: string;
    userId: string;
    role: string;
    user: { id: string; name: string; phone: string; avatarUrl?: string };
  }>;
  players: Array<{
    id: string;
    userId: string;
    category?: string;
    user: { id: string; name: string; phone: string; avatarUrl?: string };
  }>;
  teams: Array<{
    id: string;
    name: string;
    color?: string;
    members: Array<{
      member: { id: string; role?: string };
      player: { id: string; category?: string };
      user: { id: string; name: string; avatarUrl?: string };
    }>;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    imageUrl?: string;
    isPinned: boolean;
    createdAt: string;
    author: { id: string; name: string };
  }>;
  categories: Array<{
    id: string;
    name: string;
    description?: string;
    minPerTeam: number;
    maxPerTeam?: number;
    color?: string;
  }>;
  isAdmin: boolean;
  currentUserId: string;
}

type Translations = ReturnType<typeof getTranslation>;

export default function TournamentDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TournamentData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showRandomTeams, setShowRandomTeams] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showLogoGenerator, setShowLogoGenerator] = useState(false);

  useEffect(() => {
    fetchTournament();
  }, [id]);

  const fetchTournament = async () => {
    try {
      const res = await fetch(`/api/tournaments/${id}`);
      const result = await res.json();
      if (result.tournament) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (data) {
      navigator.clipboard.writeText(data.tournament.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text={t.common.loading} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 lg:p-8">
        <EmptyState
          icon={<Trophy className="w-8 h-8" />}
          title={t.errors.notFound}
          action={
            <Link href="/dashboard">
              <Button>{t.common.back}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: t.nav.dashboard, icon: <Trophy className="w-4 h-4" /> },
    { id: "players", label: t.players.title, icon: <Users className="w-4 h-4" /> },
    { id: "teams", label: t.teams.title, icon: <Users className="w-4 h-4" /> },
    { id: "announcements", label: t.announcements.title, icon: <Bell className="w-4 h-4" /> },
  ];

  if (data.isAdmin) {
    tabs.push({ id: "settings", label: t.admin.title, icon: <Settings className="w-4 h-4" /> });
  }

  const filteredPlayers = data.players.filter(
    (p) =>
      p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user.phone.includes(searchQuery)
  );

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/tournaments"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.common.back}
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            {data.tournament.logoUrl ? (
              <img
                src={data.tournament.logoUrl}
                alt={data.tournament.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {data.tournament.name}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={data.tournament.isActive ? "success" : "default"}>
                  {data.tournament.isActive ? t.tournament.active : t.tournament.inactive}
                </Badge>
                {data.isAdmin && (
                  <Badge variant="primary">
                    <Shield className="w-3 h-3 mr-1" />
                    {t.tournament.admin}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="font-mono font-semibold">{data.tournament.code}</span>
              <button
                onClick={copyCode}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {copied && (
              <span className="text-sm text-green-600">{t.common.copied}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.players.length}</p>
                <p className="text-sm text-gray-500">{t.tournament.players}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.teams.length}</p>
                <p className="text-sm text-gray-500">{t.tournament.teams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.announcements.length}</p>
                <p className="text-sm text-gray-500">{t.announcements.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.admins.length}</p>
                <p className="text-sm text-gray-500">{t.admin.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab data={data} t={t} />
      )}

      {activeTab === "players" && (
        <PlayersTab
          data={data}
          t={t}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredPlayers={filteredPlayers}
          onRefresh={fetchTournament}
        />
      )}

      {activeTab === "teams" && (
        <TeamsTab
          data={data}
          t={t}
          onCreateTeam={() => setShowCreateTeam(true)}
          onRandomTeams={() => setShowRandomTeams(true)}
          onRefresh={fetchTournament}
        />
      )}

      {activeTab === "announcements" && (
        <AnnouncementsTab
          data={data}
          t={t}
          onCreate={() => setShowCreateAnnouncement(true)}
          onRefresh={fetchTournament}
        />
      )}

      {activeTab === "settings" && data.isAdmin && (
        <SettingsTab
          data={data}
          t={t}
          onAddAdmin={() => setShowAddAdmin(true)}
          onGenerateLogo={() => setShowLogoGenerator(true)}
          onRefresh={fetchTournament}
        />
      )}

      {/* Modals */}
      <AddAdminModal
        isOpen={showAddAdmin}
        onClose={() => setShowAddAdmin(false)}
        players={data.players}
        admins={data.admins}
        tournamentId={id}
        t={t}
        onSuccess={fetchTournament}
      />

      <CreateTeamModal
        isOpen={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        players={data.players}
        teams={data.teams}
        tournamentId={id}
        t={t}
        onSuccess={fetchTournament}
      />

      <RandomTeamsModal
        isOpen={showRandomTeams}
        onClose={() => setShowRandomTeams(false)}
        players={data.players}
        categories={data.categories}
        tournamentId={id}
        t={t}
        onSuccess={fetchTournament}
      />

      <CreateAnnouncementModal
        isOpen={showCreateAnnouncement}
        onClose={() => setShowCreateAnnouncement(false)}
        tournamentId={id}
        t={t}
        onSuccess={fetchTournament}
      />

      <LogoGeneratorModal
        isOpen={showLogoGenerator}
        onClose={() => setShowLogoGenerator(false)}
        tournamentId={id}
        tournamentName={data.tournament.name}
        t={t}
        onSuccess={fetchTournament}
      />
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ data, t }: { data: TournamentData; t: Translations }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tournament Info */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t.tournament.tournamentDetails}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {data.tournament.description && (
            <p className="text-gray-600 mb-4">{data.tournament.description}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            {data.tournament.startDate && (
              <div>
                <p className="text-sm text-gray-500">{t.tournament.startDate}</p>
                <p className="font-medium">
                  {new Date(data.tournament.startDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {data.tournament.endDate && (
              <div>
                <p className="text-sm text-gray-500">{t.tournament.endDate}</p>
                <p className="font-medium">
                  {new Date(data.tournament.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {data.tournament.maxPlayers && (
              <div>
                <p className="text-sm text-gray-500">{t.tournament.maxPlayers}</p>
                <p className="font-medium">
                  {data.players.length} / {data.tournament.maxPlayers}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentAnnouncements}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {data.announcements.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              {t.announcements.noAnnouncements}
            </p>
          ) : (
            <div className="space-y-3">
              {data.announcements.slice(0, 3).map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 bg-gray-50 rounded-xl"
                >
                  <p className="font-medium text-sm">{announcement.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teams Preview */}
      {data.teams.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t.teams.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.teams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-xl border border-gray-100"
                  style={{ borderLeftColor: team.color, borderLeftWidth: 4 }}
                >
                  <h4 className="font-semibold mb-2">{team.name}</h4>
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((member) => (
                      <Avatar
                        key={member.user.id}
                        name={member.user.name}
                        imageUrl={member.user.avatarUrl}
                        size="sm"
                        className="border-2 border-white"
                      />
                    ))}
                    {team.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Players Tab Component
function PlayersTab({
  data,
  t,
  searchQuery,
  setSearchQuery,
  filteredPlayers,
  onRefresh,
}: {
  data: TournamentData;
  t: Translations;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredPlayers: TournamentData["players"];
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRemovePlayer = async (playerId: string) => {
    if (!confirm(t.players.removePlayer + "?")) return;

    setLoading(playerId);
    try {
      await fetch(`/api/tournaments/${data.tournament.id}/players?playerId=${playerId}`, {
        method: "DELETE",
      });
      onRefresh();
    } catch (error) {
      console.error("Error removing player:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleUpdateCategory = async (playerId: string, category: string) => {
    try {
      await fetch(`/api/tournaments/${data.tournament.id}/players`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, category }),
      });
      onRefresh();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Input
          placeholder={t.players.searchPlayers}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={20} />}
          className="max-w-md"
        />
        <p className="text-gray-500">
          {filteredPlayers.length} {t.players.playerCount}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredPlayers.map((player) => {
              const isAdmin = data.admins.some((a) => a.userId === player.userId);
              const isCreator = data.admins.some(
                (a) => a.userId === player.userId && a.role === "creator"
              );

              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={player.user.name}
                      imageUrl={player.user.avatarUrl}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{player.user.name}</p>
                        {isCreator && (
                          <Badge variant="warning" size="sm">
                            <Crown className="w-3 h-3 mr-1" />
                            {t.tournament.creator}
                          </Badge>
                        )}
                        {isAdmin && !isCreator && (
                          <Badge variant="primary" size="sm">
                            <Shield className="w-3 h-3 mr-1" />
                            {t.tournament.admin}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{player.user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {data.isAdmin && data.categories.length > 0 && (
                      <Select
                        options={[
                          { value: "", label: t.players.category },
                          ...data.categories.map((c) => ({ value: c.name, label: c.name })),
                        ]}
                        value={player.category || ""}
                        onChange={(value) => handleUpdateCategory(player.id, value)}
                        className="w-40"
                      />
                    )}
                    {player.category && (
                      <Badge variant="info">{player.category}</Badge>
                    )}
                    {data.isAdmin && !isCreator && (
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        disabled={loading === player.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Teams Tab Component
function TeamsTab({
  data,
  t,
  onCreateTeam,
  onRandomTeams,
  onRefresh,
}: {
  data: TournamentData;
  t: Translations;
  onCreateTeam: () => void;
  onRandomTeams: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-6">
      {data.isAdmin && (
        <div className="flex gap-3">
          <Button onClick={onCreateTeam}>
            <Plus className="w-5 h-5 mr-2" />
            {t.teams.createTeam}
          </Button>
          <Button variant="outline" onClick={onRandomTeams}>
            <Shuffle className="w-5 h-5 mr-2" />
            {t.teams.randomMethod}
          </Button>
        </div>
      )}

      {data.teams.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title={t.teams.noTeams}
          action={
            data.isAdmin ? (
              <Button onClick={onCreateTeam}>
                <Plus className="w-5 h-5 mr-2" />
                {t.teams.createTeam}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.teams.map((team) => (
            <Card key={team.id}>
              <CardHeader
                className="border-l-4"
                style={{ borderLeftColor: team.color }}
              >
                <CardTitle className="flex items-center justify-between">
                  <span>{team.name}</span>
                  <Badge>{team.members.length} {t.tournament.players}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.user.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <Avatar
                        name={member.user.name}
                        imageUrl={member.user.avatarUrl}
                        size="sm"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.user.name}</p>
                        {member.player.category && (
                          <p className="text-xs text-gray-500">
                            {member.player.category}
                          </p>
                        )}
                      </div>
                      {member.member.role && (
                        <Badge variant="info" size="sm">
                          {member.member.role}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Announcements Tab Component
function AnnouncementsTab({
  data,
  t,
  onCreate,
  onRefresh,
}: {
  data: TournamentData;
  t: Translations;
  onCreate: () => void;
  onRefresh: () => void;
}) {
  const handleDelete = async (announcementId: string) => {
    if (!confirm(t.common.delete + "?")) return;

    try {
      await fetch(
        `/api/tournaments/${data.tournament.id}/announcements?announcementId=${announcementId}`,
        { method: "DELETE" }
      );
      onRefresh();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="space-y-6">
      {data.isAdmin && (
        <Button onClick={onCreate}>
          <Plus className="w-5 h-5 mr-2" />
          {t.announcements.create}
        </Button>
      )}

      {data.announcements.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title={t.announcements.noAnnouncements}
          action={
            data.isAdmin ? (
              <Button onClick={onCreate}>
                <Plus className="w-5 h-5 mr-2" />
                {t.announcements.create}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {data.announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {announcement.isPinned && (
                      <Badge variant="warning">{t.announcements.pinned}</Badge>
                    )}
                    <Badge>
                      {announcement.type === "announcement" && t.announcements.announcement}
                      {announcement.type === "match_info" && t.announcements.matchInfo}
                      {announcement.type === "image" && t.announcements.image}
                      {announcement.type === "jersey" && t.announcements.jersey}
                    </Badge>
                  </div>
                  {data.isAdmin && (
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{announcement.content}</p>
                {announcement.imageUrl && (
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="mt-4 rounded-xl max-h-96 object-cover"
                  />
                )}
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <span>{announcement.author.name}</span>
                  <span>•</span>
                  <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Tab Component
function SettingsTab({
  data,
  t,
  onAddAdmin,
  onGenerateLogo,
  onRefresh,
}: {
  data: TournamentData;
  t: Translations;
  onAddAdmin: () => void;
  onGenerateLogo: () => void;
  onRefresh: () => void;
}) {
  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm(t.admin.removeAdmin + "?")) return;

    try {
      await fetch(
        `/api/tournaments/${data.tournament.id}/admins?adminId=${adminId}`,
        { method: "DELETE" }
      );
      onRefresh();
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {t.logo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-4">{t.logo.enterPrompt}</p>
          <Button onClick={onGenerateLogo}>
            <Sparkles className="w-5 h-5 mr-2" />
            {t.logo.generateLogo}
          </Button>
        </CardContent>
      </Card>

      {/* Admin Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t.admin.adminList}</span>
            <Button size="sm" onClick={onAddAdmin}>
              <UserPlus className="w-4 h-4 mr-2" />
              {t.admin.addAdmin}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {data.admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    name={admin.user.name}
                    imageUrl={admin.user.avatarUrl}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{admin.user.name}</p>
                    <p className="text-sm text-gray-500">{admin.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={admin.role === "creator" ? "warning" : "primary"}>
                    {admin.role === "creator" && <Crown className="w-3 h-3 mr-1" />}
                    {admin.role === "creator" ? t.tournament.creator : t.tournament.admin}
                  </Badge>
                  {admin.role !== "creator" && (
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t.categories.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <CategoryManager
            categories={data.categories}
            tournamentId={data.tournament.id}
            t={t}
            onRefresh={onRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Category Manager Component
function CategoryManager({
  categories,
  tournamentId,
  t,
  onRefresh,
}: {
  categories: TournamentData["categories"];
  tournamentId: string;
  t: Translations;
  onRefresh: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [minPerTeam, setMinPerTeam] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name) return;
    setLoading(true);

    try {
      await fetch(`/api/tournaments/${tournamentId}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          minPerTeam: parseInt(minPerTeam) || 0,
        }),
      });
      setName("");
      setMinPerTeam("0");
      setShowAdd(false);
      onRefresh();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await fetch(
        `/api/tournaments/${tournamentId}/categories?categoryId=${categoryId}`,
        { method: "DELETE" }
      );
      onRefresh();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
          >
            <span>{category.name}</span>
            {category.minPerTeam > 0 && (
              <span className="text-xs text-gray-500">
                (min: {category.minPerTeam})
              </span>
            )}
            <button
              onClick={() => handleDelete(category.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="flex items-end gap-3">
          <Input
            label={t.categories.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.categories.name}
          />
          <Input
            label={t.teams.minPerTeam}
            type="number"
            value={minPerTeam}
            onChange={(e) => setMinPerTeam(e.target.value)}
            className="w-24"
          />
          <Button onClick={handleAdd} loading={loading}>
            {t.common.save}
          </Button>
          <Button variant="ghost" onClick={() => setShowAdd(false)}>
            {t.common.cancel}
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t.categories.create}
        </Button>
      )}
    </div>
  );
}

// Modal Components
function AddAdminModal({
  isOpen,
  onClose,
  players,
  admins,
  tournamentId,
  t,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  players: TournamentData["players"];
  admins: TournamentData["admins"];
  tournamentId: string;
  t: Translations;
  onSuccess: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  const nonAdminPlayers = players.filter(
    (p) => !admins.some((a) => a.userId === p.userId)
  );

  const handleSubmit = async () => {
    if (!selectedUser) return;
    setLoading(true);

    try {
      await fetch(`/api/tournaments/${tournamentId}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser }),
      });
      onSuccess();
      onClose();
      setSelectedUser("");
    } catch (error) {
      console.error("Error adding admin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.admin.addAdmin}>
      <div className="space-y-4">
        <Select
          label={t.players.title}
          options={nonAdminPlayers.map((p) => ({
            value: p.userId,
            label: p.user.name,
          }))}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder={t.teams.selectPlayers}
        />
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {t.admin.addAdmin}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function CreateTeamModal({
  isOpen,
  onClose,
  players,
  teams,
  tournamentId,
  t,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  players: TournamentData["players"];
  teams: TournamentData["teams"];
  tournamentId: string;
  t: Translations;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Get players not in any team
  const assignedPlayerIds = new Set(
    teams.flatMap((t) => t.members.map((m) => m.player.id))
  );
  const availablePlayers = players.filter((p) => !assignedPlayerIds.has(p.id));

  const handleSubmit = async () => {
    if (!name) return;
    setLoading(true);

    try {
      await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, playerIds: selectedPlayers }),
      });
      onSuccess();
      onClose();
      setName("");
      setSelectedPlayers([]);
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.teams.createTeam} size="lg">
      <div className="space-y-4">
        <Input
          label={t.teams.teamName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.teams.teamName}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.teams.selectPlayers}
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl">
            {availablePlayers.map((player) => (
              <label
                key={player.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPlayers.includes(player.id)}
                  onChange={() => togglePlayer(player.id)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Avatar name={player.user.name} size="sm" />
                <span>{player.user.name}</span>
                {player.category && (
                  <Badge variant="info" size="sm">
                    {player.category}
                  </Badge>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {t.teams.createTeam}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function RandomTeamsModal({
  isOpen,
  onClose,
  players,
  categories,
  tournamentId,
  t,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  players: TournamentData["players"];
  categories: TournamentData["categories"];
  tournamentId: string;
  t: Translations;
  onSuccess: () => void;
}) {
  const [numberOfTeams, setNumberOfTeams] = useState("2");
  const [useCategories, setUseCategories] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const categoryRules: Record<string, { min: number }> = {};
      if (useCategories) {
        categories.forEach((c) => {
          if (c.minPerTeam > 0) {
            categoryRules[c.name] = { min: c.minPerTeam };
          }
        });
      }

      await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numberOfTeams: parseInt(numberOfTeams),
          useCategories,
          categoryRules,
        }),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error generating teams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.teams.randomMethod}>
      <div className="space-y-4">
        <Input
          label={t.teams.numberOfTeams}
          type="number"
          value={numberOfTeams}
          onChange={(e) => setNumberOfTeams(e.target.value)}
          min="2"
          max={Math.floor(players.length / 2).toString()}
        />

        <p className="text-sm text-gray-500">
          {players.length} {t.players.playerCount} → {numberOfTeams} {t.teams.title}
        </p>

        {categories.length > 0 && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useCategories}
              onChange={(e) => setUseCategories(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>{t.teams.advancedRandom}</span>
          </label>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            <Shuffle className="w-4 h-4 mr-2" />
            {t.teams.generateTeams}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function CreateAnnouncementModal({
  isOpen,
  onClose,
  tournamentId,
  t,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  t: Translations;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("announcement");
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) return;
    setLoading(true);

    try {
      await fetch(`/api/tournaments/${tournamentId}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, type, isPinned }),
      });
      onSuccess();
      onClose();
      setTitle("");
      setContent("");
      setType("announcement");
      setIsPinned(false);
    } catch (error) {
      console.error("Error creating announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.announcements.create} size="lg">
      <div className="space-y-4">
        <Input
          label={t.announcements.postTitle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.announcements.postTitle}
        />

        <Textarea
          label={t.announcements.content}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.announcements.content}
          rows={5}
        />

        <Select
          label={t.announcements.type}
          options={[
            { value: "announcement", label: t.announcements.announcement },
            { value: "match_info", label: t.announcements.matchInfo },
            { value: "image", label: t.announcements.image },
            { value: "jersey", label: t.announcements.jersey },
          ]}
          value={type}
          onChange={setType}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span>{t.announcements.pin}</span>
        </label>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {t.announcements.create}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function LogoGeneratorModal({
  isOpen,
  onClose,
  tournamentId,
  tournamentName,
  t,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  t: Translations;
  onSuccess: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<{
    logoSvg: string;
    description: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tournamentName }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedLogo(data);
      }
    } catch (error) {
      console.error("Error generating logo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseLogo = async () => {
    if (!generatedLogo) return;
    setLoading(true);

    try {
      // Convert SVG to data URL
      const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(generatedLogo.logoSvg)}`;

      await fetch(`/api/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: svgDataUrl }),
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating logo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.logo.title} size="lg">
      <div className="space-y-4">
        <Textarea
          label={t.logo.enterPrompt}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.logo.promptPlaceholder}
          rows={3}
        />

        <Button onClick={handleGenerate} loading={loading} className="w-full">
          <Sparkles className="w-5 h-5 mr-2" />
          {loading ? t.logo.generating : t.logo.generateLogo}
        </Button>

        {generatedLogo && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-center">
              <div
                className="w-40 h-40"
                dangerouslySetInnerHTML={{ __html: generatedLogo.logoSvg }}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {generatedLogo.description}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleGenerate} className="flex-1">
                {t.logo.regenerate}
              </Button>
              <Button onClick={handleUseLogo} loading={loading} className="flex-1">
                {t.logo.useAsLogo}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
