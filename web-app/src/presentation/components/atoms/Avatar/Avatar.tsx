import { Avatar as MUIAvatar } from "@mui/material";
import type { TBaseSizes } from "../../../../data/types";

export interface IAvatar {
  name: string;
  image: string | undefined;
  size: TBaseSizes;
}

const avatarSizes = new Map<TBaseSizes, number>([
  ["small", 24],
  ["medium", 32],
  ["large", 40],
]);

const avatarSize = (size: TBaseSizes) => avatarSizes.get(size);

const Avatar = ({ name, image, size = "medium" }: IAvatar) => {
  const squareSize = avatarSize(size);
  return (
    <MUIAvatar
      sx={{ width: squareSize, height: squareSize }}
      alt={name}
      src={image}
    />
  );
};

export default Avatar;
