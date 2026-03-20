import type { TimelineItem } from '@/shared/components/Timeline';
import { DEFAULT_STOP_COLOR, DEFAULT_STOP_ICON, STOP_TYPE_MAP } from '@/shared/constants/stopTypes';
import { avataaars } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import dayjs from 'dayjs';

export interface LogisticStop {
  Time?: string | null;
  Label?: string;
  Description?: string;
  Type?: string;
  PickUpUser?: string | null | Record<string, unknown>;
  DoneBy?: string | null | Record<string, unknown>;
}

export interface User {
  documentId: string;
  displayName?: string;
  username: string;
  avatar?: Record<string, unknown> | null;
}

export interface LogisticDetails {
  description?: string;
  pickupUser?: {
    displayName?: string;
    username: string;
  };
  doneByUser?: {
    displayName?: string;
    username: string;
  };
}

/**
 * Generate avatar data URI from AvatarConfig
 */
function generateAvatarUri(avatarConfig: Record<string, unknown> | undefined | null): string | undefined {
  if (!avatarConfig) return undefined;
  try {
    const options: Record<string, unknown> = {
      top: [(avatarConfig.top as string)],
      clothing: [(avatarConfig.clothing as string)],
      eyes: [(avatarConfig.eyes as string)],
      eyebrows: [(avatarConfig.eyebrows as string)],
      mouth: [(avatarConfig.mouth as string)],
      skinColor: [(avatarConfig.skinColor as string)],
    };
    if (avatarConfig.accessories) options.accessories = [(avatarConfig.accessories as string)];
    if (avatarConfig.facialHair) options.facialHair = [(avatarConfig.facialHair as string)];
    if (avatarConfig.clothingGraphic) options.clothingGraphic = [(avatarConfig.clothingGraphic as string)];
    if (avatarConfig.hairColor) options.hairColor = [(avatarConfig.hairColor as string)];
    if (avatarConfig.clothesColor) options.clothesColor = [(avatarConfig.clothesColor as string)];
    if (avatarConfig.facialHairColor) options.facialHairColor = [(avatarConfig.facialHairColor as string)];
    if (avatarConfig.hatColor) options.hatColor = [(avatarConfig.hatColor as string)];
    return createAvatar(avataaars, options).toDataUri();
  } catch {
    return undefined;
  }
}

/**
 * Convert logistic stops to timeline items
 * Filters empty stops, formats time, and includes pickup user avatars
 */
export function logisticToTimelineItems(
  logistic: LogisticStop[],
  users: (User | { documentId: string; displayName?: string; username: string; avatar?: any })[] = []
): TimelineItem[] {
  return logistic
    .filter((s) => s.Time || s.Label)
    .map((s: LogisticStop) => {
      const cfg = s.Type ? STOP_TYPE_MAP[s.Type] : undefined;
      const pickupUser =
        s.Type === 'pickup' && s.PickUpUser
          ? typeof s.PickUpUser === 'string'
            ? users.find((u:User) => u.documentId === s.PickUpUser)
            : (s.PickUpUser as unknown as User)
          : null;
      const doneByUser =
        s.DoneBy && typeof s.DoneBy === 'string'
          ? users.find((u) => u.documentId === s.DoneBy)
          : typeof s.DoneBy === 'object'
            ? (s.DoneBy as any)
            : null;

      const hasDetails = !!s.Description || !!pickupUser || !!doneByUser;
      const details: LogisticDetails | undefined = hasDetails ? {
        description: s.Description,
        pickupUser: pickupUser ? {
          displayName: pickupUser.displayName,
          username: pickupUser.username,
        } : undefined,
        doneByUser: doneByUser ? {
          displayName: doneByUser.displayName,
          username: doneByUser.username,
        } : undefined,
      } : undefined;

      return {
        time: s.Time ? dayjs(s.Time).format('D MMM HH:mm') : '',
        label: s.Label || cfg?.label || 'Sin etiqueta',
        description: s.Description || undefined,
        icon: cfg?.icon ?? DEFAULT_STOP_ICON,
        color: cfg?.color ?? DEFAULT_STOP_COLOR,
        photo: pickupUser ? generateAvatarUri(pickupUser.avatar) : undefined,
        details,
      };
    })
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
}
