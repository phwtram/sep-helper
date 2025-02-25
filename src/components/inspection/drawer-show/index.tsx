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
import { IInspector, InspectorAvailability } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const InspectorAvailabilityTag = ({
  isAvailable,
}: {
  isAvailable: InspectorAvailability;
}) => {
  const colorMap: Record<InspectorAvailability, string> = {
    Available: "green",
    Unavailable: "red",
  };

  return <Tag color={colorMap[isAvailable]}>{isAvailable}</Tag>;
};

export const InspectorDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<IInspector, HttpError>({
    resource: "inspector",
    id: props?.id,
  });

  const inspector = queryResult.data?.data;

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
  console.log("Drawer Opened");
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
          src={inspector?.imageUrl || "/images/inspector-default-img.png"}
          alt={inspector?.name}
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
          <Typography.Title level={5}>{inspector?.name}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {inspector?.description}
          </Typography.Paragraph>
        </Flex>
        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">Account ID</Typography.Text>
              ),
              value: inspector?.accountID,
            },
            {
              label: (
                <Typography.Text type="secondary">Address</Typography.Text>
              ),
              value: inspector?.address,
            },
            {
              label: (
                <Typography.Text type="secondary">Availability</Typography.Text>
              ),
              value: inspector?.isAvailable && (
                <InspectorAvailabilityTag isAvailable={inspector.isAvailable} />
              ),
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
          recordItemId={inspector?.id}
          resource="inspector"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `/inspector/edit/${inspector?.id?.toString() || ""}`,
              query: { to: "/inspector" },
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
