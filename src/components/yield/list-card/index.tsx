import { useSimpleList } from "@refinedev/antd";
import {
  type HttpError,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";

import { Card, Divider, Flex, List, Tag, Typography, theme } from "antd";

import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IYield, YieldType, YieldAvailability, YieldSize } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { useStyles } from "./styled";

export const YieldListCard = () => {
  const { token } = theme.useToken();
  const { styles, cx } = useStyles();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { listProps } = useSimpleList<IYield, HttpError>({
    resource: "yield",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...listProps}
        pagination={{
          ...listProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="yields" />
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
                  const yieldID = item.id;
                  if (!yieldID) {
                    console.error("Error: yieldID is undefined");
                    return;
                  }

                  const targetUrl = `/yields/${yieldID}`;
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
                  ellipsis={{ rows: 1, tooltip: item.name }}
                  style={{ marginBottom: 0 }}
                >
                  {item.name || "-"}
                </Typography.Title>
                <Tag color="blue">{item.type || "-"}</Tag>
              </Flex>

              <Typography.Paragraph
                ellipsis={{ rows: 2, tooltip: item.description }}
                style={{ marginBottom: 8 }}
              >
                {item.description || "-"}
              </Typography.Paragraph>

              <Flex
                justify="space-between"
                align="center"
                style={{ marginBottom: 8 }}
              >
                <Typography.Text type="secondary">
                  Availability:
                </Typography.Text>
                <Tag color={item.isAvailable === "Available" ? "green" : "red"}>
                  {item.isAvailable}
                </Tag>
              </Flex>

              <Flex justify="space-between">
                <Typography.Text type="secondary">
                  Area: {item.area ?? "-"} {item.areaUnit}
                </Typography.Text>
                <Typography.Text type="secondary">
                  Size: {item.size ?? "-"}
                </Typography.Text>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
