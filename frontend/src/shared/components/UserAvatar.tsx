import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar as MuiAvatar } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { useMemo } from 'react';
import type { AvatarConfig } from '@/shared/api/client';

interface UserAvatarProps {
  avatar?: AvatarConfig | null;
  size?: number;
  sx?: SxProps<Theme>;
}

function isValidAvatar(avatar: AvatarConfig): boolean {
  return !!(avatar.top && avatar.clothing && avatar.eyes && avatar.eyebrows && avatar.mouth && avatar.skinColor);
}

export function UserAvatar({ avatar, size = 32, sx }: UserAvatarProps) {
  const svgUri = useMemo(() => {
    if (!avatar || !isValidAvatar(avatar)) return null;

    const options: Record<string, unknown> = {
      top: [avatar.top],
      clothing: [avatar.clothing],
      eyes: [avatar.eyes],
      eyebrows: [avatar.eyebrows],
      mouth: [avatar.mouth],
      skinColor: [avatar.skinColor],
    };

    if (avatar.accessories) options.accessories = [avatar.accessories];
    if (avatar.accessoriesProbability != null) options.accessoriesProbability = avatar.accessoriesProbability;
    if (avatar.facialHair) options.facialHair = [avatar.facialHair];
    if (avatar.facialHairProbability != null) options.facialHairProbability = avatar.facialHairProbability;
    if (avatar.clothingGraphic) options.clothingGraphic = [avatar.clothingGraphic];
    if (avatar.hairColor) options.hairColor = [avatar.hairColor];
    if (avatar.clothesColor) options.clothesColor = [avatar.clothesColor];
    if (avatar.facialHairColor) options.facialHairColor = [avatar.facialHairColor];
    if (avatar.hatColor) options.hatColor = [avatar.hatColor];

    return createAvatar(avataaars, options).toDataUri();
  }, [avatar]);

  if (!svgUri) {
    return (
      <MuiAvatar sx={{ width: size, height: size, ...sx }}>
        <AccountCircleIcon sx={{ fontSize: size }} />
      </MuiAvatar>
    );
  }

  return (
    <MuiAvatar
      src={svgUri}
      sx={{ width: size, height: size, ...sx }}
    />
  );
}
