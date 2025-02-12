import {
  type BaseKey,
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Button,
  Divider,
  Flex,
  List,
  Typography,
  theme,
  Tag,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { ISeed, SeedTestKitColor, SeedAvailability } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const GTTestKitColorTag = ({ color }: { color: SeedTestKitColor }) => {
  const colorMap: Record<SeedTestKitColor, string> = {
      Blue: "blue",
      Yellow: "gold",
      Red: "red",
      Orange: "orange",
  };
  return <Tag color={colorMap[color]}>{color}</Tag>;
};

const SeedAvailabilityTag = ({ status }: { status: SeedAvailability }) => {
  const colorMap: Record<SeedAvailability, string> = {
      Available: "green",
      Unavailable: "red",
  };
  return <Tag color={colorMap[status]}>{status}</Tag>;
};

export const SeedDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { query: queryResult } = useShow<ISeed>({
      resource: "seeds",
      id: props?.id,
  });
  const seed = queryResult.data?.data;

  const handleDrawerClose = () => {
      if (props?.onClose) {
          props.onClose();
          return;
      }
      go({
          to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
          query: { to: undefined },
          options: { keepQuery: true },
          type: "replace",
      });
  };

  return (
      <Drawer open={true} width="400px" zIndex={1001} onClose={handleDrawerClose}>
          <Flex vertical style={{ backgroundColor: token.colorBgContainer, padding: "16px" }}>
              <Typography.Title level={5}>{seed?.SeedName || "-"}</Typography.Title>
              <Typography.Text type="secondary">{seed?.Description || "-"}</Typography.Text>
          </Flex>
          <Divider />
          <List
              dataSource={[
                  {
                      label: "Availability",
                      value: seed?.IsAvailable && <SeedAvailabilityTag status={seed.IsAvailable} />,
                  },
                  {
                      label: "Temperature (°C)",
                      value: `${seed?.MinTemp ?? "-"} - ${seed?.MaxTemp ?? "-"}`,
                  },
                  {
                      label: "GT Test Kit Color",
                      value: seed?.GTTestKitColor ? <GTTestKitColorTag color={seed.GTTestKitColor} /> : "-",
                  },
              ]}
              renderItem={(item) => (
                  <List.Item>
                      <List.Item.Meta title={<Typography.Text type="secondary">{item.label}</Typography.Text>} description={<Typography.Text>{item.value}</Typography.Text>} />
                  </List.Item>
              )}
          />
          <Flex align="center" justify="space-between" style={{ padding: "16px 16px 16px 0" }}>
              <DeleteButton type="text" recordItemId={seed?.SeedID} resource="seed" onSuccess={handleDrawerClose} />
              <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                      if (props?.onEdit) {
                          return props.onEdit();
                      }
                      return go({
                          to: `${editUrl("seed", seed?.SeedID?.toString() || "")}`,
                          query: { to: "/seed" },
                          options: { keepQuery: true },
                          type: "replace",
                      });
                  }}
              >
                  {t("actions.edit")}
              </Button>
          </Flex>
      </Drawer>
  );
};
