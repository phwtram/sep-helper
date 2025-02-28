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
import { IItem } from "@/interfaces";

type Props = {
  id?: string;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const ItemDrawerForm = ({
  id,
  action,
  onClose,
  onMutationSuccess,
}: Props) => {
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id && action === "edit") {
      fetchItemDetails();
    }
  }, [id, action]);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/items/${id}`);
      if (response.data.status === 200) {
        const itemData = response.data.data;
        form.setFieldsValue({
          name: itemData.name,
          description: itemData.description,
          status: itemData.status,
          type: itemData.type,
        });
        setImageUrl(itemData.image_url);
      } else {
        message.error("Không thể tải thông tin sản phẩm.");
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
        "/api/items/images/upload",
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

  const onFinish = async (values: any) => {
    setLoading(true);

    const payload = {
      name: values.name,
      description: values.description,
      status: values.status,
      type: values.type,
      image_url: imageUrl || "",
    };

    try {
      let response;
      if (action === "edit") {
        response = await axiosClient.put(`/api/items/${id}`, payload);
      } else {
        response = await axiosClient.post("/api/items", payload);
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
      title={action === "edit" ? "Edit Item" : "Add Item"}
      width={breakpoint.sm ? "378px" : "100%"}
      onClose={onClose}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Image">
            <Upload.Dragger
              name="file"
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
              customRequest={handleUpload}
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
                  src={imageUrl || "/images/item-default-img.png"}
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

          <Flex align="center" justify="space-between">
            <Button onClick={onClose}>Cancel</Button>
            <SaveButton htmlType="submit" type="primary">
              Save
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
