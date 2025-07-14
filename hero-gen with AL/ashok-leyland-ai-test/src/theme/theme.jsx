import { createTheme } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#001f54",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
      user_prompt: "rgb(233, 237, 246)",
      ai_prompt: "transparent",
    },
    text: {
      user_prompt: "rgb(94, 97, 100)",
      main_title: "rgb(28, 145, 209)",
    },
  },
  components: {
    ...inputsCustomizations,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(0, 54, 148)",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
      user_prompt: "#001f54",
      ai_prompt: "rgb(18, 18, 18)",
    },
    text: {
      user_prompt: "rgb(255, 255, 255)",
      main_title: "rgb(255, 255, 255)",
    },
  },
  components: {
    ...inputsCustomizations,
  },
});
