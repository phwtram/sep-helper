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
import { UploadFile } from "antd";

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

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IItem>({
      resource: "item",
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

  const normalizeImage = (image: any) => {
    if (!image) return [];
    if (Array.isArray(image)) return image;
    return [{ url: image }];
  };

  const initialValues = {
    ...formProps.initialValues,
    image: normalizeImage(formProps.initialValues?.image),
  };

  const image = Form.useWatch("image", formProps.form);
  console.log("Selected image:", image);
  const title = props.action === "edit" ? "Edit Item" : "Add Item";

  const typeOptions = [
    { label: "Productive", value: "Productive" },
    { label: "Harvestive", value: "Harvestive" },
    { label: "Packaging", value: "Packaging" },
    { label: "Inspecting", value: "Inspecting" },
  ];

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
        <Form {...formProps} initialValues={initialValues} layout="vertical">
          <Form.Item
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (!e || !e.fileList) return [];
              return e.fileList.map((file: UploadFile) => ({
                url: file.response?.url || file.url,
                name: file.name,
                uid: file.uid,
                originFileObj: file.originFileObj,
              }));
            }}
            style={{ margin: 0 }}
            rules={[{ required: true }]}
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
                    width: image?.length ? "100%" : "48px",
                    height: image?.length ? "100%" : "48px",
                    marginTop: image?.length ? undefined : "auto",
                    transform: image?.length ? undefined : "translateY(50%)",
                  }}
                  src={
                    image?.length > 0
                      ? image[0]?.url || "/images/item-default-img.png"
                      : "/images/item-default-img.png"
                  }
                  alt="Item Image"
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                    ...(image?.length > 0 && {
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
              label="Name"
              name="name"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={typeOptions} />
            </Form.Item>
            <Flex
              align="center"
              justify="space-between"
              style={{ padding: "16px 16px 0px 16px" }}
            >
              <Button onClick={onDrawerClose}>Cancel</Button>
              <SaveButton
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
