import { TextField as MUITextField, styled } from "@mui/material";

const TextFieldRoot = styled(MUITextField)(({ theme }) => ({
  borderColor:
    theme.palette.mode === "light"
      ? theme.palette.black.main
      : theme.palette.greySimplified.light,
}));

export const TextField = () => <TextFieldRoot />;
