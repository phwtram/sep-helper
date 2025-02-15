import {
  type HttpError,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { FilterDropdown, useTable } from "@refinedev/antd";

import {
  Button,
  Input,
  Table,
  Tag,
  Typography,
  theme,
} from "antd";

import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IYield, YieldType, YieldAvailability, YieldSize } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";

export const YieldListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps } = useTable<IYield, HttpError>({
    resource: "yield",
    filters: {
      initial: [
        { field: "name", operator: "contains", value: "" },
        { field: "description", operator: "contains", value: "" },
      ],
    },
  });

  // Chuyển đổi dữ liệu API về đúng định dạng interface IYield
  const normalizedData = tableProps?.dataSource?.map((item) => ({
    ...item,
    areaUnit: item.areaUnit ?? item.areaUnit ?? "-",
    area: item.area ?? item.area ?? "-",
  })) || [];

  console.log("Normalized Data:", normalizedData);

  return (
    <Table
      {...tableProps}
      dataSource={normalizedData}
      rowKey={(record) => record.id?.toString() || Math.random().toString()}
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="yields" />
        ),
      }}
    >
      {/* ✅ ID */}
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={80}
        align="center"
        render={(value) => (
          <Typography.Text strong>#{value ?? "-"}</Typography.Text>
        )}
      />

      {/* ✅ Name */}
      <Table.Column
        title="Name"
        dataIndex="name"
        key="name"
        align="left"
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search name" />
          </FilterDropdown>
        )}
      />

      {/* ✅ Description */}
      <Table.Column
        title="Description"
        dataIndex="description"
        key="description"
        width={250}
        render={(value) => (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: value }}>
            {value || "-"}
          </Typography.Paragraph>
        )}
      />

      {/* ✅ Availability */}
      <Table.Column
        title="Availability"
        dataIndex="isAvailable"
        key="isAvailable"
        width={140}
        align="center"
        render={(value: YieldAvailability | null) => (
          <Tag color={value === "Available" ? "green" : "red"}>
            {value || "Unavailable"}
          </Tag>
        )}
      />

      <Table.Column
        title="Area"
        key="area"
        width={120}
        render={(_, record) => {
          console.log("✅ Area Data Record:", record);
          return <Typography.Text>{record.area ?? "-"}</Typography.Text>;
        }}
      />

      <Table.Column
        title="Area Unit"
        key="areaUnit"
        width={120}
        render={(_, record) => {
          console.log("✅ Area Unit Data Record:", record);
          return <Typography.Text>{record.areaUnit ?? "-"}</Typography.Text>;
        }}
      />


      {/* ✅ Type */}
      <Table.Column
        title="Type"
        dataIndex="type"
        key="type"
        width={120}
        align="center"
        render={(value: YieldType) => (
          <Tag color="purple">{value || "-"}</Tag>
        )}
      />

      {/* ✅ Size */}
      <Table.Column
        title="Size"
        dataIndex="size"
        key="size"
        width={120}
        align="center"
        render={(value: YieldSize) => (
          <Tag color="blue">{value || "-"}</Tag>
        )}
      />

      {/* ✅ Actions */}
      <Table.Column
        title="Actions"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IYield) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `/yield/show/${record.id}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      />
    </Table>
  );
};
