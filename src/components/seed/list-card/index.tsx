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
    resource: "plants",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  // Hàm lấy màu sắc tương ứng với GT Test Kit Color
  const getGTTestKitColor = (color: string | null | undefined) => {
    const colorMap: Record<string, string> = {
      Blue: "blue",
      Yellow: "gold",
      Red: "red",
      Orange: "orange",
      Green: "green",
    };
    return colorMap[color || ""] || "default";
  };

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...listProps}
        pagination={{
          ...listProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="plants" />
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
        renderItem={(plant) => (
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
              cover={
                <img
                  src={plant.image_url || "/images/plant-default-img.png"}
                  alt={plant.plant_name}
                  style={{
                    width: "100%",
                    aspectRatio: "288/160",
                    objectFit: "cover",
                  }}
                />
              }
            >
              {/* Nút View */}
              <Tag
                onClick={() => {
                  const plantID = plant.id;
                  if (!plantID) {
                    console.error("Error: Plant ID is undefined");
                    return;
                  }

                  go({
                    to: `${showUrl("plants", plantID)}`,
                    query: { to: pathname },
                    options: { keepQuery: true },
                    type: "replace",
                  });
                }}
                className={cx(styles.viewButton, "viewButton")}
                icon={<EyeOutlined />}
              >
                View
              </Tag>

              {/* Tiêu đề */}
              <Flex align="center" justify="space-between" style={{ marginBottom: 8 }}>
                <Typography.Title
                  level={5}
                  ellipsis={{ rows: 1, tooltip: plant.plant_name }}
                  style={{ marginBottom: 0 }}
                >
                  {plant.plant_name || "-"}
                </Typography.Title>
                <Tag color={getGTTestKitColor(plant.gt_test_kit_color)}>
                  {plant.gt_test_kit_color || "-"}
                </Tag>
              </Flex>

              {/* Mô tả */}
              <Typography.Paragraph
                ellipsis={{ rows: 2, tooltip: plant.description }}
                style={{ marginBottom: 8 }}
              >
                {plant.description || "-"}
              </Typography.Paragraph>

              {/* Trạng thái */}
              <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                <Typography.Text type="secondary">
                  Availability:
                </Typography.Text>
                <Tag color={plant.is_available ? "green" : "red"}>
                  {plant.is_available ? "Available" : "Not Available"}
                </Tag>
              </Flex>

              {/* Nhiệt độ & Độ ẩm */}
              <Flex justify="space-between">
                <Typography.Text type="secondary">
                  Temp: {plant.min_temp ?? "-"} - {plant.max_temp ?? "-"}°C
                </Typography.Text>
                <Typography.Text type="secondary">
                  Humidity: {plant.min_humid ?? "-"} - {plant.max_humid ?? "-"}%
                </Typography.Text>
              </Flex>

              {/* Phân bón & Thuốc trừ sâu */}
              <Flex justify="space-between" style={{ marginTop: 8 }}>
                <Typography.Text type="secondary">
                  Fertilizer: {plant.min_fertilizer ?? "-"} - {plant.max_fertilizer ?? "-"} {plant.fertilizer_unit}
                </Typography.Text>
              </Flex>
              <Flex justify="space-between">
                <Typography.Text type="secondary">
                  Pesticide: {plant.min_pesticide ?? "-"} - {plant.max_pesticide ?? "-"} {plant.pesticide_unit}
                </Typography.Text>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
