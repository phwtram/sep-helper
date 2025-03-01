import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  type BaseKey,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Grid,
  Button,
  Flex,
  Spin,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { useStyles } from "./styled";
import { IYield, YieldType, YieldAvailability, YieldSize } from "@/interfaces";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const YieldDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const { styles } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IYield>({
      resource: "yield",
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

  const title = props.action === "edit" ? "Edit Yield" : "Add Yield";

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "400px" : "100%"}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Flex vertical>
            <Form.Item
              label="Yield Name"
              name="yield_name"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Area Unit"
              name="areaUnit"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Hectare", value: "hectare" },
                  { label: "Acre", value: "acre" },
                  { label: "Square Meter", value: "square meter" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Area (sq. meters)"
              name="area"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Yield Type"
              name="type"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Đất thịt", value: "Đất thịt" },
                  { label: "Đất mùn", value: "Đất mùn" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              className={styles.formItem}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Availability"
              name="isAvailable"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Available", value: "Available" },
                  { label: "Unavailable", value: "Unavailable" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Size"
              name="size"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Small", value: "Small" },
                  { label: "Medium", value: "Medium" },
                  { label: "Large", value: "Large" },
                ]}
              />
            </Form.Item>

            <Flex
              align="center"
              justify="space-between"
              style={{ paddingTop: 16 }}
            >
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
