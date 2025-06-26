import { Stack, Typography } from "@mui/material";
import Avatar from "./Avatar";

export const BasicAvatar = () => (
  <>
    <Stack spacing={2}>
      <Typography variant="h4">Avatar</Typography>
      <Avatar name="Nombre de Prueba" image={undefined} size="small" />
      <Avatar name="Nombre de Prueba" image={undefined} size="medium" />
      <Avatar name="Nombre de Prueba" image={undefined} size="large" />
    </Stack>
  </>
);
export const AvataaarAvatar = () => (
  <Stack spacing={2}>
    <Typography variant="h4">Avatar</Typography>
    <Avatar
      name="Nombre de Prueba"
      image={
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Poola&clothesColor=ff007d"
      }
      size="large"
    />
    <Avatar
      name="Nombre de Prueba"
      image={
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie&clothesColor=227dff"
      }
      size="large"
    />
    <Avatar
      name="Nombre de Prueba"
      image={"https://api.dicebear.com/9.x/avataaars/svg?seed=Toffo"}
      size="large"
    />
  </Stack>
);
