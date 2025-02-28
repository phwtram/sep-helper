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
import { axiosClient } from "@/lib/api/config/axios-client"; // Đảm bảo import axiosClient đúng
import { IPesticide } from "@/interfaces"; // Giả sử đây là interface bạn đã khai báo
import { PesticideDrawerForm } from "../drawer-form"; // Giả sử bạn có form cho việc chỉnh sửa thuốc trừ sâu

type Props = {
  id?: string;
  onClose?: () => void;
};

export const PesticideDrawerShow = ({ id, onClose }: Props) => {
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const [pesticide, setPesticide] = useState<IPesticide | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchPesticide = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/api/pesticides/${id}`);
        if (response.data.status === 1) {
          setPesticide(response.data.data); // Lưu dữ liệu từ response vào state pesticide
        } else {
          setError("Không thể tải thông tin thuốc trừ sâu.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPesticide();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await axiosClient.delete(`/api/pesticides/${id}`);
      message.success("Xóa thuốc trừ sâu thành công");
      onClose?.();
    } catch (err) {
      console.error(err);
      message.error("Xóa thuốc trừ sâu thất bại");
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
            src={pesticide?.image}
            alt={pesticide?.name}
          />
        </Flex>
        <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
          <Flex vertical style={{ padding: "16px" }}>
            <Typography.Title level={5}>{pesticide?.name}</Typography.Title>
            <Typography.Paragraph type="secondary">
              {pesticide?.description}
            </Typography.Paragraph>
            <Typography.Text>Loại: {pesticide?.type}</Typography.Text>
            <Typography.Text>
              <br />
              Đơn vị: {pesticide?.unit}
            </Typography.Text>
            <Typography.Text>
              <br />
              Số lượng còn lại: {pesticide?.available_quantity}{" "}
              {pesticide?.unit}
            </Typography.Text>
            <Typography.Text>
              <br />
              Tổng số lượng: {pesticide?.total_quantity} {pesticide?.unit}
            </Typography.Text>
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
        <PesticideDrawerForm
          id={id}
          action="edit"
          onClose={() => setEditOpen(false)}
          onMutationSuccess={() => setEditOpen(false)}
        />
      )}
    </>
  );
};
