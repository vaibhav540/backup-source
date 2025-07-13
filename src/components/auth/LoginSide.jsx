import * as React from "react";
import Stack from "@mui/material/Stack";
import LoginPage from "./LoginPage";
import LoginSideContent from "./LoginSideContent";

export default function LoginSide(props) {
  return (
    <Stack
      direction="column"
      component="main"
      sx={[
        {
          justifyContent: "center",
          height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
          marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
          minHeight: "100%",
        },
        (theme) => ({
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
            backgroundRepeat: "no-repeat",
            ...theme.applyStyles("dark", {
              backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
            }),
          },
        }),
      ]}
    >
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          background: "linear-gradient(135deg, #d3e8ff 0%, #efd3ff 100%)",
          gap: { xs: 0, sm: 0 },
          p: 0,
          mx: "auto",
          marginTop: 6,
          boxShadow: 1,
        }}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 4, sm: 1 },
            m: "auto",
          }}
        >
          <LoginSideContent />
          <LoginPage />
        </Stack>
      </Stack>
    </Stack>
  );
}
