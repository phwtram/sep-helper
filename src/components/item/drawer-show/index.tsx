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
import { IItem, ItemStatus, ItemType } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const ItemStatusTag = ({ status }: { status: ItemStatus }) => {
  const colorMap: Record<ItemStatus, string> = {
    UnActived: "default",
    InStock: "success",
    OutStock: "error",
  };
  
  return <Tag color={colorMap[status]}>{status}</Tag>;
};

const ItemTypeTag = ({ type }: { type: ItemType }) => {
  const colorMap: Record<ItemType, string> = {
    Productive: "blue",
    Harvestive: "green",
    Packaging: "orange",
    Inspecting: "purple",
  };
  
  return <Tag color={colorMap[type]}>{type}</Tag>;
};

export const ItemDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<IItem, HttpError>({
    resource: "item",
    id: props?.id,
  });
  const item = queryResult.data?.data;

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
          src={item?.image}
          alt={item?.name}
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
          <Typography.Title level={5}>{item?.name}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {item?.description}
          </Typography.Paragraph>
        </Flex>
        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: <Typography.Text type="secondary">Status</Typography.Text>,
              value: item?.status && <ItemStatusTag status={item.status} />,
            },
            {
              label: <Typography.Text type="secondary">Type</Typography.Text>,
              value: item?.type && <ItemTypeTag type={item.type} />,
            },
          ]}
          renderItem={(data) => (
            <List.Item>
              <List.Item.Meta
                style={{
                  padding: "0 16px",
                }}
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
        style={{
          padding: "16px 16px 16px 0",
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={item?.id}
          resource="item"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `${editUrl("item", item?.id?.toString() || "")}`,
              query: { to: "/item" },
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
