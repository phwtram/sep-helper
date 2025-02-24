import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  FilterDropdown,
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
import { IInspector, InspectorAvailability } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";

export const InspectorListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IInspector, HttpError>({
      resource: "inspector",
      filters: {
          initial: [
              {
                  field: "name",
                  operator: "contains",
                  value: "",
              },
              {
                  field: "address",
                  operator: "contains",
                  value: "",
              },
              {
                  field: "isAvailable",
                  operator: "eq",
                  value: "",
              },
          ],
      },
  });

  const getAvailabilityColor = (availability: InspectorAvailability) => {
      return availability === "Available" ? "green" : "red";
  };

  return (
      <Table
          {...tableProps}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
              ...tableProps.pagination,
              showTotal: (total) => (
                  <PaginationTotal total={total} entityName="inspectors" />
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
              title="Avatar"
              dataIndex="imageUrl"
              key="imageUrl"
              render={(imageUrl: string) => (
                  <Avatar
                      shape="square"
                      src={imageUrl || "/images/inspector-default-img.png"}
                      alt="Inspector"
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
              title="Address"
              dataIndex="address"
              key="address"
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
              title="Availability"
              dataIndex="isAvailable"
              key="isAvailable"
              width={120}
              filterDropdown={(props) => (
                  <FilterDropdown {...props}>
                      <Select
                          style={{ width: "200px" }}
                          placeholder="Filter by availability"
                          allowClear
                      >
                          <Select.Option value="Available">Available</Select.Option>
                          <Select.Option value="Unavailable">Unavailable</Select.Option>
                      </Select>
                  </FilterDropdown>
              )}
              render={(value: InspectorAvailability) => (
                  <Tag color={getAvailabilityColor(value)}>
                      {value}
                  </Tag>
              )}
          />

          <Table.Column
              title="Actions"
              key="actions"
              fixed="right"
              align="center"
              render={(_, record: IInspector) => (
                  <Button
                      icon={<EyeOutlined />}
                      onClick={() => {
                          go({
                              to: `${showUrl("inspector", record.id)}`,
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
