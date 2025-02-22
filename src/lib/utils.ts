import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DisplayStamp, DistributedStamps, StampItem } from "~/types/stamp"
import { type Contributor } from "~/components/ContributorsTable/columns"
import type { UserProfile, DbUserResponse } from "~/types/userProfile"
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

export function stampsToDisplayStamps(stamps: StampItem[], userProfile: UserProfile): DisplayStamp[] {
  const eventClaimCounts = new Map<string, number>();
    
    // Count existing claimed stamps per event
    userProfile?.stamps?.forEach(userStamp => {
        const event = userStamp.event;
        if (event) {
            eventClaimCounts.set(event, (eventClaimCounts.get(event) ?? 0) + 1);
        }
    });

    return stamps.map(stamp => {
        const isClaimed = userProfile?.stamps?.some(
            userStamp => userStamp.name.split("#")[0] === stamp.name
        ) ?? false;

        const claimedCount = stamp.event ? (eventClaimCounts.get(stamp.event) ?? 0) : 0;
        
        const isClaimable = stamp.event && stamp.userCountLimit 
            ? claimedCount < stamp.userCountLimit
            : true;

        return {
            ...stamp,
            isClaimed,
            isClaimable,
            claimedCount
        };
    });
}

export const STICKER_LAYOUT_CONFIG = {
  left: [
    { rotation: -5, amountLeft: 95, dropsAmount: 500 },
    { rotation: -5, amountLeft: 45, dropsAmount: 100 }
  ],
  center: [
    { rotation: -5, amountLeft: 95, dropsAmount: 500 }
  ],
  right: [
    { rotation: 5, amountLeft: 45, dropsAmount: 100 },
    { rotation: 5, amountLeft: 95, dropsAmount: 500 }
  ]
} as const;

export function distributeStamps(stamps: DisplayStamp[]): DistributedStamps {
  const columns: DistributedStamps = {
    left: [],
    center: [],
    right: []
  };
  
  stamps.forEach((stamp, index) => {
    if (index % 3 === 0) columns.left.push(stamp);
    else if (index % 3 === 1) columns.center.push(stamp);
    else columns.right.push(stamp);
  });
  
  return columns;
}