import { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Flex,
  Typography,
  theme,
  Spin,
  Grid,
  message,
  Tag,
  Modal,
} from "antd";

import { Drawer } from "../../drawer";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { axiosClient } from "@/lib/api/config/axios-client";
import { IYield } from "@/interfaces";

type Props = {
  id?: string;
  onClose?: () => void;
};

export const YieldDrawerShow = ({ id, onClose }: Props) => {
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const [yieldData, setYieldData] = useState<IYield | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchYield = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/api/yields/${id}`);
        if (response.data.status === 200) {
          setYieldData(response.data.data);
        } else {
          setError("Không thể tải thông tin yield.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchYield();
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      message.error("ID không hợp lệ.");
      return;
    }

    try {
      const response = await axiosClient.delete(`/api/yields/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Xóa yield thành công");
        onClose?.();
      } else {
        message.error(`Lỗi: ${response.statusText}`);
      }
    } catch (err: any) {
      console.error("Lỗi xóa yield:", err.response || err);
      message.error("Không thể xóa yield. Vui lòng thử lại.");
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
        <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
          <Flex vertical style={{ padding: "16px" }}>
            <Typography.Title level={5}>{yieldData?.yield_name}</Typography.Title>
            <Typography.Paragraph type="secondary">
              {yieldData?.description}
            </Typography.Paragraph>
          </Flex>

          <Divider style={{ margin: 0, padding: 0 }} />

          <Flex vertical style={{ padding: "16px" }}>
            <Typography.Text>
              <strong>Diện tích:</strong> {yieldData?.area}{" "}
              {yieldData?.areaUnit}
            </Typography.Text>
            <Typography.Text>
              <strong>Loại:</strong> {yieldData?.type}
            </Typography.Text>
            <Typography.Text>
              <strong>Kích thước:</strong> {yieldData?.size}
            </Typography.Text>
            <Typography.Text>
              <strong>Trạng thái:</strong>{" "}
              <Tag color={yieldData?.isAvailable ? "green" : "red"}>
                {yieldData?.isAvailable ? "Available" : "Unavailable"}
              </Tag>
            </Typography.Text>
          </Flex>
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
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>
          <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </Flex>
      </Drawer>

      <Modal
        title={
          <Flex align="center" gap={8}>
            <ExclamationCircleOutlined style={{ color: "red" }} />
            <span>Bạn có chắc chắn muốn xóa yield này?</span>
          </Flex>
        }
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <Typography.Paragraph>
          Thao tác này không thể hoàn tác.
        </Typography.Paragraph>
      </Modal>
    </>
  );
};
