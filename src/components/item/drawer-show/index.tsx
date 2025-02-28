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
} from "antd";
import { Drawer } from "../../drawer";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosClient } from "@/lib/api/config/axios-client";
import { IItem } from "@/interfaces";
import { ItemDrawerForm } from "../drawer-form";

type Props = {
  id?: string;
  onClose?: () => void;
};

export const ItemDrawerShow = ({ id, onClose }: Props) => {
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

  const handleDelete = async () => {
    if (!id) return;
    try {
      await axiosClient.delete(`/api/items/${id}`);
      message.success("Xóa sản phẩm thành công");
      onClose?.();
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
        <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
          <Flex vertical style={{ padding: "16px" }}>
            <Typography.Title level={5}>{item?.name}</Typography.Title>
            <Typography.Paragraph type="secondary">
              {item?.description}
            </Typography.Paragraph>
          </Flex>
          <Divider style={{ margin: 0, padding: 0 }} />
        </Flex>
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
          onMutationSuccess={() => setEditOpen(false)}
        />
      )}
    </>
  );
};
