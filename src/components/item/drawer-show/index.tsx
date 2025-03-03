import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Typography,
  theme,
  Spin,
  Grid,
  message,
  Tag,
} from "antd";
import { Drawer } from "../../drawer";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosClient } from "@/lib/api/config/axios-client";
import { IItem } from "@/interfaces";
import { ItemDrawerForm } from "../drawer-form";

type Props = {
  id?: string;
  onClose?: () => void;
  onMutationSuccess?: () => void; // Thêm callback cập nhật danh sách
};

export const ItemDrawerShow = ({ id, onClose, onMutationSuccess }: Props) => {
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const [item, setItem] = useState<IItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/api/items/${id}`);
        console.log("Response data:", response.data);
        if (response.data.status === 200) {
          setItem(response.data.data);
        } else {
          setError("Không thể tải thông tin sản phẩm.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "UnActived":
        return "default";
      case "InStock":
        return "green";
      case "OutStock":
        return "red";
      default:
        return "gray";
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "Productive":
        return "blue";
      case "Harvestive":
        return "green";
      case "Packaging":
        return "orange";
      case "Inspecting":
        return "purple";
      default:
        return "default";
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await axiosClient.delete(`/api/items/${id}`);
      message.success("Xóa sản phẩm thành công");
      onClose?.();
      onMutationSuccess?.();
    } catch (err) {
      console.error(err);
      message.error("Xóa sản phẩm thất bại");
    }
  };

  if (loading) {
    return (
      <Drawer
        open={!!id}
        width={breakpoint.sm ? "378px" : "100%"}
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
        open={!!id}
        width={breakpoint.sm ? "378px" : "100%"}
        onClose={onClose}
      >
        <Typography.Text type="danger">{error}</Typography.Text>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        open={!!id}
        width={breakpoint.sm ? "378px" : "100%"}
        onClose={onClose}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ padding: "16px" }}
        >
          <Avatar
            shape="square"
            style={{
              aspectRatio: 1,
              objectFit: "contain",
              width: "200px",
              height: "200px",
              marginBottom: "16px",
              borderRadius: "8px",
            }}
            src={item?.image}
            alt={item?.name}
          />
        </Flex>

        <Flex
          vertical
          style={{ backgroundColor: token.colorBgContainer, padding: "16px" }}
        >
          <Typography.Title level={5} style={{ marginBottom: "8px" }}>
            {item?.name}
          </Typography.Title>
          <Typography.Paragraph
            type="secondary"
            style={{ fontSize: "14px", marginBottom: "12px" }}
          >
            {item?.description}
          </Typography.Paragraph>

          {item?.status && (
            <Flex align="center" gap={8} style={{ marginBottom: "8px" }}>
              <Typography.Text strong>Status:</Typography.Text>
              <Tag
                color={getStatusColor(item.status)}
                style={{ borderRadius: "6px", fontSize: "13px" }}
              >
                {item.status}
              </Tag>
            </Flex>
          )}

          {item?.type && (
            <Flex align="center" gap={8} style={{ marginBottom: "8px" }}>
              <Typography.Text strong>Type:</Typography.Text>
              <Tag
                color={getTypeColor(item.type)}
                style={{ borderRadius: "6px", fontSize: "13px" }}
              >
                {item.type}
              </Tag>
            </Flex>
          )}

          <Flex align="center" gap={8} style={{ marginBottom: "8px" }}>
            <Typography.Text strong>Quantity:</Typography.Text>
            <Typography.Text>
              {item?.quantity} {item?.unit}
            </Typography.Text>
          </Flex>
        </Flex>

        <Divider style={{ margin: "12px 0" }} />

        <Flex
          align="center"
          justify="space-between"
          style={{ padding: "16px" }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </Flex>
      </Drawer>

      {editOpen && (
        <ItemDrawerForm
          id={id}
          action="edit"
          onClose={() => setEditOpen(false)}
          onMutationSuccess={() => {
            setEditOpen(false);
            onMutationSuccess?.();
          }}
        />
      )}
    </>
  );
};
