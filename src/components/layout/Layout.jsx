// src/components/layout/Layout.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Grid2 as Grid,
  Button,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Add,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setIsSidebarOpen, setSessionID } from "../../redux/actions";
import useChat from "../../hooks/useChat";
import { useLocation } from "react-router-dom";

const drawerWidth = 280;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    width: "100%",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: "0px",
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    marginTop: "57px",
  })
);

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const { startNewChat } = useChat();
  const allChatData = useSelector((state) => state.chat.allChat);
  const location = useLocation();

  const handleToggle = (value) => {
    setOpen(value);
    dispatch(setIsSidebarOpen(value));
  };

  // Hide sidebar for admin dashboard and main page
  const isSidebarVisible = ["/main/service-manual", "/main/operator-handbook"].includes(location.pathname);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar Main={Main} />
      {isSidebarVisible && (
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            width: open ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pr: 3,
                pb: 1,
              }}
            >
              <IconButton onClick={() => handleToggle(false)}>
                <ChevronLeftIcon />
              </IconButton>
              <Button
                size="small"
                sx={{ px: 2, py: 0, borderRadius: 3 }}
                variant="outlined"
                startIcon={<Add />}
                onClick={() => startNewChat()}
              >
                New Chat
              </Button>
            </Box>
            <Divider />
            {allChatData.length > 0 && (
              <Box sx={{ px: 2, mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recent
                </Typography>
              </Box>
            )}

            <Sidebar />
          </Box>
        </Drawer>
      )}
      {!open && isSidebarVisible && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => handleToggle(true)}
          sx={{
            position: "fixed",
            top: "65px",
            left: 12,
            zIndex: (theme) => theme.zIndex.drawer - 1,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Main open={open && isSidebarVisible}>{children}</Main>
    </Box>
  );
};

export default Layout;
