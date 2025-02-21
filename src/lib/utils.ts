import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type StampItem } from "~/types/stamp"
import { type Contributor } from "~/components/ContributorsTable/columns"
import { type DbUserResponse } from "~/types/userProfile"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function usersToContributor(users: DbUserResponse[]): Contributor[] {
  // Sort users by points in descending order
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  
  // Map users to contributors with place based on sorted position
  return sortedUsers.map((user, index) => ({
    address: user.address,
    name: user.name,
    place: index + 1, // Add 1 since array indices are 0-based
    points: user.points,
    stampsCollected: user.stamp_count,
  }));
}