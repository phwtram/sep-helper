import {
  type HttpError,
  useGo,
  useList,
} from "@refinedev/core";
import { Table, Avatar, Button, Tag, Typography, theme } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IInspector, InspectorAvailability, IInspectingTask } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";

// Interface kết hợp Inspector và Task
export interface IInspectorWithTaskTable extends IInspector {
  task?: IInspectingTask;
}

// Hàm lấy màu trạng thái của Availability
const getAvailabilityColor = (availability: InspectorAvailability) => {
  return availability === "Available" ? "green" : "red";
};

// Hàm lấy màu trạng thái của Task
const getStatusColor = (status?: string) => {
  const colorMap: Record<string, string> = {
    completed: "green",
    ongoing: "blue",
    pending: "gold",
    cancel: "red",
  };
  return colorMap[status || ""] || "gray";
};

export const InspectorListTable: React.FC = () => {
  const go = useGo();
  const { pathname } = useLocation();

  // Fetch dữ liệu từ API
  const { data: inspectorData, isLoading: loadingInspectors, error: inspectorError } = useList<IInspector>({
    resource: "inspector",
  });

  const { data: taskData, isLoading: loadingTasks, error: taskError } = useList<IInspectingTask>({
    resource: "inspectingTask",
  });

  // Debug lỗi nếu có
  if (inspectorError) console.error("Error fetching inspectors:", inspectorError);
  if (taskError) console.error("Error fetching inspecting tasks:", taskError);

  // Kết hợp dữ liệu inspectors với tasks
  const combinedData: IInspectorWithTaskTable[] =
    inspectorData?.data.map((inspector) => {
      const task = taskData?.data.find((t) => t.inspectorID === inspector.id);
      return { ...inspector, task };
    }) || [];

  // Kiểm tra trạng thái loading hoặc lỗi
  if (loadingInspectors || loadingTasks) return <Typography.Text>Loading...</Typography.Text>;
  if (inspectorError || taskError) return <Typography.Text>Error fetching data!</Typography.Text>;

  return (
    <Table
      dataSource={combinedData}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        showTotal: (total) => <PaginationTotal total={total} entityName="inspector" />,
      }}
    >
      <Table.Column title="ID" dataIndex="id" key="id" width={80} />

      <Table.Column
        title="Avatar"
        dataIndex="imageUrl"
        key="imageUrl"
        render={(imageUrl: string) => (
          <Avatar shape="square" src={imageUrl || "/images/inspector-default-img.png"} />
        )}
      />

      <Table.Column title="Name" dataIndex="name" key="name" />

      <Table.Column
        title="Availability"
        dataIndex="isAvailable"
        key="isAvailable"
        width={120}
        render={(value: InspectorAvailability) => <Tag color={getAvailabilityColor(value)}>{value}</Tag>}
      />

      <Table.Column
        title="Task ID"
        dataIndex="task"
        key="taskID"
        width={80}
        render={(task?: IInspectingTask) => (task ? `#${task.taskID}` : "-")}
      />

      <Table.Column
        title="Task Name"
        dataIndex="task"
        key="taskName"
        width={150}
        render={(task?: IInspectingTask) => (task ? task.taskName : "-")}
      />

      <Table.Column
        title="Status"
        dataIndex="task"
        key="status"
        width={120}
        render={(task?: IInspectingTask) => (
          task ? <Tag color={getStatusColor(task.status)}>{task.status.toUpperCase()}</Tag> : "-"
        )}
      />

      <Table.Column
        title="Actions"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IInspectorWithTaskTable) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `/inspector/show/${record.id}`,
                query: { to: pathname },
                options: { keepQuery: true },
                type: "replace",
              });
            }}
          />
        )}
      />
    </Table>
  );
};
