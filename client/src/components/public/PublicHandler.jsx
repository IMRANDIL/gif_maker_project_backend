import React from "react";
import { Navigate } from "react-router-dom";

export const PublicHandler = (props) => {
    const token = localStorage.getItem("token");
  
    if (token) {
      return <Navigate to="/" />;
    } else {
      return props.children;
    }
  };