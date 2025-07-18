import React, { useState, useEffect } from "react";
import { 
  Box, Button, Typography, TextField, MenuItem, Select, 
  InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, 
  CircularProgress, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, useTheme, Divider, TablePagination, Paper 
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import chatService from "../services/chat.service";
import InboxIcon from '@mui/icons-material/Inbox';
import Radio from "@mui/material/Radio";
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // not used, but for reference
import RefreshIcon from '@mui/icons-material/Refresh';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

const thumbsDownReasons = [
  "Inaccurate",
  "Harmful",
  "Out of Date",
  "Too Short",
  "This isn't helpful"
];
const documentTypes = ["Service Manual", "Operator Handbook"];
const vehicleTypes = ["LCV", "MHCV"];

const AdminDashboard = () => {
  const selectedTab = useSelector((state) => state.chat.selectedTab);
    const segment = useSelector((state) => state.chat.segment);
  
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    thumbs_down_reasons: "", // single value
    document_type: "",       // single value
    vehicle_type: "",        // single value
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [noData, setNoData] = useState(false);
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [instructions, setInstructions] = useState(null);
  const [instructionsLoading, setInstructionsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [tableMinimized, setTableMinimized] = useState(false);
  // State for existing prompt
  const [existingPrompt, setExistingPrompt] = useState(null);
  const [existingPromptLoading, setExistingPromptLoading] = useState(false);
  const [existingPromptCopy, setExistingPromptCopy] = useState(false);
  // New prompt state
  const [newPrompt, setNewPrompt] = useState("");
  const [newPromptSaving, setNewPromptSaving] = useState(false);
  const [newPromptMessage, setNewPromptMessage] = useState("");

  const handleChange = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value,
    });
    // Clear dependent UI data when form changes
    setInstructions(null);
    setInstructionsLoading(false);
    setExistingPrompt(null);
    setExistingPromptLoading(false);
    setExistingPromptCopy(false);
    setNewPrompt("");
    setNewPromptSaving(false);
    setNewPromptMessage("");
  };

  console.log("i am selected tab from dashboard", selectedTab);
    console.log("i am segment from dashboard", segment);


  const isFormValid =
    form.start_date &&
    form.end_date &&
    form.thumbs_down_reasons &&
    form.document_type &&
    form.vehicle_type;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setSelectedRows([]);
    setNoData(false);
    try {
      // Convert string fields to arrays for API
      const payload = {
        ...form,
        thumbs_down_reasons: form.thumbs_down_reasons ? [form.thumbs_down_reasons] : [],
        document_type: form.document_type ? [form.document_type] : [],
        vehicle_type: form.vehicle_type ? [form.vehicle_type] : [],
      };
      const data = await chatService.getNegativeFeedback(payload, "development");
      if (data.status === "success") {
        if (Array.isArray(data.data) && data.data.length === 0) {
          setNoData(true);
        } else {
          setResults(data.data);
        }
      } else {
        setError(data.message || "No results found.");
      }
    } catch (err) {
      setError("Failed to fetch data.",err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInstructions = async () => {
    setInstructionsLoading(true);
    setInstructions(null);
    try {
      // Prepare feedback_data payload from selected rows
      const feedback_data = selectedRows.map(idx => {
        const row = results[idx];
        return {
          question: row.question,
          official_docs_responses: row.official_docs_responses,
          thumbs_down_reason: row.thumbs_down_reason,
          comment: row.comment
        };
      });
      const payload = { feedback_data };
      // Call the API
      const data = await chatService.getNegativeFeedback(payload, "development");
      if (data.generated_instructions) {
        setInstructions(data.generated_instructions);
      } else {
        setInstructions({ error: "No instructions generated." });
      }
    } catch (err) {
      setInstructions({ error: "Failed to generate instructions." });
    } finally {
      setInstructionsLoading(false);
    }
  };

  // Handle row selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = results
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((_, index) => page * rowsPerPage + index);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (event, index) => {
    const selectedIndex = selectedRows.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, index];
    } else {
      newSelected = selectedRows.filter((i) => i !== index);
    }

    setSelectedRows(newSelected);
  };

  const handleExplore = () => {
    // Implement your logic for explore here
    alert("Explore selected rows:\n" + JSON.stringify(selectedRows.map(idx => results[idx]), null, 2));
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Ref for scroll-to-bottom anchor for results
  const resultsEndRef = React.useRef(null);
  // Reset selection when results change
  useEffect(() => {
    setSelectedRows([]);
    setPage(0);
    // Scroll to bottom when results change (for any fetches)
    if (results && results.length > 0 && resultsEndRef.current) {
      resultsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);

  // Scroll to bottom for generated instructions
  const instructionsEndRef = React.useRef(null);
  useEffect(() => {
    if (instructions && instructionsEndRef.current) {
      instructionsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [instructions]);

  // Scroll to bottom for existing/new prompt
  const promptEndRef = React.useRef(null);
  useEffect(() => {
    if (existingPrompt && promptEndRef.current) {
      promptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [existingPrompt]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.mode === 'dark' ? '#181a1b' : '#f4f7fa' }}>
      <Navbar />
      {/* Selection Bar */}
      {selectedRows.length > 0 && (
        <Box
          sx={{
            width: '100%',
            bgcolor: theme.palette.mode === 'dark' ? '#495156' : '#eaf6fd',
            borderBottom: '1px solid #0089cf',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 1.5,
            position: 'sticky',
            top: 0,
            zIndex: 1201,
            boxShadow: 1,
            mb: 2,
          }}
        >
          <CloseIcon
            sx={{ color: '#0089cf', cursor: 'pointer', mr: 2 }}
            onClick={() => {
              setSelectedRows([]);
              setInstructions(null);
              setExistingPrompt(null);
    setExistingPromptLoading(false);
    setExistingPromptCopy(false);
    setNewPrompt("");
    setNewPromptSaving(false);
    setNewPromptMessage("");
            }}
          />
          <Typography sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? 'white' : 'black', mr: 3 }}>
            {selectedRows.length} field{selectedRows.length > 1 ? 's' : ''} selected
          </Typography>
          <Button
            variant="text"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 600, color: '#0089cf', mr: 2, display: 'flex', alignItems: 'center' }}
            onClick={handleGenerateInstructions}
            startIcon={<TouchAppIcon sx={{ color: '#0089cf' }} />}
            disabled={instructionsLoading}
          >
            {instructionsLoading ? "Generating..." : "Generate Instructions"}
          </Button>
          <Button
            variant="text"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 600, color: '#0089cf', display: 'flex', alignItems: 'center' }}
            onClick={handleExplore}
            startIcon={<TravelExploreIcon sx={{ color: '#0089cf' }} />}
            disabled={instructionsLoading}
          >
            Explore
          </Button>
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', pt: 2, minHeight: '100vh', maxWidth: 1300, mx: 'auto', width: '100%' }}>
        <Typography variant="h5" fontWeight={600} color="primary" gutterBottom align="left">
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="left" sx={{ mb: 3 }}>
          View and analyze negative feedback from users. Use the filters below to fetch feedback data.
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "flex-start", mb: 0 }}>
            <TextField
              type="date"
              value={form.start_date}
              onChange={handleChange("start_date")}
              size="small"
              sx={{ minWidth: 150 }}
              placeholder="Start Date"
              InputLabelProps={{ shrink: false }}
              label=""
            />
            <TextField
              type="date"
              value={form.end_date}
              onChange={handleChange("end_date")}
              size="small"
              sx={{ minWidth: 150 }}
              placeholder="End Date"
              InputLabelProps={{ shrink: false }}
              label=""
            />
            <FormControl sx={{ minWidth: 220 }} size="small">
              <Select
                displayEmpty
                value={form.thumbs_down_reasons}
                onChange={handleChange("thumbs_down_reasons")}
                input={<OutlinedInput placeholder="Thumbs Down Reasons" />}
                renderValue={(selected) =>
                  !selected ? "Thumbs Down Reasons" : selected
                }
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                <MenuItem value="">
                  <span style={{ fontWeight: 700, color: '#0089cf', fontStyle: 'normal' }}>Thumbs Down Reasons</span>
                </MenuItem>
                {thumbsDownReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    <Radio
                      checked={form.thumbs_down_reasons === reason}
                      value={reason}
                      sx={{ p: 0.5, mr: 1 }}
                    />
                    <ListItemText primary={reason} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <Select
                displayEmpty
                value={form.document_type}
                onChange={handleChange("document_type")}
                input={<OutlinedInput placeholder="Document Type" />}
                renderValue={(selected) =>
                  !selected ? "Document Type" : selected
                }
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                <MenuItem value="">
                  <span style={{ fontWeight: 700, color: '#0089cf', fontStyle: 'normal' }}>Document Type</span>
                </MenuItem>
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Radio
                      checked={form.document_type === type}
                      value={type}
                      sx={{ p: 0.5, mr: 1 }}
                    />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <Select
                displayEmpty
                value={form.vehicle_type}
                onChange={handleChange("vehicle_type")}
                input={<OutlinedInput placeholder="Vehicle Type" />}
                renderValue={(selected) =>
                  !selected ? "Vehicle Type" : selected
                }
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                <MenuItem value="">
                  <span style={{ fontWeight: 700, color: '#0089cf', fontStyle: 'normal' }}>Vehicle Type</span>
                </MenuItem>
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Radio
                      checked={form.vehicle_type === type}
                      value={type}
                      sx={{ p: 0.5, mr: 1 }}
                    />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-start' }}>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              disabled={!isFormValid || loading}
              sx={{
                minWidth: 120,
                fontWeight: 600,
                ...( (!isFormValid || loading) && {
                  bgcolor: theme => theme.palette.action.disabledBackground,
                  color: theme => theme.palette.text.disabled,
                  borderColor: theme => theme.palette.action.disabled,
                })
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setForm({ start_date: "", end_date: "", thumbs_down_reasons: "", document_type: "", vehicle_type: "" });
                setResults([]);
                setSelectedRows([]);
                setError("");
              }}
              disabled={loading}
              sx={{ minWidth: 100, fontWeight: 600 }}
            >
              Reset
            </Button>
          </Box>
        </form>
        <Divider sx={{ my: 3, width: '100%' }} />
       
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        {noData && (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
            <InboxIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              No Data Available
            </Typography>
          </Box>
        )}

        {results.length > 0 && (
          <Paper elevation={3} sx={{ 
            mt: 2, 
            borderRadius: 3, 
            overflow: 'hidden',
            width: '100%',
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Minimize/Maximize Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1, bgcolor: theme.palette.mode === 'dark' ? '#23272b' : '#e3f2fd', borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={tableMinimized ? <AddIcon /> : <RemoveIcon />}
                onClick={() => setTableMinimized((prev) => !prev)}
                sx={{ minWidth: 0, px: 1, fontWeight: 600 }}
              >
                {tableMinimized ? "Maximize Table" : "Minimize Table"}
              </Button>
            </Box>
            {/* Table and content */}
            {!tableMinimized && (
              <>
                <TableContainer 
                  sx={{ 
                    maxHeight: '70vh',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px',
                      backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      borderRadius: '4px',
                      backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#888' : '#aaa',
                    }
                  }}
                >
                  <Table 
                    size="small" 
                    sx={{
                      tableLayout: 'fixed'
                    }}
                    stickyHeader
                  >
                    <TableHead sx={{ 
                      background: theme.palette.mode === 'dark' ? '#23272b' : '#e3f2fd',
                    }}>
                      <TableRow>
                        <TableCell padding="checkbox" sx={{ border: `1px solid ${theme.palette.divider}`, width: '5%', minWidth: '32px', maxWidth: '40px', textAlign: 'center', p: 0.5, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                          <Checkbox
                            color="primary"
                            indeterminate={selectedRows.length > 0 && selectedRows.length < Math.min(rowsPerPage, results.length)}
                            checked={results.length > 0 && selectedRows.length === Math.min(rowsPerPage, results.length)}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, color: '#0089cf', fontStyle: 'normal', width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Question</TableCell>
                        <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, color: '#0089cf', fontStyle: 'normal', width: '20%', minWidth: '120px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Official Docs Responses</TableCell>
                        <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, color: '#0089cf', fontStyle: 'normal', width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Thumbs Down Reason</TableCell>
                        <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, color: '#0089cf', fontStyle: 'normal', width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Comment</TableCell>
                        <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, color: '#0089cf', fontStyle: 'normal', width: '10%', minWidth: '80px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Document Type</TableCell>
                        <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, color: '#0089cf', fontStyle: 'normal', width: '10%', minWidth: '80px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Vehicle Type</TableCell>
                        <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, color: '#0089cf', fontStyle: 'normal', width: '10%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word', textAlign: 'center' }}>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          const absoluteIndex = page * rowsPerPage + index;
                          const isItemSelected = selectedRows.indexOf(absoluteIndex) !== -1;
                          
                          return (
                            <TableRow 
                              key={absoluteIndex} 
                              hover
                              selected={isItemSelected}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.08)' 
                                    : 'rgba(0, 0, 0, 0.04)' 
                                },
                                '&.Mui-selected': {
                                  backgroundColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(25, 118, 210, 0.2)' 
                                    : 'rgba(25, 118, 210, 0.08)'
                                }
                              }}
                            >
                              <TableCell 
                                padding="checkbox"
                                sx={{ border: `1px solid ${theme.palette.divider}`, width: '5%', minWidth: '32px', maxWidth: '40px', textAlign: 'center', p: 0.5, whiteSpace: 'pre-line', wordBreak: 'break-word' }}
                              >
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  onChange={(event) => handleRowSelect(event, absoluteIndex)}
                                />
                              </TableCell>
                              <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{row.question}</TableCell>
                              <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, width: '20%', minWidth: '120px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word', p: 1 }}>
                                <Box sx={{ maxHeight: 150, overflowY: 'auto', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', p: 1 }}>
                                  {row.official_docs_responses}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{row.thumbs_down_reason}</TableCell>
                              <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{row.comment}</TableCell>
                              <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, width: '10%', minWidth: '80px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{row.document_type}</TableCell>
                              <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, width: '10%', minWidth: '80px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{row.vehicle_type}</TableCell>
                              <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, width: '10%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word', textAlign: 'center' }}>{row.created_at}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={results.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    position: 'sticky',
                    bottom: 0
                  }}
                />
              </>
            )}
          </Paper>
        )}
        {/* Instructions Box - always below the table, styled separately */}
        {instructions && (
          <Paper
            elevation={4}
            sx={{
              mt: 4,
              mb: 2,
              width: '100%',
              borderRadius: 3,
              border: `1.5px solid ${theme.palette.primary.light}`,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #23272b 60%, #1e293b 100%)'
                : 'linear-gradient(90deg, #e3f2fd 60%, #f8fafc 100%)',
              boxShadow: '0 4px 24px 0 rgba(0,140,255,0.08)',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              position: 'relative'
            }}
          >
            {/* "View Existing Prompt" Button at top right */}
            <Button
              variant="outlined"
              size="small"
              sx={{
                position: 'absolute',
                top: 20,
                right: 24,
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: '#eaf6fd',
                color: '#0071a8',
                borderColor: '#b6e0fe',
                boxShadow: 'none',
                zIndex: 2,
                '&:hover': {
                  backgroundColor: '#d2ecfc',
                  borderColor: '#90cdf4',
                  color: '#005b8a',
                },
              }}
              disabled={existingPromptLoading || !form.document_type || !form.vehicle_type}
              onClick={async () => {
                setExistingPromptLoading(true);
                setExistingPrompt(null);
                setExistingPromptCopy(false);
                try {
                  // Only call if both dropdowns are selected
                  if (!form.document_type || !form.vehicle_type) {
                    setExistingPrompt({ error: 'Please select Document Type and Vehicle Type.' });
                    setExistingPromptLoading(false);
                    return;
                  }
                  const payload = {
                    document_type: form.document_type,
                    vehicle_type: form.vehicle_type
                  };
                  const data = await chatService.getNegativeFeedback(payload, "development");
                  if (data && data.existing_prompt) {
                    setExistingPrompt(data);
                  } else {
                    setExistingPrompt({ error: 'No existing prompt found.' });
                  }
                } catch (err) {
                  setExistingPrompt({ error: 'Failed to fetch existing prompt.' });
                } finally {
                  setExistingPromptLoading(false);
                }
              }}
            >
              {existingPromptLoading ? 'Loading...' : 'View Existing Prompt'}
            </Button>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2,
                letterSpacing: 0.5,
                textShadow: '0 1px 2px rgba(0,140,255,0.08)'
              }}
            >
              Generated Instructions
            </Typography>
            {instructions.error ? (
              <Typography color="error" sx={{ fontWeight: 600, fontSize: 16 }}>
                {instructions.error}
              </Typography>
            ) : (
              <TableContainer sx={{ width: '100%', background: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#0089cf", width: 80, background: 'transparent', border: 'none' }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#0089cf", background: 'transparent', border: 'none' }}>Instruction</TableCell>
                      <TableCell sx={{ width: 40, background: 'transparent', border: 'none' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(instructions).map(([key, value], idx) => (
                      <TableRow key={key} sx={{ background: 'transparent' }}>
                        <TableCell sx={{ fontWeight: 600, border: 'none' }}>{idx + 1}</TableCell>
                        <TableCell sx={{
                          border: 'none',
                          fontSize: 15,
                          color: theme.palette.mode === 'dark' ? '#e3f2fd' : '#222',
                          background: 'transparent',
                          p: 1.5,
                          borderRadius: 2,
                          boxShadow: '0 1px 4px 0 rgba(0,140,255,0.04)'
                        }}>
                          {value}
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{
                              minWidth: 0,
                              px: 1,
                              borderRadius: 2,
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: theme.palette.primary.light,
                                borderColor: theme.palette.primary.dark,
                              }
                            }}
                            onClick={async () => {
                              if (navigator && navigator.clipboard) {
                                await navigator.clipboard.writeText(value);
                                setCopiedIdx(idx);
                                setTimeout(() => setCopiedIdx(null), 1200);
                              }
                            }}
                            title="Copy"
                          >
                            <ContentCopyIcon fontSize="small" />
                          </Button>
                          {copiedIdx === idx && (
                            <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                              Copied!
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}
        {/* Existing Prompt & New Prompt - side by side, new prompt only visible after view existing prompt */}
      {existingPrompt && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 3,
      width: '100%',
      mt: 2,
      mb: 2,
      alignItems: 'stretch', // Key line for equal height
    }}
  >
    {/* Existing Prompt Box */}
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1.5px solid ${theme.palette.primary.light}`,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #23272b 60%, #1e293b 100%)'
            : 'linear-gradient(90deg, #e3f2fd 60%, #f8fafc 100%)',
          boxShadow: '0 4px 24px 0 rgba(0,140,255,0.08)',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          position: 'relative',
          height: '100%',
          flex: 1
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2,
            letterSpacing: 0.5,
            textShadow: '0 1px 2px rgba(0,140,255,0.08)'
          }}
        >
          Existing Prompt
        </Typography>
        {existingPrompt.error ? (
          <Typography color="error" sx={{ fontWeight: 600, fontSize: 16 }}>
            {existingPrompt.error}
          </Typography>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#e3f2fd' : '#222', fontSize: 15, mb: 1 }}>
              {existingPrompt.existing_prompt}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Version: {existingPrompt.version || '-'} | Created: {existingPrompt.created_date ? new Date(existingPrompt.created_date).toLocaleString() : '-'}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{
                  minWidth: 0,
                  px: 1,
                  borderRadius: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  ml: 2,
                  '&:hover': {
                    bgcolor: theme.palette.primary.light,
                    borderColor: theme.palette.primary.dark,
                  }
                }}
                onClick={async () => {
                  if (navigator && navigator.clipboard && existingPrompt.existing_prompt) {
                    await navigator.clipboard.writeText(existingPrompt.existing_prompt);
                    setExistingPromptCopy(true);
                    setTimeout(() => setExistingPromptCopy(false), 1200);
                  }
                }}
                title="Copy"
              >
                <ContentCopyIcon fontSize="small" />
              </Button>
              {/* Refresh Button */}
              <Button
                size="small"
                variant="outlined"
                sx={{
                  minWidth: 0,
                  px: 1,
                  borderRadius: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  ml: 1,
                  '&:hover': {
                    bgcolor: theme.palette.primary.light,
                    borderColor: theme.palette.primary.dark,
                  }
                }}
                onClick={async () => {
                  setExistingPromptLoading(true);
                  setExistingPromptCopy(false);
                  try {
                    if (!form.document_type || !form.vehicle_type) {
                      setExistingPrompt({ error: 'Please select Document Type and Vehicle Type.' });
                      setExistingPromptLoading(false);
                      return;
                    }
                    const payload = {
                      document_type: form.document_type,
                      vehicle_type: form.vehicle_type
                    };
                    const data = await chatService.getNegativeFeedback(payload, "development");
                    if (data && data.existing_prompt) {
                      setExistingPrompt(data);
                    } else {
                      setExistingPrompt({ error: 'No existing prompt found.' });
                    }
                  } catch (err) {
                    setExistingPrompt({ error: 'Failed to fetch existing prompt.' });
                  } finally {
                    setExistingPromptLoading(false);
                  }
                }}
                title="Refresh"
                disabled={existingPromptLoading}
              >
                <RefreshIcon fontSize="small" />
              </Button>
              {/* End Refresh Button */}
              {existingPromptCopy && (
                <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                  Copied!
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>

    {/* New Prompt Box */}
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1.5px solid ${theme.palette.primary.light}`,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #23272b 60%, #1e293b 100%)'
            : 'linear-gradient(90deg, #e3f2fd 60%, #f8fafc 100%)',
          boxShadow: '0 4px 24px 0 rgba(0,140,255,0.08)',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          position: 'relative',
          height: '100%',
          flex: 1
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2,
            letterSpacing: 0.5,
            textShadow: '0 1px 2px rgba(0,140,255,0.08)'
          }}
        >
          New Prompt
        </Typography>
        <Box
          sx={{
            width: '100%',
            maxWidth: 700,
            minWidth: 280,
            flexGrow: 1,
            background: theme.palette.mode === 'dark' ? '#23272b' : '#fff',
            borderRadius: 2,
            border: '1px solid',
            borderColor: theme.palette.divider,
            p: 2,
            fontSize: 15,
            fontWeight: 500,
            color: theme.palette.mode === 'dark' ? '#e3f2fd' : '#222',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'border-color 0.2s',
            cursor: newPromptSaving ? 'not-allowed' : 'text',
          }}
          contentEditable={!newPromptSaving}
          suppressContentEditableWarning
          spellCheck={true}
          onInput={e => setNewPrompt(e.currentTarget.innerText)}
          onBlur={e => setNewPrompt(e.currentTarget.innerText)}
          tabIndex={0}
          aria-label="Write your new prompt here..."
          role="textbox"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end', mt: 'auto' }}>
          {newPromptMessage && (
            <Typography variant="body2" color={newPromptMessage.includes('success') ? 'success.main' : 'error'} sx={{ mr: 2, fontWeight: 600 }}>
              {newPromptMessage}
            </Typography>
          )}
          <Button
            variant="outlined"
            sx={{
              minWidth: 100,
              fontWeight: 600,
              backgroundColor: '#eaf6fd',
              color: '#0071a8',
              borderColor: '#b6e0fe',
              boxShadow: 'none',
              cursor: newPromptSaving || !form.document_type || !form.vehicle_type || !newPrompt.trim() ? 'not-allowed' : 'pointer',
              '&:hover': {
                backgroundColor: '#d2ecfc',
                borderColor: '#90cdf4',
                color: '#005b8a',
              },
              ...(newPromptSaving || !form.document_type || !form.vehicle_type || !newPrompt.trim() ? {
                backgroundColor: theme => theme.palette.action.disabledBackground,
                color: theme => theme.palette.text.disabled,
                borderColor: theme => theme.palette.action.disabled,
              } : {})
            }}
            disabled={newPromptSaving || !form.document_type || !form.vehicle_type || !newPrompt.trim()}
            onClick={async () => {
              setNewPromptSaving(true);
              setNewPromptMessage("");
              try {
                if (!form.document_type || !form.vehicle_type) {
                  setNewPromptMessage("Please select Document Type and Vehicle Type.");
                  setNewPromptSaving(false);
                  return;
                }
                if (!newPrompt.trim()) {
                  setNewPromptMessage("Prompt cannot be empty.");
                  setNewPromptSaving(false);
                  return;
                }
                const payload = {
                  document_type: form.document_type,
                  vehicle_type: form.vehicle_type,
                  new_prompt: newPrompt.trim()
                };
                const data = await chatService.getNegativeFeedback(payload, "development");
                if (data && data.message) {
                  setNewPromptMessage(data.message + (data.version ? ` (Version: ${data.version})` : ""));
                  setNewPrompt(""); // Clear the editable area after successful save
                  // Remove the success message after 6 seconds
                  setTimeout(() => setNewPromptMessage(""), 6000);
                } else {
                  setNewPromptMessage("Failed to save prompt.");
                }
              } catch (err) {
                setNewPromptMessage("Failed to save prompt.");
              } finally {
                setNewPromptSaving(false);
                
              }
            }}
          >
            {newPromptSaving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Box>
  </Box>
)}

        
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: '50px',
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <CircularProgress size={40} color="primary" />
          </Box>
        )}
      </Box>
      {/* Scroll-to-bottom anchor for results */}
      <div ref={resultsEndRef} />
      {/* Scroll-to-bottom anchor for instructions */}
      {instructions && <div ref={instructionsEndRef} />}
      {/* Scroll-to-bottom anchor for existing/new prompt */}
      {existingPrompt && <div ref={promptEndRef} />}
    </Box>
  );
};

export default AdminDashboard;