import { SeedListCard } from "@/components/seed";
import { SeedsListTable } from "@/components/seed";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

type View = "table" | "card";

export const SeedsList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>(
    (localStorage.getItem("seed-view") as View) || "table",
  );

  const handleViewChange = (value: View) => {
    // remove query params (pagination, filters, etc.) when changing view
    replace("");

    setView(value);
    localStorage.setItem("seed-view", value);
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
              to: `${createUrl("seed")}`,
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
          Add New Seed
        </CreateButton>,
      ]}
    >
      {view === "table" && <SeedsListTable />}
      {view === "card" && <SeedListCard />}
      {children}
    </List>
  );
};