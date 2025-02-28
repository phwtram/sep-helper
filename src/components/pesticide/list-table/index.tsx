import React, { useEffect, useState } from "react";
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
import { axiosClient } from "@/lib/api/config/axios-client";
import { IPesticide } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { PesticideDrawerShow } from "../drawer-show";

interface FilterState {
  name: string;
  description: string;
  status: string[];
  type: string[];
}

export const PesticidesListTable: React.FC = () => {
  const { token } = theme.useToken();

  const [pesticides, setPesticides] = useState<IPesticide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    description: "",
    status: [],
    type: [],
  });
  const [sorters, setSorters] = useState<any>([]);
  const [selectedPesticideId, setSelectedPesticideId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchPesticides = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/api/pesticides", {
          params: {
            filters: filters,
            sorters: sorters,
          },
        });

        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setPesticides(response.data.data);
        } else {
          setError("Không thể tải danh sách thuốc trừ sâu.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải danh sách thuốc trừ sâu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPesticides();
  }, [filters, sorters]);

  if (loading) return <Typography.Text>Loading...</Typography.Text>;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <>
      <Table
        dataSource={pesticides}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          total: pesticides.length,
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
          render={(value) => <Typography.Text>#{value}</Typography.Text>}
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
        <Table.Column title="Name" dataIndex="name" key="name" />
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
          render={(value: number) => <Typography.Text>{value}</Typography.Text>}
        />
        <Table.Column
          title="Total Quantity"
          dataIndex="total_quantity"
          key="total_quantity"
          align="right"
          render={(value: number) => <Typography.Text>{value}</Typography.Text>}
        />
        <Table.Column title="Unit" dataIndex="unit" key="unit" width={100} />
        <Table.Column
          title="Type"
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => (
            <Tag
              color={
                value === "Insecticide"
                  ? "green"
                  : value === "Fungicide"
                  ? "red"
                  : value === "Herbicide"
                  ? "blue"
                  : "purple"
              }
            >
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
                setSelectedPesticideId(record.id.toString());
              }}
            />
          )}
        />
      </Table>

      {/* Drawer for viewing the selected pesticide */}
      {selectedPesticideId && (
        <PesticideDrawerShow
          id={selectedPesticideId}
          onClose={() => setSelectedPesticideId(null)}
        />
      )}
    </>
  );
};
