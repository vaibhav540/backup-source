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
  Paper,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";

import heroLogo from "../../assets/logos/heroLogo.svg";

import { useDispatch, useSelector } from "react-redux";
import { setChatLogout, setLogout } from "../../redux/actions";

const Navbar = ({ Main, title }) => {
  const dispatch = useDispatch();
  const accountDetails = useSelector((state) => state.account.accountDetails);
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    navigate("/");
    dispatch(setLogout());
    dispatch(setChatLogout());
  };

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
              src={heroLogo}
              alt="Hero logo"
              width={150}
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
                <Logout fontSize="small" /> Sign‑out
              </MenuItem>

             
            </Menu>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar style={{backgroundColor:"black"}}>{/* {accountDetails?.email?.charAt(0)} */}</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </Paper>
    </AppBar>
  );
};

export default Navbar;
