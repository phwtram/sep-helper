import { AuthPage as AntdAuthPage, type AuthProps } from "@refinedev/antd";
import { Flex, notification } from "antd";
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

const renderAuthContent = (content: React.ReactNode) => {
  return (
    <div
      style={{
        maxWidth: 408,
        margin: "auto",
      }}
    >
      <Link to="/">
        <Flex
          align="center"
          justify="center"
          gap={12}
          style={{
            marginBottom: 16,
          }}
        >
          <BFarmLogoIcon
            style={{
              width: 64,
              height: 64,
              color: "#fff",
            }}
          />
          <BFarmLogoText
            style={{
              color: "#fff",
              width: "300px",
              height: "auto",
            }}
          />
        </Flex>
      </Link>
      {content}
    </div>
  );
};

export const AuthPage: React.FC<AuthProps> = ({ type, formProps }) => {
  const navigate = useNavigate(); // Điều hướng sau khi login

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const data = await loginUser(values.email, values.password);
      localStorage.setItem("token", data.token); // Lưu token vào localStorage

      notification.success({
        message: "Login Successful",
        description: "You have logged in successfully!",
      });

      navigate("/dashboard"); // Chuyển đến trang Dashboard sau khi đăng nhập
    } catch (error) {
      const err = error as Error; // 🔹 Ép kiểu `error` thành `Error`
      notification.error({
        message: "Login Failed",
        description: err.message || "Invalid email or password",
      });
    }
  };

  return (
    <AntdAuthPage
      type={type}
      wrapperProps={authWrapperProps}
      renderContent={renderAuthContent}
      formProps={{
        ...formProps,
        onFinish: handleLogin, // Gọi API khi nhấn nút Login
      }}
    />
  );
};
