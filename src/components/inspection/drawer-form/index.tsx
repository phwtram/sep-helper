import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  type BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
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
import { IInspector } from "@/interfaces";
import { UploadFile } from "antd/lib";

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

  const normalizeImageUrl = (imageUrl: any) => {
    if (!imageUrl) return [];
    if (Array.isArray(imageUrl)) return imageUrl;
    return [{ url: imageUrl }];
  };

  const initialValues = {
    ...formProps.initialValues,
    imageUrl: normalizeImageUrl(formProps.initialValues?.imageUrl),
  };

  const imageUrl = Form.useWatch("imageUrl", formProps.form);

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
        <Form {...formProps} initialValues={initialValues} layout="vertical">
          <Form.Item
            name="imageUrl"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (!e || !e.fileList) return [];
              return e.fileList.map((file: UploadFile) => ({
                url: file.response?.url || file.url || file.thumbUrl,
                name: file.name,
                uid: file.uid,
                originFileObj: file.originFileObj,
              }));
            }}
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Image is required!" }]}
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/media/upload`}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              className={styles.uploadDragger}
              showUploadList={true}
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
                    width: imageUrl?.length ? "100%" : "48px",
                    height: imageUrl?.length ? "100%" : "48px",
                    marginTop: imageUrl?.length ? undefined : "auto",
                    transform: imageUrl?.length ? undefined : "translateY(50%)",
                  }}
                  src={
                    Array.isArray(imageUrl) && imageUrl.length > 0
                      ? imageUrl[0]?.url || "/images/inspector-default-img.png"
                      : typeof imageUrl === "string"
                      ? imageUrl
                      : "/images/inspector-default-img.png"
                  }
                  alt="Inspector Image"
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                    ...(!!imageUrl && {
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
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label="Availability"
              name="isAvailable"
              rules={[{ required: true }]}
            >
              <Select options={availabilityOptions} />
            </Form.Item>
            <Flex align="center" justify="space-between">
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
