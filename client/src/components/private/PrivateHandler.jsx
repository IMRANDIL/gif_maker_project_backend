import { Navigate } from "react-router-dom";

export const PrivateHandler = (props) => {
    const token = localStorage.getItem("token");
  
    if (token) {
      return props.children;
    } else {
      return <Navigate to="/login" />;
    }
  };