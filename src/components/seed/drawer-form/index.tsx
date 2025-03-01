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
  InputNumber,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Spin,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { ISeed } from "@/interfaces";
import { useEffect } from "react";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const SeedDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const [form] = Form.useForm();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<ISeed>({
      resource: "plants",
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

  const image = Form.useWatch("image_url", form);
  const title = props.action === "edit" ? "Edit Plant" : "Add Plant";

  const gtTestKitColorOptions = [
    { label: "Blue", value: "Blue" },
    { label: "Yellow", value: "Yellow" },
    { label: "Red", value: "Red" },
    { label: "Orange", value: "Orange" },
    { label: "Green", value: "Green" },
  ];

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
            name="image_url"
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
              className={styles.uploadDragger}
              showUploadList={false}
              onChange={(info) => {
                if (info.file.status === "done") {
                  const imageUrl = info.file.response?.url;
                  form.setFieldsValue({ image_url: imageUrl });
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
                  src={image || "/images/plant-default-img.png"}
                  alt="Plant Image"
                />
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Flex vertical>
            <Form.Item label="Plant Name" name="plant_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item label="Availability" name="is_available" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Available", value: true },
                  { label: "Not Available", value: false },
                ]}
              />
            </Form.Item>

            {/* Temperature */}
            <Form.Item label="Temperature (°C)">
              <Flex gap={8}>
                <Form.Item name="min_temp" noStyle>
                  <InputNumber min={0} placeholder="Min" />
                </Form.Item>
                <Form.Item name="max_temp" noStyle>
                  <InputNumber min={0} placeholder="Max" />
                </Form.Item>
              </Flex>
            </Form.Item>

            {/* Humidity */}
            <Form.Item label="Humidity (%)">
              <Flex gap={8}>
                <Form.Item name="min_humid" noStyle>
                  <InputNumber min={0} max={100} placeholder="Min" />
                </Form.Item>
                <Form.Item name="max_humid" noStyle>
                  <InputNumber min={0} max={100} placeholder="Max" />
                </Form.Item>
              </Flex>
            </Form.Item>

            {/* GT Test Kit Color */}
            <Form.Item label="GT Test Kit Color" name="gt_test_kit_color" rules={[{ required: true }]}>
              <Select options={gtTestKitColorOptions} />
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
