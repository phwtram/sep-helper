import { useSimpleList } from "@refinedev/antd";
import {
  type HttpError,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";

import {
  Card,
  Divider,
  Flex,
  List,
  Tag,
  Typography,
  theme,
} from "antd";

import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { ISeed } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { useStyles } from "./styled";

export const SeedListCard = () => {
  const { token } = theme.useToken();
  const { styles, cx } = useStyles();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { listProps } = useSimpleList<ISeed, HttpError>({
    resource: "seed",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  // Hàm lấy màu sắc tương ứng với GT Test Kit
  const getGTTestKitColor = (color: string | null | undefined) => {
    switch (color) {
      case "Blue": return "blue";
      case "Yellow": return "gold";
      case "Red": return "red";
      case "Orange": return "orange";
      default: return "default";
    }
  };

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...listProps}
        pagination={{
          ...listProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="seeds" />
          ),
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
          xxl: 4,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ height: "100%" }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: { padding: 16 },
                cover: { position: "relative" },
                actions: { marginTop: "auto" },
              }}
            >
              <Tag
                onClick={() => {
                  const SeedID = item.SeedID;
                  if (!SeedID) {
                    console.error("Error: SeedID is undefined");
                    return;
                  }

                  const targetUrl = `/seeds/${SeedID}`;
                  console.log("Navigating to:", targetUrl);

                  go({
                    to: targetUrl,
                    options: { keepQuery: true },
                    type: "replace", 
                  });
                }}
                className={cx(styles.viewButton, "viewButton")}
                icon={<EyeOutlined />}
              >
                View
              </Tag>

              <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: 8 }}
              >
                <Typography.Title
                  level={5}
                  ellipsis={{ rows: 1, tooltip: item.SeedName }}
                  style={{ marginBottom: 0 }}
                >
                  {item.SeedName || "-"}
                </Typography.Title>
                <Tag color={getGTTestKitColor(item.GTTestKitColor)}>
                  {item.GTTestKitColor || "-"}
                </Tag>
              </Flex>

              <Typography.Paragraph
                ellipsis={{ rows: 2, tooltip: item.Description }}
                style={{ marginBottom: 8 }}
              >
                {item.Description || "-"}
              </Typography.Paragraph>

              <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                <Typography.Text type="secondary">
                  Availability:
                </Typography.Text>
                <Tag color={item.IsAvailable ? "green" : "red"}>
                  {item.IsAvailable ? "Available" : "Not Available"}
                </Tag>
              </Flex>

              <Flex justify="space-between">
                <Typography.Text type="secondary">
                  Temp: {item.MinTemp ?? "-"} - {item.MaxTemp ?? "-"}°C
                </Typography.Text>
                <Typography.Text type="secondary">
                  Humidity: {item.MinHumid ?? "-"} - {item.MaxHumid ?? "-"}%
                </Typography.Text>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
