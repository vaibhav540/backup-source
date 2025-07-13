import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const adminEmails = [
  "genaidemo@atgeirsolutions.com",
  "ashok_leyland_demo@atgeirsolutions.com",
  "cloud_dev_test@atgeirsolutions.com",
  "ui_dev_test@atgeirsolutions.com"
];

const ProtectedRoute = ({ children, allowedRoles }) => {
  const accountDetails = useSelector((state) => state.account.accountDetails);
  if (!accountDetails?.email) {
    alert("Kindly log in to your account to continue.");
    return <Navigate to="/" replace />;
  }

  // Admin dashboard access control
  if (
    allowedRoles &&
    allowedRoles.includes("admin") &&
    (!adminEmails.includes(accountDetails.email) || accountDetails.environment !== "development")
  ) {
    alert("You are not authorized to access the Admin Dashboard.");
    return <Navigate to="/" replace />;
  }

  // if (
  //   allowedRoles &&
  //   !allowedRoles.includes(accountDetails?.account_type?.toLowerCase())
  // ) {
  //   return <Navigate to="/home" replace />;
  // }

  return children;
};

export default ProtectedRoute;