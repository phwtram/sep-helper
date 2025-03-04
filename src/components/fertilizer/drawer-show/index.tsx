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
import { FertilizerDrawerForm } from "../drawer-form";

type Props = {
  id?: number;
  onClose?: () => void;
  onMutationSuccess?: (id: string | number, isDeleted: boolean) => void;
};

export const FertilizerDrawerShow = ({ id, onClose, onMutationSuccess }: Props) => {
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const [fertilizer, setFertilizer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchFertilizer = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/api/fertilizers/${id}`);

        if (response.data && response.data.status === 200) {
          setFertilizer(response.data.data);
        } else {
          setError("Không thể tải thông tin phân bón.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFertilizer();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await axiosClient.delete(`/api/fertilizers/${id}`);
      message.success("Xóa phân bón thành công");

      onMutationSuccess?.(id, true);
      onClose?.();
    } catch (err) {
      console.error(err);
      message.error("Xóa phân bón thất bại");
    }
  };

  const handleUpdateSuccess = (updatedFertilizer: any) => {
    setFertilizer((prev: any) => ({
      ...prev,
      ...updatedFertilizer,
    }));
  };

  if (loading) {
    return (
      <Drawer open={!!id} width={breakpoint.sm ? "378px" : "100%"} onClose={onClose}>
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Spin size="large" />
        </Flex>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer open={!!id} width={breakpoint.sm ? "378px" : "100%"} onClose={onClose}>
        <Typography.Text type="danger">{error}</Typography.Text>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer open={!!id} width={breakpoint.sm ? "378px" : "100%"} onClose={onClose}>
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
            src={fertilizer?.image || "/images/fertilizer-default-img.png"}
            alt={fertilizer?.name}
          />
        </Flex>

        <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
          <Flex vertical style={{ padding: "16px" }}>
            <Typography.Title level={5}>{fertilizer?.name}</Typography.Title>
            <Typography.Paragraph type="secondary">
              {fertilizer?.description}
            </Typography.Paragraph>

            <Typography.Text>
              <b>Status:</b>{" "}
              <Tag color={fertilizer?.status === "InStock" ? "green" : "red"}>
                {fertilizer?.status || "Unknown"}
              </Tag>
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Type:</b> <Tag color="blue">{fertilizer?.type || "-"}</Tag>
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Available Quantity:</b>{" "}
              {fertilizer?.available_quantity
                ? `${fertilizer.available_quantity} ${fertilizer.unit}`
                : "-"}
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Total Quantity:</b>{" "}
              {fertilizer?.total_quantity
                ? `${fertilizer.total_quantity} ${fertilizer.unit}`
                : "-"}
            </Typography.Text>
          </Flex>
          <Divider style={{ margin: 0, padding: 0 }} />
        </Flex>

        <Flex align="center" justify="space-between" style={{ padding: "16px" }}>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={handleDelete}>
            Delete
          </Button>
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
          onMutationSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};
