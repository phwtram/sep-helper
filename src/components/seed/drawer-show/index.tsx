import {
  type BaseKey,
  type HttpError,
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
  Grid,
  List,
  Typography,
  theme,
  Tag,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { ISeed, SeedTestKitColor } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};
const getGTTestKitColor = (color: SeedTestKitColor | null | undefined) => {
  switch (color) {
    case "Blue":
      return "blue";
    case "Yellow":
      return "gold";
    case "Red":
      return "red";
    case "Orange":
      return "orange";
    default:
      return "default";
  }
};

export const SeedDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<ISeed, HttpError>({
    resource: "seed",
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
    <Drawer
      open={true}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
        <Flex vertical style={{ padding: "16px" }}>
          <Typography.Title level={5}>{seed?.name}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {seed?.Description}
          </Typography.Paragraph>
        </Flex>

        <Divider style={{ margin: 0, padding: 0 }} />

        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">Availability</Typography.Text>
              ),
              value: seed?.IsAvailable ? (
                <Tag icon={<CheckCircleOutlined />} color="green">
                  Available
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="red">
                  Not Available
                </Tag>
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  Temperature (°C)
                </Typography.Text>
              ),
              value: seed ? `${seed.MinTemp} - ${seed.MaxTemp} °C` : "-",
            },
            {
              label: (
                <Typography.Text type="secondary">Humidity (%)</Typography.Text>
              ),
              value: seed ? `${seed.MinHumid} - ${seed.MaxHumid} %` : "-",
            },
            {
              label: (
                <Typography.Text type="secondary">
                  Fertilizer (Kg)
                </Typography.Text>
              ),
              value: seed
                ? `${seed.MinFertilizerQuantity} - ${seed.MaxFertilizerQuantity} Kg`
                : "-",
            },
            {
              label: (
                <Typography.Text type="secondary">
                  Pesticide (Litre)
                </Typography.Text>
              ),
              value: seed
                ? `${seed.MinPesticideQuantity} - ${seed.MaxPesticideQuantity} L`
                : "-",
            },
            {
              label: (
                <Typography.Text type="secondary">
                  GT Test Kit Color
                </Typography.Text>
              ),
              value: (
                <Tag color={getGTTestKitColor(seed?.GTTestKitColor)}>
                  {seed?.GTTestKitColor || "-"}
                </Tag>
              ),
            },
          ]}
          renderItem={(data) => (
            <List.Item>
              <List.Item.Meta
                style={{ padding: "0 16px" }}
                avatar={data.label}
                title={data.value}
              />
            </List.Item>
          )}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{ padding: "16px 16px 16px 0" }}
      >
        <DeleteButton
          type="text"
          recordItemId={seed?.id}
          resource="seed"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }
            return go({
              to: `${editUrl("seed", seed?.id?.toString() || "")}`,
              query: { to: "/seeds" },
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
