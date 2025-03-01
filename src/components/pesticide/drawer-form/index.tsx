import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  type BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import { getValueFromEvent } from "@refinedev/antd";
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
  InputNumber,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { IPesticide } from "@/interfaces";
import { useEffect } from "react";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const PesticideDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();

  const [form] = Form.useForm();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IPesticide>({
      resource: "pesticides",
      id: props?.id,
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
    });

  const onDrawerClose = () => {
    close();

    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const image = Form.useWatch("image", form);
  const title = props.action === "edit" ? "Edit Pesticide" : "Add Pesticide";

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical" form={form}>
          {/* Image Upload */}
          <Form.Item
            name="image"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/media/upload`}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              showUploadList={false}
              onChange={(info) => {
                if (info.file.status === "done") {
                  const imageUrl = info.file.response?.url;
                  form.setFieldsValue({ image: imageUrl });
                }
              }}
            >
              <Flex vertical align="center" justify="center" style={{ height: "100%" }}>
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: image ? "100%" : "48px",
                    height: image ? "100%" : "48px",
                  }}
                  src={image || "/images/pesticide-default-img.png"}
                  alt="Pesticide Image"
                />
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Flex vertical>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "UnActived", value: "UnActived" },
                  { label: "In Stock", value: "InStock" },
                  { label: "Out of Stock", value: "OutStock" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Type" name="type" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Productive", value: "Productive" },
                  { label: "Harvestive", value: "Harvestive" },
                  { label: "Packaging", value: "Packaging" },
                  { label: "Inspecting", value: "Inspecting" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Available Quantity" name="available_quantity" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Total Quantity" name="total_quantity" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Flex align="center" justify="space-between" style={{ paddingTop: 16 }}>
              <Button onClick={onDrawerClose}>Cancel</Button>
              <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};