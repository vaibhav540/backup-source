import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { setAccountDetails, setLogout } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function LoginPage() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [submitError, setSubmitError] = React.useState(false);
  const [SubmitErrorMessage, setSubmitErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedEnvironment, setSelectedEnvironment] = React.useState("development");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) {
      e.preventDefault();
      return;
    }
    setLoader(true);
    // setAlert("");
    e.preventDefault();
    let email = e.target.email.value.toLowerCase().trim();
    let password = e.target.password.value;

    if (
      (email == "genaidemo@atgeirsolutions.com" &&
        password == "AtgeirAdmin@1234") ||
      (email == "ashok_leyland_demo@atgeirsolutions.com" &&
        password == "@GenaiDemo9933") ||
      (email == "cloud_dev_test@atgeirsolutions.com" &&
        password == "AtgeirAdmin@1234") ||
      (email == "ui_dev_test@atgeirsolutions.com" &&
        password == "AtgeirAdmin@1234") ||
      (email == "cmvrdemo@ashokleyland.com" && password == "CMVRdemo#123") ||
      (email == "al_genai@atgeirsolutions.com" && password == "ALGenAI@123")
    ) {
      dispatch(setAccountDetails({ email, name: "Keval", environment: selectedEnvironment }));
      navigate("/main");
      setLoader(false);
    } else {
      setLoader(false);
      setSubmitError(true);
      setSubmitErrorMessage("Please enter valid account details.");
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Please Enter Valid Password");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
    setSubmitError(false);
    setSubmitErrorMessage(false);
    return isValid;
  };

  const handleEnvironmentChange = (event) => {
    setSelectedEnvironment(event.target.value);
  };

  return (
    <Card variant="outlined" sx={{ width: "350px !important" }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">Password</FormLabel>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Select environment</FormLabel>
          <RadioGroup
            row
            name="environment"
            value={selectedEnvironment}
            onChange={handleEnvironmentChange}
          >
            <FormControlLabel
              value="development"
              control={<Radio />}
              label="Development"
            />
            <FormControlLabel
              value="production"
              control={<Radio />}
              label="Production"
            />
          </RadioGroup>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
         Sign in
        </Button>
        <Typography
          variant="caption"
          component={"div"}
          color={submitError ? "error" : "primary"}
        >
          {SubmitErrorMessage}
        </Typography>
      </Box>
    </Card>
  );
}
