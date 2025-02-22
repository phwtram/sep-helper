import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";
import { authProvider } from "@/authProvider";

const Logout = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Gọi hàm logout từ authProvider
    authProvider.logout({}).then(() => {
      localStorage.setItem("Logout", "true"); 
      setShowAlert(true);

      setTimeout(() => {
        localStorage.removeItem("Logout");
        navigate("/login"); 
      }, 2000); 
    });
  }, [navigate]);

  return (
    <div>
      {/* ✅ Hiển thị thông báo đăng xuất */}
      {showAlert && (
        <Alert
          message="Logout Successful"
          description="You have been logged out."
          type="success"
          showIcon
          closable
          onClose={() => setShowAlert(false)}
          style={{ marginBottom: 16 }}
        />
      )}
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
