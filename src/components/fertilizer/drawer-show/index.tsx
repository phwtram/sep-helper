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
  Avatar,
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
import { FertilizerStatus, FertilizerType, IFertilizer } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const FertilizerStatusTag = ({ status }: { status: FertilizerStatus }) => {
  const colorMap = {
    UnActived: "default",
    InStock: "success",
    OutStock: "error",
  };

  return <Tag color={colorMap[status]}>{status}</Tag>;
};

const FertilizerTypeTag = ({ type }: { type: FertilizerType }) => {
  const colorMap = {
    Organic: "green",
    Chemical: "orange",
    Mixed: "blue",
  };

  return <Tag color={colorMap[type]}>{type}</Tag>;
};

export const FertilizerDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<IFertilizer, HttpError>({
    resource: "fertilizer",
    id: props?.id,
  });
  const fertilizer = queryResult.data?.data;

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
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: "contain",
            width: "240px",
            height: "240px",
            margin: "16px auto",
            borderRadius: "8px",
          }}
          src={fertilizer?.image}
          alt={fertilizer?.name}
        />
      </Flex>
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Flex
          vertical
          style={{
            padding: "16px",
          }}
        >
          <Typography.Title level={5}>{fertilizer?.name}</Typography.Title>
          <Typography.Text type="secondary">
            {fertilizer?.description}
          </Typography.Text>
        </Flex>
        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: <Typography.Text type="secondary">Status</Typography.Text>,
              value: fertilizer?.status && (
                <FertilizerStatusTag status={fertilizer.status} />
              ),
            },
            {
              label: <Typography.Text type="secondary">Type</Typography.Text>,
              value: fertilizer?.type && (
                <FertilizerTypeTag type={fertilizer.type} />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  Available Quantity
                </Typography.Text>
              ),
              value: (
                <Typography.Text>
                  {fertilizer?.available_quantity} {fertilizer?.unit}
                </Typography.Text>
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  Total Quantity
                </Typography.Text>
              ),
              value: (
                <Typography.Text>
                  {fertilizer?.total_quantity} {fertilizer?.unit}
                </Typography.Text>
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{
                  padding: "0 16px",
                }}
                avatar={item.label}
                title={item.value}
              />
            </List.Item>
          )}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 16px 0",
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={fertilizer?.id}
          resource="fertilizer"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `${editUrl("fertilizer", fertilizer?.id?.toString() || "")}`,
              query: { to: "/fertilizer" },
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
