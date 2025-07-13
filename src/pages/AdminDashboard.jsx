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
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    thumbs_down_reasons: [],
    document_type: [],
    vehicle_type: [],
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChange = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value,
    });
  };

  const isFormValid =
    form.start_date &&
    form.end_date &&
    form.thumbs_down_reasons.length > 0 &&
    form.document_type.length > 0 &&
    form.vehicle_type.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setSelectedRows([]);
    try {
      const data = await chatService.getNegativeFeedback(form, "development");
      if (data.status === "success") {
        setResults(data.data);
      } else {
        setError(data.message || "No results found.");
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset selection when results change
  useEffect(() => {
    setSelectedRows([]);
    setPage(0);
  }, [results]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.mode === 'dark' ? '#181a1b' : '#f4f7fa' }}>
      <Navbar />
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
                multiple
                displayEmpty
                value={form.thumbs_down_reasons}
                onChange={handleChange("thumbs_down_reasons")}
                input={<OutlinedInput placeholder="Thumbs Down Reasons" />}
                renderValue={(selected) =>
                  selected.length === 0 ? "Thumbs Down Reasons" : selected.join(", ")
                }
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                {thumbsDownReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    <Checkbox checked={form.thumbs_down_reasons.indexOf(reason) > -1} />
                    <ListItemText primary={reason} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <Select
                multiple
                displayEmpty
                value={form.document_type}
                onChange={handleChange("document_type")}
                input={<OutlinedInput placeholder="Document Type" />}
                renderValue={(selected) =>
                  selected.length === 0 ? "Document Type" : selected.join(", ")
                }
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={form.document_type.indexOf(type) > -1} />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <Select
                multiple
                displayEmpty
                value={form.vehicle_type}
                onChange={handleChange("vehicle_type")}
                input={<OutlinedInput placeholder="Vehicle Type" />}
                renderValue={(selected) =>
                  selected.length === 0 ? "Vehicle Type" : selected.join(", ")
                }
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={form.vehicle_type.indexOf(type) > -1} />
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
                setForm({ start_date: "", end_date: "", thumbs_down_reasons: [], document_type: [], vehicle_type: [] });
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
                    <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Question</TableCell>
                    <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, width: '20%', minWidth: '120px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Official Docs Responses</TableCell>
                    <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Thumbs Down Reason</TableCell>
                    <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, width: '15%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Comment</TableCell>
                    <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, width: '10%', minWidth: '80px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Document Type</TableCell>
                    <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, width: '10%', minWidth: '80px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>Vehicle Type</TableCell>
                    <TableCell sx={{ border: `1px solid ${theme.palette.divider}`, fontWeight: 700, width: '10%', minWidth: '100px', maxWidth: '1fr', whiteSpace: 'pre-line', wordBreak: 'break-word', textAlign: 'center' }}>Created At</TableCell>
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
          </Paper>
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
    </Box>
  );
};

export default AdminDashboard;