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
import { axiosClient } from "@/lib/api/config/axios-client";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

const statusOptions = [
  { label: "In Stock", value: "InStock" },
  { label: "Out of Stock", value: "OutStock" },
  { label: "Unactivated", value: "UnActived" },
];

const typeOptions = [
  { label: "Organic", value: "Organic" },
  { label: "Chemical", value: "Chemical" },
  { label: "Mixed", value: "Mixed" },
];

const unitOptions = [
  { label: "Bao 2kg", value: "Bao 2kg" },
  { label: "Bao 3kg", value: "Bao 3kg" },
];

type Props = {
  id?: string;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const FertilizerDrawerForm = ({
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

  useEffect(() => {
    if (id && action === "edit") {
      fetchFertilizerDetails();
    }
  }, [id, action]);

  const fetchFertilizerDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/fertilizer/${id}`);
      if (response.data.status === 200) {
        const itemData = response.data.data;
        form.setFieldsValue(itemData);
        setImageUrl(itemData.image_url);
      } else {
        message.error("Không thể tải thông tin phân bón.");
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

  const handleUpload = async ({ file }: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosClient.post(
        "/api/fertilizer/images/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === 200) {
        const uploadedImageUrl = response.data.image_url;
        setImageUrl(uploadedImageUrl);
        form.setFieldsValue({ image_url: uploadedImageUrl }); // Cập nhật form
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

    const payload = { ...values, image_url: imageUrl || "" };

    try {
      let response;
      if (action === "edit") {
        response = await axiosClient.put(`/api/fertilizer/${id}`, payload);
      } else {
        response = await axiosClient.post("/api/fertilizer", payload);
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
      title={action === "edit" ? "Edit Fertilizer" : "Add Fertilizer"}
      width={breakpoint.sm ? "378px" : "100%"}
      onClose={onDrawerClose}
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
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            {" "}
            <Input.TextArea rows={4} />{" "}
          </Form.Item>
          <Form.Item
            label="Available Quantity"
            name="available_quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Total Quantity"
            name="total_quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
            <Select options={unitOptions} />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select options={typeOptions} />
          </Form.Item>

          <Flex align="center" justify="space-between">
            <Button onClick={onDrawerClose}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              Save
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
