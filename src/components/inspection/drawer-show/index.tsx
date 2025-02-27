import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
  useList,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Typography,
  theme,
  Tag,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { IInspector, InspectorAvailability, IInspectingTask, InspectingTestKitColor } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

// Component đổi màu trạng thái của Task
const TaskStatusTag = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    completed: "green",
    ongoing: "blue",
    pending: "gold",
    cancel: "red",
  };

  return <Tag color={colorMap[status] || "gray"}>{status.toUpperCase()}</Tag>;
};

// Component hiển thị trạng thái Availability
const AvailabilityTag = ({ availability }: { availability: InspectorAvailability }) => {
  const isAvailable = availability === "Available";
  return (
    <Tag color={isAvailable ? "green" : "red"} style={{ padding: "4px 12px", fontSize: "14px" }}>
      {isAvailable ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {isAvailable ? "Available" : "Not Available"}
    </Tag>
  );
};

// Component hiển thị màu GT Test Kit
const GTTestKitColorTag = ({ color }: { color?: InspectingTestKitColor }) => {
  if (!color) return <Tag color="default">N/A</Tag>;

  const colorMap: Record<InspectingTestKitColor, string> = {
    Blue: "blue",
    Yellow: "gold",
    Red: "red",
    Orange: "orange",
  };

  return <Tag color={colorMap[color] || "gray"}>{color}</Tag>;
};

export const InspectorDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  // Fetch dữ liệu của Inspector
  const { query: queryResult } = useShow<IInspector, HttpError>({
    resource: "inspector",
    id: props?.id,
  });

  // Fetch danh sách nhiệm vụ của Inspector (lọc theo `inspectorID`)
  const { data: taskData } = useList<IInspectingTask>({
    resource: "inspectingTask",
  });

  const inspector = queryResult.data?.data;

  // Lọc chỉ các `inspectingTask` có `inspectorID` khớp với `inspector` hiện tại
  const inspectorTasks = taskData?.data.filter(task => task.inspectorID === inspector?.id) || [];

  const handleDrawerClose = () => {
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

  return (
    <Drawer
      open={true}
      width={breakpoint.sm ? "500px" : "100%"}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      {/* Avatar + Name + Description */}
      <Flex vertical align="center" justify="center" style={{ padding: "16px" }}>
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: "contain",
            width: "160px",
            height: "160px",
            borderRadius: "8px",
          }}
          src={inspector?.imageUrl || "/images/inspector-default-img.png"}
          alt={inspector?.name}
        />
        <Typography.Title level={4} style={{ marginTop: "12px" }}>
          {inspector?.name}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: "center", padding: "0 16px" }}>
          {inspector?.description}
        </Typography.Paragraph>
      </Flex>

      <Divider />

      {/* Hiển thị thông tin Inspector */}
      <List
        dataSource={[
          { label: "Account ID", value: inspector?.accountID },
          { label: "Address", value: inspector?.address },
          {
            label: "Availability",
            value: <AvailabilityTag availability={inspector?.isAvailable!} />,
          },
        ]}
        renderItem={(data) => (
          <List.Item style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
            <Typography.Text type="secondary">{data.label}: </Typography.Text>
            <Typography.Text strong>{data.value}</Typography.Text>
          </List.Item>
        )}
      />

      {/* Hiển thị các nhiệm vụ của Inspector này */}
      {inspectorTasks.length > 0 ? (
        <>
          <Divider>Inspecting Tasks</Divider>
          {inspectorTasks.map((task, index) => (
            <div key={task.taskID}>
              <Typography.Title level={5} style={{ padding: "0 16px", marginTop: "16px" }}>
                {task.taskName}
              </Typography.Title>
              <List
                dataSource={[
                  { label: "Task ID", value: task.taskID },
                  { label: "Task Type", value: task.taskType },
                  { label: "Description", value: task.description },
                  { label: "Start Date", value: new Date(task.startDate).toLocaleDateString() },
                  { label: "End Date", value: new Date(task.endDate).toLocaleDateString() },
                  { label: "Temperature (°C)", value: `${task.temperature}°C` },
                  { label: "Humidity (%)", value: `${task.humidity}%` },
                  { label: "Moisture (%)", value: task.moisture ? `${task.moisture}%` : "N/A" },
                  { label: "Inspecting Quantity", value: `${task.inspectingQuantity} ${task.unit}` },
                  { label: "Issue Percent", value: `${task.issuePercent}%` },
                  { label: "Can Harvest", value: task.canHarvest ? "Yes" : "No" },
                  {
                    label: "GT Test Kit Color",
                    value: <GTTestKitColorTag color={task.testGTKitColor} />,
                  },
                  { label: "Status", value: <TaskStatusTag status={task.status} /> },
                ]}
                renderItem={(data) => (
                  <List.Item style={{ display: "flex", justifyContent: "space-between", padding: "8px 16px" }}>
                    <Typography.Text type="secondary">{data.label}: </Typography.Text>
                    <Typography.Text strong>{data.value}</Typography.Text>
                  </List.Item>
                )}
              />
              {index < inspectorTasks.length - 1 && <Divider style={{ margin: "8px 0" }} />}
            </div>
          ))}
        </>
      ) : (
        <Typography.Text style={{ padding: "16px" }}>No tasks assigned to this inspector.</Typography.Text>
      )}

      {/* Buttons */}
      {/* <Divider />
      <Flex align="center" justify="space-between" style={{ padding: "16px" }}>
        <DeleteButton
          type="text"
          recordItemId={inspector?.id}
          resource="inspector"
          style={{ color: "red", fontWeight: "bold" }}
        />
      </Flex> */}
    </Drawer>
  );
};