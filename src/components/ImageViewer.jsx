// ImageViewer.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MdClose } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BiReset } from "react-icons/bi";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";

const ImageViewer = ({ open, imageUrl, onClose, onNext, onPrev, hasMultipleItems }) => {
  // Handle keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultipleItems) {
        onPrev();
      } else if (e.key === "ArrowRight" && hasMultipleItems) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, onNext, onPrev, hasMultipleItems]);

  // Handle image download
  const handleDownload = () => {
    // Create an anchor element and set the href to the image URL
    const link = document.createElement('a');
    link.href = imageUrl;
    
    // Extract filename from URL or use a default name
    const fileName = imageUrl.split('/').pop() || 'image.jpg';
    
    // Set download attribute with filename
    link.setAttribute('download', fileName);
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "rgba(0, 0, 0, 0.53)",
          margin: 0,
        },
      }}
    >
      {/* Top controls row */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          gap: 2,
        }}
      >
        {/* Download Button */}
        <Tooltip title="Download Image">
          <IconButton
            onClick={handleDownload}
            sx={{
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <FaDownload size={20} />
          </IconButton>
        </Tooltip>
        
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <MdClose size={24} />
        </IconButton>
      </Box>

      {/* Previous item button - only for multiple items */}
      {hasMultipleItems && (
        <IconButton
          onClick={onPrev}
          sx={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <IoIosArrowBack size={30} />
        </IconButton>
      )}

      {/* Next item button - only for multiple items */}
      {hasMultipleItems && (
        <IconButton
          onClick={onNext}
          sx={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <IoIosArrowForward size={30} />
        </IconButton>
      )}

      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          p: 0,
        }}
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          centerOnInit
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  display: "flex",
                  backgroundColor: "rgba(0, 0, 0, 0.28)",
                  borderRadius: 4,
                  p: 1,
                }}
              >
                <IconButton onClick={() => zoomOut()} sx={{ color: "white" }}>
                  <AiOutlineZoomOut />
                </IconButton>
                <IconButton
                  onClick={() => resetTransform()}
                  sx={{ color: "white" }}
                >
                  <BiReset />
                </IconButton>
                <IconButton onClick={() => zoomIn()} sx={{ color: "white" }}>
                  <AiOutlineZoomIn />
                </IconButton>
              </Box>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <img
                  src={imageUrl}
                  alt="Fullscreen Preview"
                  style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                    display: "block",
                    margin: "auto",
                  }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;