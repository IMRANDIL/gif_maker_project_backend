import { Navigate } from "react-router-dom";

export const PrivateHandler = (props) => {
    const token = localStorage.getItem("token");
    const paymentVerified = localStorage.getItem("paymentVerified");
    const paymentCompleted = localStorage.getItem("paymentCompleted");
  
    if (token && !paymentVerified && !paymentCompleted) {
      return props.children;
    } else {
      return <Navigate to="/login" />;
    }
  };

  export const PrivateHomeHandler = (props) => {
    const token = localStorage.getItem("token");
    const paymentVerified = localStorage.getItem("paymentVerified");
    const paymentCompleted = localStorage.getItem("paymentCompleted");
  
    if (token && paymentVerified && paymentCompleted) {
      return props.children;
    } else {
      return <Navigate to="/login" />;
    }
  };

