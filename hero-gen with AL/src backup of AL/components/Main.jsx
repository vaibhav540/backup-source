// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import DescriptionIcon from "@mui/icons-material/Description";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { motion } from "framer-motion";
// import { setSegment } from "../redux/actions";

// const cardData = [
//   {
//     title: "Service Manual",
//     path: "/main/service-manual",
//     icon: <DescriptionIcon sx={{ fontSize: 32, color: "#ffffff" }} />,
//     backgroundColor: "#44576D",
//     textColor: "#ffffff",
//   },
//   {
//     title: "Operator Handbook",
//     path: "/main/operator-handbook",
//     icon: <MenuBookIcon sx={{ fontSize: 32, color: "#ffffff" }} />,
//     backgroundColor: "#AAC7D8",
//     textColor: "#ffffff",
//   },
// ];

// const Main = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const theme = useTheme();
//   const [lastPathname, setLastPathname] = useState(location.pathname);

//   // ✅ Preserve hard refresh logic
//   useEffect(() => {
//     if (location.pathname !== lastPathname) {
//       sessionStorage.setItem("shouldHardRefresh", "true");
//       sessionStorage.setItem("lastPathname", location.pathname);
//       window.location.reload();
//     }
//   }, [location.pathname, lastPathname]);

//   // ✅ Restore session
//   useEffect(() => {
//     const shouldHardRefresh = sessionStorage.getItem("shouldHardRefresh") === "true";
//     const storedPath = sessionStorage.getItem("lastPathname");
//     if (shouldHardRefresh && storedPath === location.pathname) {
//       sessionStorage.removeItem("shouldHardRefresh");
//       setLastPathname(location.pathname);
//     }
//   }, [location.pathname]);

//   // ✅ Redux segment setup
//   useEffect(() => {
//     let segment = "";
//     if (location.pathname === "/main/service-manual") {
//       segment = "service_manual";
//     } else if (location.pathname === "/main/operator-handbook") {
//       segment = "operator_handbook";
//     }
//     dispatch(setSegment(segment));
//   }, [location.pathname, dispatch]);

//   const handleCardClick = (path) => {
//     navigate(path);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 4,
//         mt: 4,
//       }}
//     >
//       {cardData.map((card, idx) => (
//         <motion.div
//           key={card.title}
//           initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: idx * 0.2, duration: 0.5, ease: "easeOut" }}
//           style={{ width: "100%", maxWidth: 360, cursor: "pointer" }}
//           onClick={() => handleCardClick(card.path)}
//         >
//           <Card
//             sx={{
//               height: 100,
//               borderRadius: 4,
//               backgroundColor: card.backgroundColor,
//               boxShadow:
//                 theme.palette.mode === "light"
//                   ? "0 4px 20px rgba(0, 0, 0, 0.1)"
//                   : "0 4px 20px rgba(0, 0, 0, 0.5)",
//               transition: "transform 0.3s, box-shadow 0.3s",
//               display: "flex",
//               alignItems: "center",
//               '&:hover': {
//                 transform: "scale(1.03)",
//                 boxShadow:
//                   theme.palette.mode === "light"
//                     ? "0 8px 24px rgba(0, 0, 0, 0.15)"
//                     : "0 8px 30px rgba(0, 0, 0, 0.7)",
//               },
//             }}
//           >
//             <CardContent
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 px: 3,
//               }}
//             >
//               {card.icon}
//               <Box>
//                 <Typography
//                   variant="h6"
//                   sx={{ fontWeight: 600, color: card.textColor }}
//                 >
//                   {card.title}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: card.textColor,
//                     opacity: 0.85,
//                     fontSize: "0.75rem",
//                   }}
//                 >
//                   AI-powered document search
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </motion.div>
//       ))}
//     </Box>
//   );
// };

// export default Main;


import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Container,
  Grid,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setSegment } from "../redux/actions";

const cardData = [
  {
    title: "Service Literature",
    path: "/main/service-manual",
    icon: <DescriptionIcon sx={{ fontSize: 30, color: "#ffffff" }} />,
    backgroundColor: "#54b0dd",
    textColor: "#ffffff",
    animationDirection: -1,
  },
  {
    title: "Operator Handbook",
    path: "/main/operator-handbook",
    icon: <MenuBookIcon sx={{ fontSize: 30, color: "#ffffff" }} />,
    backgroundColor: "#41758e",
    textColor: "#ffffff",
    animationDirection: 1,
  },
];

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const [lastPathname, setLastPathname] = useState(location.pathname);

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
    if (location.pathname === "/main/service-manual") {
      segment = "service_manual";
    } else if (location.pathname === "/main/operator-handbook") {
      segment = "operator_handbook";
    }
    dispatch(setSegment(segment));
  }, [location.pathname, dispatch]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 0,
        gap: 8,
        overflowY: 'hidden',
      }}
    >
      {/* Welcome Section */}
      <motion.div
        key="welcome"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: "center", maxWidth: "100%", marginBottom: 8 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 0.5,
            letterSpacing: "0.5px",
          }}
        >
          👋 I am AskAI,
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            fontSize: "1.1rem",
            color: "#105172",
            textTransform: "uppercase",
            letterSpacing: "1px",
            px: 2,
            mt: 0.2,
            mb: 0.5,
          }}
        >
          your digital co-pilot for Ashok Leyland Service Literature & Operator Handbook queries.
        </Typography>
        <Box
          sx={{
            height: "4px",
            width: "60%",
            mx: "auto",
            mt: 0.5,
            background: "linear-gradient(to right, #0072ff, #00c6ff)",
            borderRadius: "2px",
          }}
        />
      </motion.div>

      {/* Cards */}
      <Grid container spacing={4} justifyContent="center">
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} md={6} key={card.title}>
            <motion.div
              initial={{ opacity: 0, x: 100 * card.animationDirection }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick(card.path)}
            >
              <Card
                sx={{
                  height: 150,
                  borderRadius: 4,
                  backgroundColor: card.backgroundColor,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.3s",
                  overflow: "hidden",
                  position: "relative",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    px: 3,
                    py: 3,
                    zIndex: 1,
                  }}
                >
                  {card.icon}
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: card.textColor, textAlign: "center" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: card.textColor,
                      opacity: 0.9,
                      fontSize: "0.85rem",
                      textAlign: "center",
                      maxWidth: "80%",
                    }}
                  >
                    AI-powered intelligent document search
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Main;
