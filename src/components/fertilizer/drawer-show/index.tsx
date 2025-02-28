import React, { useEffect, useState } from "react";
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
  Spin,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { axiosClient } from "@/lib/api/config/axios-client";
import { FertilizerDrawerForm } from "../drawer-form";

type Props = {
  id?: number;
  onClose?: () => void;
};

const FertilizerStatusTag = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    UnActived: "default",
    InStock: "success",
    OutStock: "error",
  };
  return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
};

const FertilizerTypeTag = ({ type }: { type: string }) => {
  const colorMap: Record<string, string> = {
    Đạm: "blue",
    Kali: "red",
    Lân: "orange",
  };
  return <Tag color={colorMap[type] || "default"}>{type}</Tag>;
};

export const FertilizerDrawerShow = ({ id, onClose }: Props) => {
  const [searchParams] = useSearchParams();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const [fertilizer, setFertilizer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosClient
      .get(`/api/fertilizers/${id}`)
      .then((response) => {
        if (response.data.status === 200) {
          setFertilizer(response.data.data);
        } else {
          setError("Không thể tải thông tin phân bón.");
        }
      })
      .catch(() => setError("Có lỗi xảy ra khi tải thông tin phân bón."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Drawer
        open={true}
        width={breakpoint.sm ? "378px" : "100%"}
        zIndex={1001}
        onClose={onClose}
      >
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Spin size="large" />
        </Flex>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer
        open={true}
        width={breakpoint.sm ? "378px" : "100%"}
        zIndex={1001}
        onClose={onClose}
      >
        <Typography.Text type="danger">{error}</Typography.Text>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        open={true}
        width={breakpoint.sm ? "378px" : "100%"}
        zIndex={1001}
        onClose={onClose}
      >
        <Flex vertical align="center" justify="center">
          <Avatar
            shape="square"
            style={{
              width: "240px",
              height: "240px",
              margin: "16px auto",
              borderRadius: "8px",
            }}
            src={fertilizer?.image}
            alt={fertilizer?.name}
          />
        </Flex>
        <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
          <Flex vertical style={{ padding: "16px" }}>
            <Typography.Title level={5}>{fertilizer?.name}</Typography.Title>
            <Typography.Text type="secondary">
              {fertilizer?.description}
            </Typography.Text>
          </Flex>
          <Divider />
          <List
            dataSource={[
              {
                label: <Typography.Text type="secondary">Type</Typography.Text>,
                value: <FertilizerTypeTag type={fertilizer?.type} />,
              },
              {
                label: (
                  <Typography.Text type="secondary">
                    Available Quantity
                  </Typography.Text>
                ),
                value: `${fertilizer?.available_quantity} ${fertilizer?.unit}`,
              },
              {
                label: (
                  <Typography.Text type="secondary">
                    Total Quantity
                  </Typography.Text>
                ),
                value: `${fertilizer?.total_quantity} ${fertilizer?.unit}`,
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  style={{ padding: "0 16px" }}
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
          style={{ padding: "16px 16px 16px 0" }}
        >
          <DeleteButton
            type="text"
            recordItemId={fertilizer?.id}
            resource="fertilizer"
            onSuccess={onClose}
          />
          <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </Flex>
      </Drawer>
      {editOpen && (
        <FertilizerDrawerForm
          id={id ? String(id) : undefined}
          action="edit"
          onClose={() => setEditOpen(false)}
          onMutationSuccess={() => setEditOpen(false)}
        />
      )}
    </>
  );
};
