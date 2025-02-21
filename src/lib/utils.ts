import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type StampItem } from "~/types/stamp"
import { type Contributor } from "~/components/ContributorsTable/columns"
import { type DbUserResponse } from "~/types/userProfile"
import { type StickerData } from "~/components/ProfileModal/stickers"
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

export function stampsToStickerData(stamps: StampItem[]): StickerData[] {
  return stamps.map((stamp, index) => {
    const position = index % 6;
    const stickerConfigs = {
      0: { rotation: -5, size: 240, top: 0, left: 134 },
      1: { rotation: 5, size: 240, top: 252, left: 24 },
      2: { rotation: -5, size: 240, top: 181, left: 357 },
      3: { rotation: -5, size: 240, top: 13, right: 495 },
      4: { rotation: 5, size: 240, top: 20, right: 64 },
      5: { rotation: 5, size: 240, top: 236, right: 230 }
    } as const;

    const stickerConfig = stickerConfigs[position as keyof typeof stickerConfigs];

    return {
      url: stamp.imageUrl ?? "",
      name: stamp.name,
      ...stickerConfig
    };
  });
}
