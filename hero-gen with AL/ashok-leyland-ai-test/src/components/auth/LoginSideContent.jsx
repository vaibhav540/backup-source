import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AlLogo from "../../assets/logos/al-logo.svg";
import AtgLogo from "../../assets/logos/Atgeir-New-Logo_Dark.svg";
import googleLogo from "../../assets/logos/Google_Cloud.png";

export default function LoginSideContent() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "end",
        justifySelf: "end",
        gap: 2,
        p: 2,
        maxWidth: 340,
      }}
    >
      <Stack direction="row" sx={{ gap: 2 }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <img src='https://cdn.worldvectorlogo.com/logos/hero-motocorp-1.svg' alt="Logo" width={210} />
          <Box
            width={"100%"}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            mt={4}
            mb={10}
          >
            <img src={AtgLogo} alt="Atgeir" width={100} />
            <img src={googleLogo} alt="Google Cloud" width={100} height={30} />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
