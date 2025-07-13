// PdfViewer.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { Document, Page, pdfjs } from 'react-pdf';
import { MdClose } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaDownload } from "react-icons/fa";

// Set PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ open, pdfUrl, onClose, onNext, onPrev, hasMultipleItems }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // PDF document loading callback
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  // Navigate to previous page in PDF
  const handlePrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  // Navigate to next page in PDF
  const handleNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  // Handle PDF download
  const handleDownload = () => {
    // Create an anchor element and set the href to the PDF URL
    const link = document.createElement('a');
    link.href = pdfUrl;
    
    // Extract filename from URL or use a default name
    const fileName = pdfUrl.split('/').pop() || 'document.pdf';
    
    // Set download attribute with filename
    link.setAttribute('download', fileName);
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset when PDF changes
  React.useEffect(() => {
    if (open) {
      setPageNumber(1);
      setLoading(true);
    }
  }, [pdfUrl, open]);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (pageNumber > 1) {
          handlePrevPage();
        } else if (hasMultipleItems) {
          onPrev();
          setPageNumber(1); // Reset page number for new PDF
        }
      } else if (e.key === "ArrowRight") {
        if (pageNumber < numPages) {
          handleNextPage();
        } else if (hasMultipleItems) {
          onNext();
          setPageNumber(1); // Reset page number for new PDF
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, onNext, onPrev, hasMultipleItems, pageNumber, numPages]);

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
        <Tooltip title="Download PDF">
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

      {/* PDF Navigation Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 4,
          p: 1,
          color: "white",
          alignItems: "center",
        }}
      >
        <IconButton 
          onClick={handlePrevPage} 
          disabled={pageNumber <= 1}
          sx={{ color: "white", opacity: pageNumber <= 1 ? 0.5 : 1 }}
        >
          <IoIosArrowBack />
        </IconButton>
        <Typography sx={{ mx: 2 }}>
          Page {pageNumber} of {numPages || '?'}
        </Typography>
        <IconButton 
          onClick={handleNextPage} 
          disabled={!numPages || pageNumber >= numPages}
          sx={{ color: "white", opacity: !numPages || pageNumber >= numPages ? 0.5 : 1 }}
        >
          <IoIosArrowForward />
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
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            overflow: "auto",
          }}
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <Typography variant="h6" sx={{ color: "white" }}>
                Loading PDF...
              </Typography>
            }
            error={
              <Typography variant="h6" sx={{ color: "white" }}>
                Failed to load PDF. Please try again later.
              </Typography>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={1.2}
              loading={
                <Typography variant="body2" sx={{ color: "white" }}>
                  Loading page...
                </Typography>
              }
            />
          </Document>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;