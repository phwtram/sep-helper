import { useLink } from "@refinedev/core";
import { Space, theme } from "antd";

import { BFarmLogoIcon, BFarmLogoText } from "../../components";
import { Logo } from "./styled";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = theme.useToken();
  const Link = useLink();

  return (
    <Logo>
      <Link to="/">
        {collapsed ? (
          <BFarmLogoIcon />
        ) : (
          <Space size={12}>
            <BFarmLogoIcon
              style={{
                fontSize: "32px",
                color: token.colorTextHeading,
              }}
            />
            <BFarmLogoText
              style={{
                color: token.colorTextHeading,
                width: "100%",
                height: "auto",
              }}
            />
          </Space>
        )}
      </Link>
    </Logo>
  );
};
