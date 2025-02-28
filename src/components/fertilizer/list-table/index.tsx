import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { axiosClient } from "@/lib/api/config/axios-client";
import { PaginationTotal } from "@/components/paginationTotal";
import { FertilizerStatusTag } from "../status";
import { IFertilizer } from "@/interfaces";
import { FertilizerDrawerShow } from "../drawer-show";

export const FertilizersListTable: React.FC = () => {
  const { pathname } = useLocation();

  const [fertilizers, setFertilizers] = useState<IFertilizer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFertilizerId, setSelectedFertilizerId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        const response = await axiosClient.get("/api/fertilizers");
        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setFertilizers(response.data.data);
        } else {
          setError("Không thể tải danh sách phân bón.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải danh sách phân bón.");
      } finally {
        setLoading(false);
      }
    };

    fetchFertilizers();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Đạm":
        return "blue";
      case "Kali":
        return "red";
      case "Lân":
        return "orange";
      case "Hữu cơ":
        return "green";
      case "Vi sinh":
        return "purple";
      default:
        return "default";
    }
  };

  if (loading) return <Spin size="large" className="flex justify-center" />;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <>
      <Table
        dataSource={fertilizers}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="fertilizers" />
          ),
        }}
      >
        <Table.Column title="ID" dataIndex="id" key="id" width={80} />
        <Table.Column
          title="Image"
          dataIndex="image"
          key="image"
          render={(image) => (
            <Avatar shape="square" src={image} alt="Fertilizer" />
          )}
        />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
          width={300}
        />
        <Table.Column
          title="Available Quantity"
          dataIndex="available_quantity"
          key="available_quantity"
          align="right"
        />
        <Table.Column
          title="Total Quantity"
          dataIndex="total_quantity"
          key="total_quantity"
          align="right"
        />
        <Table.Column title="Unit" dataIndex="unit" key="unit" width={100} />
        <Table.Column
          title="Type"
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => <Tag color={getTypeColor(value)}>{value}</Tag>}
        />
        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IFertilizer) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedFertilizerId(record.id.toString())}
            />
          )}
        />
      </Table>

      {selectedFertilizerId && (
        <FertilizerDrawerShow
          id={selectedFertilizerId ? Number(selectedFertilizerId) : undefined}
          onClose={() => setSelectedFertilizerId(null)}
        />
      )}
    </>
  );
};
