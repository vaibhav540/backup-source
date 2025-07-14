import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  Image,
  VideoLibrary,
  PhotoCamera,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setSegment } from "../redux/actions";

const cardData = [
  {
    title: "Image Query",
    description: "Run image-based queries and fetch visual insights.",
    path: "/main/image-query",
    icon: <Image fontSize="large" />,
    animationDirection: -1,
  },
  {
    title: "Video Query",
    description: "Analyze videos and extract relevant information.",
    path: "/main/video-query",
    icon: <VideoLibrary fontSize="large" />,
    animationDirection: 1,
  },
  {
    title: "Image Training",
    description: "Train models using labeled image datasets.",
    path: "/main/image-training",
    icon: <PhotoCamera fontSize="large" />,
    animationDirection: 1,
  },
];

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [lastPathname, setLastPathname] = useState(location.pathname);

  // Keep all logic same
  useEffect(() => {
    if (location.pathname !== lastPathname) {
      sessionStorage.setItem("shouldHardRefresh", "true");
      sessionStorage.setItem("lastPathname", location.pathname);
      window.location.reload();
    }
  }, [location.pathname, lastPathname]);

  useEffect(() => {
    const shouldHardRefresh = sessionStorage.getItem("shouldHardRefresh") === "true";
    const storedPath = sessionStorage.getItem("lastPathname");
    if (shouldHardRefresh && storedPath === location.pathname) {
      sessionStorage.removeItem("shouldHardRefresh");
      setLastPathname(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    let segment = "";
    if (location.pathname === "/main/image-query") {
      segment = "service_manual";
    } else if (location.pathname === "/main/video-query") {
      segment = "operator_handbook";
    }
    dispatch(setSegment(segment));
  }, [location.pathname, dispatch]);

  const handleCardClick = (path) => navigate(path);

  return (
    <>
      <Box sx={{ padding: 4, backgroundColor: "#f4f4f4", minHeight: "100vh", position: "relative" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          gutterBottom
          sx={{ color: "#E60000" }}
        >
          Welcome to Hero AI Platform
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 5 }} fontWeight="700">
          Choose a tool below to get started
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  onClick={() => handleCardClick(card.path)}
                  sx={{
                    cursor: "pointer",
                    background: "linear-gradient(360deg,rgb(211, 27, 27), #000000)",
                    color: "white",
                    borderRadius: "16px",
                    boxShadow: 6,
                    height: 160,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 2,
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 1 }}>{card.icon}</Box>
                    <Typography variant="h6" fontWeight="600">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Watermark */}
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: "10px 24px 10px 16px",
            borderRadius: "14px",
            boxShadow: "0 4px 16px rgba(60, 60, 60, 0.10)",
            zIndex: 1000,
            minWidth: 320,
            gap: 1,
          }}
        >
          <img
            src="/gcpartner-removebg-preview.png"
            alt="Google Cloud Partner"
            style={{
              width: "60px",
              height: "62px",
              objectFit: "contain",
              marginRight: 0,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              color: "#444",
              fontWeight: 400,
              fontSize: "1rem",
              letterSpacing: 0.1,
              lineHeight: 1.5,
            }}
          >
            Powered by <b>Atgeir Solutions</b>, <b>Google Cloud</b>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Main;
