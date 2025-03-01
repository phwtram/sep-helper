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
import { ISeed } from "@/interfaces";
import { SeedDrawerForm } from "../drawer-form";

type Props = {
  id?: string;
  onClose?: () => void;
};

export const SeedDrawerShow = ({ id, onClose }: Props) => {
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const [plant, setPlant] = useState<ISeed | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchPlant = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/api/plants/${id}`);
        
        if (response.data && response.data.status === 200) {
          // ✅ Truy cập đúng vào `data`
          setPlant(response.data.data);
        } else {
          setError("Không thể tải thông tin cây trồng.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await axiosClient.delete(`/api/plants/${id}`);
      message.success("Xóa cây trồng thành công");
      onClose?.();
    } catch (err) {
      console.error(err);
      message.error("Xóa cây trồng thất bại");
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
            src={plant?.image_url || "/images/plant-default-img.png"}
            alt={plant?.plant_name}
          />
        </Flex>

        <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
          <Flex vertical style={{ padding: "16px" }}>
            <Typography.Title level={5}>{plant?.plant_name}</Typography.Title>
            <Typography.Paragraph type="secondary">
              {plant?.description}
            </Typography.Paragraph>

            <Typography.Text>
              <b>Availability:</b>{" "}
              <Tag color={plant?.is_available ? "green" : "red"}>
                {plant?.is_available ? "Available" : "Not Available"}
              </Tag>
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Temperature (°C):</b>{" "}
              {plant?.min_temp !== undefined && plant?.max_temp !== undefined
                ? `${plant?.min_temp} - ${plant?.max_temp}`
                : "-"}
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Humidity (%):</b>{" "}
              {plant?.min_humid !== undefined && plant?.max_humid !== undefined
                ? `${plant?.min_humid} - ${plant?.max_humid}`
                : "-"}
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Moisture (%):</b>{" "}
              {plant?.min_moisture !== undefined &&
              plant?.max_moisture !== undefined
                ? `${plant?.min_moisture} - ${plant?.max_moisture}`
                : "-"}
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Fertilizer:</b>{" "}
              {plant?.min_fertilizer !== undefined &&
              plant?.max_fertilizer !== undefined
                ? `${plant?.min_fertilizer} - ${plant?.max_fertilizer} ${plant?.fertilizer_unit}`
                : "-"}
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Pesticide:</b>{" "}
              {plant?.min_pesticide !== undefined &&
              plant?.max_pesticide !== undefined
                ? `${plant?.min_pesticide} - ${plant?.max_pesticide} ${plant?.pesticide_unit}`
                : "-"}
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>Brix Point:</b>{" "}
              {plant?.min_brix_point !== undefined &&
              plant?.max_brix_point !== undefined
                ? `${plant?.min_brix_point} - ${plant?.max_brix_point}`
                : "-"}
            </Typography.Text>

            <Typography.Text>
              <br />
              <b>GT Test Kit Color:</b>{" "}
              <Tag color={plant?.gt_test_kit_color?.toLowerCase()}>
                {plant?.gt_test_kit_color || "-"}
              </Tag>
            </Typography.Text>
          </Flex>
          <Divider style={{ margin: 0, padding: 0 }} />
        </Flex>

        <Flex align="center" justify="space-between" style={{ padding: "16px" }}>
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
        <SeedDrawerForm
          id={id}
          action="edit"
          onClose={() => setEditOpen(false)}
          onMutationSuccess={() => setEditOpen(false)}
        />
      )}
    </>
  );
};
