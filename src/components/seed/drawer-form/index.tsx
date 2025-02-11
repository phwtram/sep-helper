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
  InputNumber,
  Select,
  Grid,
  Button,
  Flex,
  Spin,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { useStyles } from "./styled";
import { ISeed } from "@/interfaces";

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
  const breakpoint = Grid.useBreakpoint();
  const { styles } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<ISeed>({
      resource: "seeds",
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

  const title = props.action === "edit" ? "Edit Seed" : "Add Seed";

  const gtTestKitColorOptions = [
    { label: "Blue", value: "Blue" },
    { label: "Yellow", value: "Yellow" },
    { label: "Red", value: "Red" },
    { label: "Orange", value: "Orange" },
  ];

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
              label="Seed Name"
              name="SeedName"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="Description"
              className={styles.formItem}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Availability"
              name="IsAvailable"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Available", value: true },
                  { label: "Not Available", value: false },
                ]}
              />
            </Form.Item>

            {/* Temperature */}
            <Form.Item label="Temperature (°C)" className={styles.formItem}>
              <Flex gap={8}>
                <Form.Item name="MinTemp" noStyle>
                  <InputNumber min={0} placeholder="Min" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="MaxTemp" noStyle>
                  <InputNumber min={0} placeholder="Max" style={{ width: "100%" }} />
                </Form.Item>
              </Flex>
            </Form.Item>

            {/* Humidity */}
            <Form.Item label="Humidity (%)" className={styles.formItem}>
              <Flex gap={8}>
                <Form.Item name="MinHumid" noStyle>
                  <InputNumber min={0} max={100} placeholder="Min" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="MaxHumid" noStyle>
                  <InputNumber min={0} max={100} placeholder="Max" style={{ width: "100%" }} />
                </Form.Item>
              </Flex>
            </Form.Item>

            {/* Fertilizer */}
            <Form.Item label="Fertilizer (Kg)" className={styles.formItem}>
              <Flex gap={8}>
                <Form.Item name="MinFertilizerQuantity" noStyle>
                  <InputNumber min={0} placeholder="Min" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="MaxFertilizerQuantity" noStyle>
                  <InputNumber min={0} placeholder="Max" style={{ width: "100%" }} />
                </Form.Item>
              </Flex>
            </Form.Item>

            {/* Pesticide */}
            <Form.Item label="Pesticide (Litre)" className={styles.formItem}>
              <Flex gap={8}>
                <Form.Item name="MinPesticideQuantity" noStyle>
                  <InputNumber min={0} placeholder="Min" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="MaxPesticideQuantity" noStyle>
                  <InputNumber min={0} placeholder="Max" style={{ width: "100%" }} />
                </Form.Item>
              </Flex>
            </Form.Item>

            {/* Brix Point */}
            <Form.Item label="Brix Point" className={styles.formItem}>
              <Flex gap={8}>
                <Form.Item name="MinBrixPoint" noStyle>
                  <InputNumber min={0} placeholder="Min" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="MaxBrixPoint" noStyle>
                  <InputNumber min={0} placeholder="Max" style={{ width: "100%" }} />
                </Form.Item>
              </Flex>
            </Form.Item>

            {/* GT Test Kit Color */}
            <Form.Item
              label="GT Test Kit Color"
              name="GTTestKitColor"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
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
