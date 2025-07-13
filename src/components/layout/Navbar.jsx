import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Logout,
  LockReset,
  Home,
  DarkMode,
  LightMode,
  AdminPanelSettings,
} from "@mui/icons-material";

import googleLogo from "../../assets/logos/Google_Cloud.png";
import AtgLogo from "../../assets/logos/Atgeir-New-Logo_Dark.svg";
import AtgLogoLight from "../../assets/logos/Atgeir-New-Logo_Light.svg";
import AlLogo from "../../assets/logos/al-logo.svg";

import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { setChatLogout, setLogout } from "../../redux/actions";

const Navbar = ({ Main, title }) => {
  const dispatch = useDispatch();
  const accountDetails = useSelector((state) => state.account.accountDetails);
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuEl, setMenuEl] = React.useState(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    navigate("/");
    dispatch(setLogout());
    dispatch(setChatLogout());
  };

  const drawerWidth = 240;
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        minHeight: "55px",
        backgroundColor: "white",
        padding: 0,
      }}
    >
      <Paper sx={{ borderRadius: 0, boxShadow: "none" }}>
        <Toolbar
          sx={{ minHeight: "55px !important" }}
          className="d-flex justify-content-between align-items-center"
        >
          <Box display="flex" alignItems="center">
            <img
              src={AlLogo}
              alt="Ashok layland Logo"
              width={150}
              style={{ filter: isDarkMode ? "brightness(0) invert(1)" : "" }}
            />
          </Box>

          <Typography
            variant="h6"
            color="primary"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {/* {title || "Ask Questions"} */}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={isDarkMode ? AtgLogoLight : AtgLogo}
              alt="Atg Logo"
              width={120}
            />
            <img src={googleLogo} alt="Google Logo" width={120} />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {accountDetails?.email}
              </MenuItem>
              <MenuItem
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
                onClick={handleLogout}
              >
                <Logout size={18} /> Sign-out{" "}
              </MenuItem>
              {/* Admin Dashboard link, only for allowed users in development */}
              {[
                "genaidemo@atgeirsolutions.com",
                "ashok_leyland_demo@atgeirsolutions.com",
                "cloud_dev_test@atgeirsolutions.com",
                "ui_dev_test@atgeirsolutions.com"
              ].includes(accountDetails?.email) && accountDetails?.environment === "development" && (
                <MenuItem
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/admin-dashboard");
                  }}
                >
                  <AdminPanelSettings fontSize="small" /> Admin Dashboard
                </MenuItem>
              )}
            </Menu>
            <IconButton onClick={toggleTheme} color="primary">
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar>{/* {accountDetails?.email?.charAt(0)} */}</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </Paper>
    </AppBar>
  );
};

export default Navbar;
