import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { FilterDropdown, getDefaultSortOrder, useTable } from "@refinedev/antd";

import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  Tag,
  Typography,
  theme,
} from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IItem, ItemStatus, ItemType } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { ItemStatusTag } from "../status";

export const ItemsListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IItem, HttpError>({
    resource: "item",
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: "",
        },
        {
          field: "description",
          operator: "contains",
          value: "",
        },
        {
          field: "status",
          operator: "in",
          value: [],
        },
        {
          field: "type",
          operator: "in",
          value: [],
        },
      ],
    },
  });

  const getTypeColor = (type: ItemType) => {
    switch (type) {
      case "Productive":
        return "blue";
      case "Harvestive":
        return "green";
      case "Packaging":
        return "orange";
      case "Inspecting":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="items" />
        ),
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={80}
        render={(value) => <Typography.Text>#{value}</Typography.Text>}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder="Search ID"
            />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Image"
        dataIndex="image"
        key="image"
        render={(image: string) => (
          <Avatar shape="square" src={image} alt="Item" />
        )}
      />

      <Table.Column
        title="Name"
        dataIndex="name"
        key="name"
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search name" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Description"
        dataIndex="description"
        key="description"
        width={300}
        render={(value) => (
          <Typography.Paragraph
            ellipsis={{ rows: 2, tooltip: true }}
            style={{ marginBottom: 0 }}
          >
            {value}
          </Typography.Paragraph>
        )}
      />

      <Table.Column
        title="Status"
        dataIndex="status"
        key="status"
        width={120}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder="Filter by status"
              allowClear
            >
              <Select.Option value="UnActived">UnActived</Select.Option>
              <Select.Option value="InStock">InStock</Select.Option>
              <Select.Option value="OutStock">OutStock</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <ItemStatusTag value={value} />}
      />

      <Table.Column
        title="Type"
        dataIndex="type"
        key="type"
        width={120}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder="Filter by type"
              allowClear
            >
              <Select.Option value="Productive">Productive</Select.Option>
              <Select.Option value="Harvestive">Harvestive</Select.Option>
              <Select.Option value="Packaging">Packaging</Select.Option>
              <Select.Option value="Inspecting">Inspecting</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value: ItemType) => (
          <Tag color={getTypeColor(value)}>{value}</Tag>
        )}
      />

      <Table.Column
        title="Actions"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IItem) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `${showUrl("item", record.id)}`,
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
