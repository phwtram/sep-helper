import { useState, useEffect } from "react";
import {
  Form,
  Input,
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
import { axiosClient } from "@/lib/api/config/axios-client";
import { SaveButton } from "@refinedev/antd";
import { IPesticide } from "@/interfaces";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

type Props = {
  id?: string;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const PesticideDrawerForm = ({
  id,
  action,
  onClose,
  onMutationSuccess,
}: Props) => {
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  // Fetch pesticide details if action is 'edit' and id is provided
  useEffect(() => {
    if (id && action === "edit") {
      fetchPesticideDetails();
    }
  }, [id, action]);

  // Fetch pesticide details for editing
  const fetchPesticideDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/pesticides/${id}`);
      if (response.data.status === 1) {
        const pesticideData = response.data.data;
        form.setFieldsValue({
          name: pesticideData.name,
          description: pesticideData.description,
          status: pesticideData.status,
          type: pesticideData.type,
          available_quantity: pesticideData.available_quantity,
          total_quantity: pesticideData.total_quantity,
          unit: pesticideData.unit,
        });
        setImageUrl(pesticideData.image); // Set image URL for editing
      } else {
        message.error("Không thể tải thông tin thuốc trừ sâu.");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu.");
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

  // Handle image upload
  const handleUpload = async ({ file }: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosClient.post(
        "/api/pesticides/images/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === 200) {
        setImageUrl(response.data.image_url);
        message.success("Tải ảnh lên thành công!");
      } else {
        message.error("Lỗi khi tải ảnh lên.");
      }
    } catch (error) {
      message.error("Lỗi kết nối server.");
    }
  };

  // Submit form data to API for creating or editing pesticide
  const onFinish = async (values: any) => {
    setLoading(true);

    const payload = {
      name: values.name,
      description: values.description,
      status: values.status,
      type: values.type,
      image: imageUrl || "", // Send the image URL (either uploaded or default)
      available_quantity: values.available_quantity,
      total_quantity: values.total_quantity,
      unit: values.unit,
    };

    try {
      let response;
      if (action === "edit") {
        // Update pesticide if action is 'edit'
        response = await axiosClient.put(`/api/pesticides/${id}`, payload);
      } else {
        // Create new pesticide if action is 'create'
        response = await axiosClient.post("/api/pesticides", payload);
      }

      if (response.data.status === 200) {
        message.success(
          action === "edit" ? "Cập nhật thành công!" : "Tạo mới thành công!"
        );
        onMutationSuccess?.();
        onClose?.();
      } else {
        message.error("Có lỗi xảy ra!");
      }
    } catch (error) {
      message.error("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={true}
      title={action === "edit" ? "Edit Pesticide" : "Add Pesticide"}
      width={breakpoint.sm ? "378px" : "100%"}
      onClose={onDrawerClose}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Image">
            <Upload.Dragger
              name="file"
              beforeUpload={() => false} // Prevent auto-upload
              maxCount={1}
              accept="image/*"
              customRequest={handleUpload} // Custom upload handler
              showUploadList={false}
            >
              <Flex vertical align="center" justify="center">
                <Avatar
                  shape="square"
                  style={{
                    width: "100%",
                    maxHeight: "240px",
                    objectFit: "contain",
                  }}
                  src={imageUrl || "/images/pesticide-default-img.png"} // Display default or uploaded image
                />
                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                  Upload Image
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              options={[
                { label: "UnActived", value: "UnActived" },
                { label: "In Stock", value: "InStock" },
                { label: "Out of Stock", value: "OutStock" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select
              options={[
                { label: "Productive", value: "Productive" },
                { label: "Harvestive", value: "Harvestive" },
                { label: "Packaging", value: "Packaging" },
                { label: "Inspecting", value: "Inspecting" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Available Quantity"
            name="available_quantity"
            rules={[
              { required: true, message: "Please enter available quantity" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Total Quantity"
            name="total_quantity"
            rules={[{ required: true, message: "Please enter total quantity" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true, message: "Please enter unit" }]}
          >
            <Input />
          </Form.Item>

          <Flex align="center" justify="space-between">
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton htmlType="submit" type="primary">
              Save
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
