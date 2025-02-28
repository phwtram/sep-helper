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
import { IInspector, InspectorAvailability } from "@/interfaces";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const InspectorDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IInspector>({
      resource: "inspector",
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

  const image = Form.useWatch("imageUrl", formProps.form);
  console.log("Selected image:", image);
  const title = props.action === "edit" ? "Edit Inspector" : "Add Inspector";

  const availabilityOptions = [
    { label: "Available", value: "Available" },
    { label: "Unavailable", value: "Unavailable" },
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
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="imageUrl"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/media/upload`}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              className={styles.uploadDragger}
              showUploadList={false}
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
                    marginTop: image ? undefined : "auto",
                    transform: image ? undefined : "translateY(50%)",
                  }}
                  src={image || "/images/inspector-default-img.png"}
                  alt="Inspector Image"
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                    ...(!!image && {
                      position: "absolute",
                      bottom: 0,
                    }),
                  }}
                >
                  Upload Image
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              label="Account ID"
              name="accountID"
              className={styles.formItem}
              rules={[{ required: true, message: "Account ID is required!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              className={styles.formItem}
              rules={[{ required: true, message: "Name is required!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              className={styles.formItem}
              rules={[{ required: true, message: "Address is required!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              className={styles.formItem}
              rules={[{ required: true, message: "Description is required!" }]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label="Availability"
              name="isAvailable"
              className={styles.formItem}
              rules={[{ required: true, message: "Availability is required!" }]}
            >
              <Select options={availabilityOptions} />
            </Form.Item>
            <Flex
              align="center"
              justify="space-between"
              style={{ padding: "16px 16px 0px 16px" }}
            >
              <Button onClick={onDrawerClose}>Cancel</Button>
              <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
