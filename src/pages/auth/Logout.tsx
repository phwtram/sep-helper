import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authProvider } from "@/authProvider";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authProvider.logout({}).then(() => { 
      navigate("/login");
    });
  }, []);

  return <p>Logging out...</p>;
};

export default Logout;
