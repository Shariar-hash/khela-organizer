"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  Badge,
  Loader,
  Button,
  Input,
} from "@/components/ui";
import { Trophy, Calendar, Users, Hash, Edit2, Check, X } from "lucide-react";

interface UserData {
  user: {
    id: string;
    name: string;
    phone: string;
    avatarUrl?: string;
    createdAt: string;
  };
}

interface Tournament {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export default function ProfilePage() {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData["user"] | null>(null);
  const [tournaments, setTournaments] = useState<{
    created: Tournament[];
    joined: Tournament[];
  }>({ created: [], joined: [] });
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, tournamentsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/tournaments"),
      ]);

      const userData = await userRes.json();
      const tournamentsData = await tournamentsRes.json();

      setUser(userData.user);
      setTournaments({
        created: tournamentsData.created || [],
        joined: tournamentsData.joined || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName("");
    setEditPhone("");
  };

  const saveProfile = async () => {
    if (!editName.trim() || !editPhone.trim() || !user) return;
    
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: editName.trim(),
          phone: editPhone.trim(),
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        setEditName("");
        setEditPhone("");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text={t.common.loading} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {t.profile.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar
              name={user.name}
              imageUrl={user.avatarUrl}
              size="xl"
              className="mx-auto mb-4"
            />
            
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={t.players.yourName}
                  className="text-center"
                  autoFocus
                />
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder={t.auth.phoneNumber}
                  className="text-center"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveProfile();
                    if (e.key === "Escape") cancelEditing();
                  }}
                />
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    onClick={saveProfile}
                    disabled={saving || !editName.trim() || !editPhone.trim()}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {t.common.save}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t.common.cancel}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <button
                    onClick={startEditing}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title={t.profile.editProfile}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-500 mb-4 mt-1">{user.phone}</p>
              </>
            )}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                {t.profile.memberSince}{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {tournaments.created.length}
                </p>
                <p className="text-sm text-gray-500">{t.profile.tournamentsCreated}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {tournaments.joined.length}
                </p>
                <p className="text-sm text-gray-500">{t.profile.tournamentsJoined}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournaments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.profile.myTournaments}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {tournaments.created.length === 0 && tournaments.joined.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {t.dashboard.noTournaments}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {[...tournaments.created, ...tournaments.joined].map((tournament) => {
                  const isCreated = tournaments.created.some(
                    (t) => t.id === tournament.id
                  );
                  return (
                    <Link
                      key={tournament.id}
                      href={`/tournaments/${tournament.id}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{tournament.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Hash className="w-3 h-3" />
                            <span className="font-mono">{tournament.code}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCreated && (
                          <Badge variant="primary">{t.tournament.admin}</Badge>
                        )}
                        <Badge variant={tournament.isActive ? "success" : "default"}>
                          {tournament.isActive
                            ? t.tournament.active
                            : t.tournament.inactive}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
