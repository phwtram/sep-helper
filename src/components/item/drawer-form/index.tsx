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
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { IItem } from "@/interfaces";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const ItemDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const [form] = Form.useForm();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IItem>({
      resource: "items",
      id: props?.id,
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
        onDrawerClose(); // ✅ Đóng Drawer sau khi lưu thành công
      },
    });

  // ✅ Xử lý đóng Drawer
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
  const title = props.action === "edit" ? "Edit Item" : "Add Item";

  const statusOptions = [
    { label: "UnActived", value: "UnActived" },
    { label: "In Stock", value: "InStock" },
    { label: "Out of Stock", value: "OutStock" },
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
              className={styles.uploadDragger}
              showUploadList={false}
              onChange={(info) => {
                if (info.file.status === "done") {
                  const imageUrl = info.file.response?.url;
                  form.setFieldsValue({ image: imageUrl });
                }
              }}
            >
              <Flex
                vertical
                align="center"
                justify="center"
                style={{ position: "relative", height: "100%" }}
              >
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: image ? "100%" : "48px",
                    height: image ? "100%" : "48px",
                  }}
                  src={image || "/images/item-default-img.png"}
                  alt="Item Image"
                />
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Flex vertical>
            <Form.Item
              label="Name"
              name="name"
              className={styles.formItem}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              className={styles.formItem}
              rules={[{ required: true, message: "Description is required" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              className={styles.formItem}
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select options={statusOptions} />
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
