import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  FilterDropdown,
  NumberField,
  getDefaultSortOrder,
  useTable,
} from "@refinedev/antd";

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
import { IPesticide } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { PesticideStatusTag } from "../status";

export const PesticidesListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IPesticide, HttpError>({
    resource: "pesticide",
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

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="pesticides" />
        ),
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={80}
        render={(value) => (
          <Typography.Text>#{value}</Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined style={{
            color: filtered ? token.colorPrimary : undefined,
          }} />
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
          <Avatar
            shape="square"
            src={image || "/images/pesticide-default-img.png"}
            alt="Pesticide"
          />
        )}
      />

      <Table.Column
        title="Name"
        dataIndex="name"
        key="name"
        filterIcon={(filtered) => (
          <SearchOutlined style={{
            color: filtered ? token.colorPrimary : undefined,
          }} />
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
        title="Available Quantity"
        dataIndex="available_quantity"
        key="available_quantity"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder("available_quantity", sorters)}
        render={(value: number) => (
          <NumberField
            value={value}
            options={{
              maximumFractionDigits: 2,
            }}
          />
        )}
      />

      <Table.Column
        title="Total Quantity"
        dataIndex="total_quantity"
        key="total_quantity"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder("total_quantity", sorters)}
        render={(value: number) => (
          <NumberField
            value={value}
            options={{
              maximumFractionDigits: 2,
            }}
          />
        )}
      />

      <Table.Column
        title="Unit"
        dataIndex="unit"
        key="unit"
        width={100}
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
              <Select.Option value="InStock">In Stock</Select.Option>
              <Select.Option value="OutStock">Out of Stock</Select.Option>
              <Select.Option value="UnActived">Inactive</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <PesticideStatusTag value={value} />}
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
              <Select.Option value="Insecticide">Insecticide</Select.Option>
              <Select.Option value="Fungicide">Fungicide</Select.Option>
              <Select.Option value="Herbicide">Herbicide</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => (
          <Tag color={value === 'Insecticide' ? 'green' : value === 'Fungicide' ? 'red' : value === 'Herbicide' ? 'blue' : 'purple'}>
            {value}
          </Tag>
        )}
      />

      <Table.Column
        title="Actions"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IPesticide) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `${showUrl("pesticide", record.id)}`,
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
