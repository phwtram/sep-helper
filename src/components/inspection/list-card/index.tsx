import { useSimpleList } from "@refinedev/antd";
import {
  type HttpError,
  useGo,
  useNavigation,
  useTranslate,
  useList,
} from "@refinedev/core";
import {
  Button,
  Card,
  Divider,
  Flex,
  List,
  Tag,
  Typography,
  theme,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";
import { useLocation } from "react-router";
import { IInspector, InspectorAvailability, IInspectingTask } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { useStyles } from "./styled";

const additionalStyles = {
  image: {
    aspectRatio: '288/160',
    objectFit: 'cover',
    width: '100%',
  } as CSSProperties,
  availabilityTag: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1,
  } as CSSProperties,
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

// Interface kết hợp Inspector và Task
export interface IInspectorWithTask extends IInspector {
  task?: IInspectingTask;
}

export const InspectorListCard = () => {
  const { token } = theme.useToken();
  const { styles, cx } = useStyles();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  // Fetch danh sách inspectors
  const { data: inspectorData } = useList<IInspector>({
    resource: "inspector",
  });

  // Fetch danh sách inspectingTasks
  const { data: taskData } = useList<IInspectingTask>({
    resource: "inspectingTask",
  });

  // Kết hợp dữ liệu inspectors với tasks
  const combinedData: IInspectorWithTask[] =
    inspectorData?.data.map((inspector) => {
      const task = taskData?.data.find((t) => t.inspectorID === inspector.id);
      return { ...inspector, task };
    }) || [];

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        dataSource={combinedData}
        pagination={{
          showTotal: (total) => <PaginationTotal total={total} entityName="inspector" />,
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
        }}
        renderItem={(inspector) => (
          <List.Item>
            <Card hoverable bordered={false}>
              <Tag color={getStatusColor(inspector.task?.status)}>{inspector.task?.status?.toUpperCase()}</Tag>
              <Typography.Title level={5}>{inspector.name}</Typography.Title>
              <Typography.Text>{inspector.task?.taskName}</Typography.Text>
              <Button
                icon={<EyeOutlined />}
                onClick={() => go({ to: `/inspector/show/${inspector.id}`, query: { to: pathname }, type: "replace" })}
              >
                View
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
