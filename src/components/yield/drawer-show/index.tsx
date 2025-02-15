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
import { EditOutlined } from "@ant-design/icons";
import { IYield, YieldType, YieldAvailability, YieldSize } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const YieldDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<IYield, HttpError>({
    resource: "yield",
    id: props?.id,
  });

  const yieldData = queryResult.data?.data;

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
          <Typography.Title level={5}>{yieldData?.name}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {yieldData?.description}
          </Typography.Paragraph>
        </Flex>

        <Divider style={{ margin: 0, padding: 0 }} />

        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">Area Unit</Typography.Text>
              ),
              value: yieldData?.areaUnit || "-",
            },
            {
              label: (
                <Typography.Text type="secondary">Area (sq. meters)</Typography.Text>
              ),
              value: yieldData?.area || "-",
            },
            {
              label: (
                <Typography.Text type="secondary">Type</Typography.Text>
              ),
              value: yieldData?.type || "-",
            },
            {
              label: (
                <Typography.Text type="secondary">Availability</Typography.Text>
              ),
              value: (
                <Tag color={yieldData?.isAvailable === "Available" ? "green" : "red"}>
                  {yieldData?.isAvailable || "-"}
                </Tag>
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">Size</Typography.Text>
              ),
              value: yieldData?.size || "-",
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
          recordItemId={yieldData?.id}
          resource="yield"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }
            return go({
              to: `/yield/edit/${yieldData?.id?.toString() || ""}`,
              query: { to: "/yield" },
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
