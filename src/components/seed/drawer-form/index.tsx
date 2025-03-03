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
  onMutationSuccess?: () => void;
};

export const SeedDrawerForm = ({ id, action, onClose, onMutationSuccess }: Props) => {
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  useEffect(() => {
    if (id && action === "edit") {
      fetchPlantDetails();
    }
  }, [id, action]);

  const fetchPlantDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/plants/${id}`);
      if (response.data.status === 200) {
        const plantData = response.data.data;
        form.setFieldsValue({
          ...plantData,
          is_available: plantData.is_available ? "Available" : "Not Available",
        });
        setImageUrl(plantData.image_url);
      } else {
        message.error("Không thể tải thông tin cây trồng.");
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
      const response = await axiosClient.post(
        "/api/plants/images/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === 200) {
        setImageUrl(response.data.image_url);
        form.setFieldsValue({ image_url: response.data.image_url });
        message.success("Tải ảnh lên thành công!");
      } else {
        message.error("Lỗi khi tải ảnh lên.");
      }
    } catch (error) {
      message.error("Lỗi kết nối server.");
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const payload = {
      plant_name: values.plant_name.trim() || "Unnamed Plant",
      description: values.description.trim() || "No description",
      is_available: values.is_available === "Available",
      min_temp: values.min_temp > 0 ? values.min_temp : 10,  // Giả sử giá trị mặc định là 10
      max_temp: values.max_temp > values.min_temp ? values.max_temp : 30,
      min_humid: values.min_humid > 0 ? values.min_humid : 50,
      max_humid: values.max_humid > values.min_humid ? values.max_humid : 90,
      min_moisture: values.min_moisture > 0 ? values.min_moisture : 5,
      max_moisture: values.max_moisture > values.min_moisture ? values.max_moisture : 50,
      min_brix_point: values.min_brix_point > 0 ? values.min_brix_point : 1,
      max_brix_point: values.max_brix_point > values.min_brix_point ? values.max_brix_point : 10,
      min_fertilizer: values.min_fertilizer > 0 ? values.min_fertilizer : 1,
      max_fertilizer: values.max_fertilizer > values.min_fertilizer ? values.max_fertilizer : 5,
      fertilizer_unit: ["kg", "ha"].includes(values.fertilizer_unit) ? values.fertilizer_unit : "kg",
      min_pesticide: values.min_pesticide >= 0 ? values.min_pesticide : 0,
      max_pesticide: values.max_pesticide >= values.min_pesticide ? values.max_pesticide : 3,
      pesticide_unit: ["ml", "L"].includes(values.pesticide_unit) ? values.pesticide_unit : "ml",
      gt_test_kit_color: values.gt_test_kit_color || "Green",
      image_url: imageUrl || "https://example.com/default-image.jpg", // Thay thế ảnh mặc định nếu trống
  };
  

    console.log("🚀 Payload gửi lên API:", JSON.stringify(payload, null, 2));

    try {
        let response;
        if (action === "edit") {
            response = await axiosClient.put(`/api/plants/${id}`, payload);
        } else {
            response = await axiosClient.post("/api/plants", payload);
        }

        if (response.data.status === 200) {
            message.success(action === "edit" ? "Cập nhật thành công!" : "Tạo mới thành công!");
            onMutationSuccess?.();
            onDrawerClose();
        } else {
            message.error("Có lỗi xảy ra!");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("❌ Lỗi API:", error.response?.data || error.message);
        } else {
            console.error("❌ Lỗi API:", error);
        }
        message.error("Lỗi kết nối server.");
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
    <Drawer open={true} title={action === "edit" ? "Edit Plant" : "Add Plant"} width={breakpoint.sm ? "400px" : "100%"} onClose={onDrawerClose}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Image Upload */}
          <Form.Item label="Image">
            <Upload.Dragger name="file" beforeUpload={() => false} maxCount={1} accept="image/*" customRequest={handleUpload} showUploadList={false}>
              <Flex vertical align="center" justify="center">
                <Avatar shape="square" size={120} src={imageUrl || "/images/plant-default-img.png"} />
                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>Upload Image</Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          {/* Text Inputs */}
          <Form.Item label="Plant Name" name="plant_name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>

          {/* Select Fields */}
          <Form.Item label="Availability" name="is_available" rules={[{ required: true }]}><Select options={[{ label: "Available", value: "Available" }, { label: "Not Available", value: "Not Available" }]} /></Form.Item>

          {/* Number Inputs */}
          {["Temperature", "Humidity", "Moisture", "Brix Point"].map((field, index) => (
            <Form.Item key={index} label={field}>
              <Flex gap={8}>
                <Form.Item name={`min_${field.toLowerCase().replace(" ", "_")}`} noStyle><InputNumber min={0} placeholder="Min" /></Form.Item>
                <Form.Item name={`max_${field.toLowerCase().replace(" ", "_")}`} noStyle><InputNumber min={0} placeholder="Max" /></Form.Item>
              </Flex>
            </Form.Item>
          ))}
    {/* Fertilizer - with kg or g options */}
    <Form.Item label="Fertilizer">
            <Flex gap={8}>
              <Form.Item name="min_fertilizer" noStyle><InputNumber min={0} placeholder="Min" /></Form.Item>
              <Form.Item name="max_fertilizer" noStyle><InputNumber min={0} placeholder="Max" /></Form.Item>
              <Form.Item name="fertilizer_unit" noStyle>
                <Select 
                  style={{ width: 80 }} 
                  options={[
                    { label: "kg", value: "kg" },
                    { label: "ha", value: "ha" }
                  ]} 
                  placeholder="Unit" 
                />
              </Form.Item>
            </Flex>
          </Form.Item>

          {/* Pesticide - with L or ml options */}
          <Form.Item label="Pesticide">
            <Flex gap={8}>
              <Form.Item name="min_pesticide" noStyle><InputNumber min={0} placeholder="Min" /></Form.Item>
              <Form.Item name="max_pesticide" noStyle><InputNumber min={0} placeholder="Max" /></Form.Item>
              <Form.Item name="pesticide_unit" noStyle>
                <Select 
                  style={{ width: 80 }} 
                  options={[
                    { label: "l", value: "l" },
                    { label: "ml", value: "ml" }
                  ]} 
                  placeholder="Unit" 
                />
              </Form.Item>
            </Flex>
          </Form.Item>
          <Flex align="center" justify="space-between">
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton htmlType="submit" type="primary">Save</SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
