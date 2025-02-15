import { YieldListCard } from "@/components/yield";
import { YieldListTable } from "@/components/yield";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

type View = "table" | "card";

export const YieldsList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>(
    (localStorage.getItem("yield-view") as View) || "table",
  );

  const handleViewChange = (value: View) => {
    // remove query params (pagination, filters, etc.) when changing view
    replace("");

    setView(value);
    localStorage.setItem("yield-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <Segmented<View>
          key="view"
          size="large"
          value={view}
          style={{ marginRight: 24 }}
          options={[
            {
              label: "",
              value: "table",
              icon: <UnorderedListOutlined />,
            },
            {
              label: "",
              value: "card",
              icon: <AppstoreOutlined />,
            },
          ]}
          onChange={handleViewChange}
        />,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("yield")}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          Add New Yield
        </CreateButton>,
      ]}
    >
      {view === "table" && <YieldListTable />}
      {view === "card" && <YieldListCard />}
      {children}
    </List>
  );
};