import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPhoneNumber(phone: string): string {
  // Format Bangladeshi phone numbers
  if (phone.startsWith("+880")) {
    return phone.replace(/(\+880)(\d{4})(\d{6})/, "$1 $2-$3");
  }
  return phone;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function distributePlayersToTeams<T>(
  players: T[],
  numberOfTeams: number
): T[][] {
  const shuffled = shuffleArray(players);
  const teams: T[][] = Array.from({ length: numberOfTeams }, () => []);

  shuffled.forEach((player, index) => {
    teams[index % numberOfTeams].push(player);
  });

  return teams;
}

export function distributePlayersByCategoryToTeams<T extends { category?: string | null }>(
  players: T[],
  numberOfTeams: number,
  categoryRules: { [category: string]: { min?: number; max?: number } } = {}
): T[][] {
  const teams: T[][] = Array.from({ length: numberOfTeams }, () => []);
  const playersByCategory: { [key: string]: T[] } = {};

  // Group players by category
  players.forEach((player) => {
    const category = player.category || "uncategorized";
    if (!playersByCategory[category]) {
      playersByCategory[category] = [];
    }
    playersByCategory[category].push(player);
  });

  // Shuffle each category
  Object.keys(playersByCategory).forEach((category) => {
    playersByCategory[category] = shuffleArray(playersByCategory[category]);
  });

  // First pass: distribute required players from each category
  Object.entries(categoryRules).forEach(([category, rules]) => {
    const categoryPlayers = playersByCategory[category] || [];
    const minRequired = rules.min || 0;

    for (let teamIndex = 0; teamIndex < numberOfTeams; teamIndex++) {
      for (let i = 0; i < minRequired && categoryPlayers.length > 0; i++) {
        const player = categoryPlayers.shift();
        if (player) {
          teams[teamIndex].push(player);
        }
      }
    }

    // Update remaining players
    if (categoryPlayers.length > 0) {
      playersByCategory[category] = categoryPlayers;
    } else {
      delete playersByCategory[category];
    }
  });

  // Second pass: distribute remaining players evenly
  const remainingPlayers = Object.values(playersByCategory).flat();
  const shuffledRemaining = shuffleArray(remainingPlayers);

  shuffledRemaining.forEach((player, index) => {
    // Find team with fewest players
    const teamIndex = teams.reduce(
      (minIndex, team, index, arr) =>
        team.length < arr[minIndex].length ? index : minIndex,
      0
    );
    teams[teamIndex].push(player);
  });

  return teams;
}

export function generateTeamColors(): string[] {
  return [
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#22c55e", // Green
    "#eab308", // Yellow
    "#a855f7", // Purple
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#84cc16", // Lime
    "#6366f1", // Indigo
  ];
}
