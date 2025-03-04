import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Spin,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Drawer } from "../../drawer";
import { SaveButton } from "@refinedev/antd";
import { axiosClient } from "@/lib/api/config/axios-client";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";
import axios from "axios";

type Props = {
  id?: string;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: (updatedFertilizer: any, isNew: boolean) => void;
};

export const FertilizerDrawerForm = ({ id, action, onClose, onMutationSuccess }: Props) => {
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  useEffect(() => {
    if (id && action === "edit") {
      fetchFertilizerDetails();
    }
  }, [id, action]);

  const fetchFertilizerDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/fertilizers/${id}`);
      if (response.data.status === 200) {
        const fertilizerData = response.data.data;

        console.log("🚀 Dữ liệu lấy từ API:", fertilizerData);

        form.setFieldsValue({
          name: fertilizerData.name,
          description: fertilizerData.description,
          available_quantity: fertilizerData.available_quantity,
          total_quantity: fertilizerData.total_quantity,
          unit: fertilizerData.unit,
          type: fertilizerData.type,
          status: fertilizerData.status === "true" ? "Available" : "Unavailable",
        });

        setImageUrl(fertilizerData.image);
      } else {
        message.error("Không thể tải thông tin phân bón.");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file }: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosClient.post("/api/fertilizers/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === 200) {
        setImageUrl(response.data.image);
        form.setFieldsValue({ image: response.data.image });
        message.success("Tải ảnh lên thành công!");
      } else {
        message.error("Lỗi khi tải ảnh lên.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi từ server:", error.response?.data || error.message);
      } else {
        console.error("Lỗi từ server:", error);
      }
      const errorMessage = (error as any).response?.data?.message || "Lỗi không xác định. Vui lòng kiểm tra lại.";
      message.error(errorMessage);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const payload = {
      id,
      name: values.name?.trim() || "Unnamed Fertilizer",
      description: values.description?.trim() || "No description",
      available_quantity: Number(values.available_quantity) || 0,
      total_quantity: Number(values.total_quantity) || 0,
      unit: values.unit || "kg",
      type: values.type || "Hóa học",
      status: values.status === "Available",
      image: imageUrl || "https://example.com/default-image.jpg",
    };

    try {
      let response;
      let isNew = action !== "edit";
      if (action === "edit") {
        response = await axiosClient.put(`/api/fertilizers/${id}`, payload);
      } else {
        response = await axiosClient.post("/api/fertilizers", payload);
      }

      if (response.data.status === 200) {
        message.success(action === "edit" ? "Cập nhật thành công!" : "Tạo mới thành công!");

        onMutationSuccess?.(response.data.data, isNew);
        onDrawerClose();
      } else {
        message.error(response.data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const onDrawerClose = () => {
    if (onClose) {
      onClose();
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
    <Drawer open={true} title={action === "edit" ? "Edit Fertilizer" : "Add Fertilizer"} width={breakpoint.sm ? "400px" : "100%"} onClose={onDrawerClose}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Image Upload */}
          <Form.Item label="Image">
            <Upload.Dragger name="file" beforeUpload={() => false} maxCount={1} accept="image/*" customRequest={handleUpload} showUploadList={false}>
              <Flex vertical align="center" justify="center">
                <Avatar shape="square" size={120} src={imageUrl || "/images/fertilizer-default-img.png"} />
                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>Upload Image</Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          {/* Text Inputs */}
          <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="Available Quantity" name="available_quantity" rules={[{ required: true }]}><InputNumber /></Form.Item>
          <Form.Item label="Total Quantity" name="total_quantity" rules={[{ required: true }]}><InputNumber /></Form.Item>
          <Form.Item label="Unit" name="unit" rules={[{ required: true }]}><Input /></Form.Item>

          {/* Select Fields */}
          <Form.Item label="Status" name="status" rules={[{ required: true }]}><Select options={[{ label: "Available", value: "Available" }, { label: "Unavailable", value: "Unavailable" }]} /></Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}><Select options={[{ label: "Vi sinh", value: "Vi sinh" }, { label: "Hữu cơ", value: "Hữu cơ" }, { label: "Hóa học", value: "Hóa học" }]} /></Form.Item>

          <Flex align="center" justify="space-between">
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton htmlType="submit" type="primary">Save</SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
