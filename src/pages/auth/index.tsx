import { useState, useEffect } from "react";
import { AuthPage as AntdAuthPage, type AuthProps } from "@refinedev/antd";
import { Flex, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BFarmLogoIcon, BFarmLogoText } from "../../components";
import { loginUser } from "../../services/authService";

const authWrapperProps = {
  style: {
    background:
      "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/login-bg.png')",
    backgroundSize: "cover",
  },
};

export const AuthPage: React.FC<AuthProps> = ({ type, formProps }) => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "info" | "warning">("info");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");

    if (loginSuccess === "true") {
      setAlertMessage("You have logged in successfully!");
      setAlertType("success");
      setShowAlert(true);
      localStorage.removeItem("loginSuccess");

      // ✅ Hiển thị `Alert` trong 700ms rồi tự động ẩn
      setTimeout(() => {
        setShowAlert(false);
        navigate("/"); // ✅ Chuyển hướng ngay sau khi Alert biến mất
      }, 700);
    }
  }, []);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await loginUser(values.email, values.password);
      
      // ✅ Lấy `accessToken` từ API
      const accessToken = response?.data?.accessToken;
      if (!accessToken) throw new Error("No access token received from server.");
  
      // ✅ Lưu vào localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", response.data.role || ""); // Lưu role nếu có
      localStorage.setItem("loginSuccess", "true"); // ✅ Dùng để hiển thị trên Dashboard
  
      setAlertMessage("You have logged in successfully!");
      setAlertType("success");
      setShowAlert(true);
  
      // ✅ Hiển thị `Alert` trong 700ms rồi chuyển trang
      setTimeout(() => {
        setShowAlert(false);
        navigate("/");
      }, 700);
    } catch (error) {
      const err = error as Error;
      setAlertMessage(err.message || "Invalid email or password");
      setAlertType("error");
      setShowAlert(true);
  
      // ✅ Hiển thị `Alert` lỗi trong 1.2 giây
      setTimeout(() => {
        setShowAlert(false);
      }, 1200);
    }
  };

  return (
    <AntdAuthPage
      type={type}
      wrapperProps={authWrapperProps}
      renderContent={(content) => (
        <div style={{ maxWidth: 408, margin: "auto" }}>
          <Link to="/">
            <Flex
              align="center"
              justify="center"
              gap={12}
              style={{ marginBottom: 16 }}
            >
              <BFarmLogoIcon style={{ width: 64, height: 64, color: "#fff" }} />
              <BFarmLogoText
                style={{ color: "#fff", width: "300px", height: "auto" }}
              />
            </Flex>
          </Link>

          {/* ✅ Hiển thị Alert nếu có thông báo */}
          {showAlert && alertMessage && (
            <Alert
              message={alertType === "success" ? "Login Successful" : "Login Failed"}
              description={alertMessage}
              type={alertType} // ✅ Đảm bảo `alertType` luôn hợp lệ
              showIcon
              closable
              onClose={() => setShowAlert(false)}
              style={{ marginBottom: 16 }}
            />
          )}

          {content}
        </div>
      )}
      formProps={{
        ...formProps,
        onFinish: handleLogin,
      }}
    />
  );
};
