import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGo } from "@refinedev/core";
import { useLocation } from "react-router-dom";
import { axiosClient } from "@/lib/api/config/axios-client";
import { PaginationTotal } from "@/components/paginationTotal";
import { IYield, YieldAvailability, YieldSize, YieldType } from "@/interfaces";
import { YieldDrawerShow } from "../drawer-show";

export const YieldListTable: React.FC = () => {
  const go = useGo();
  const { pathname } = useLocation();

  // State lưu trữ dữ liệu từ API
  const [yields, setYields] = useState<IYield[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYieldId, setSelectedYieldId] = useState<string | null>(null);

  // Gọi API khi component mount
  useEffect(() => {
    const fetchYields = async () => {
      try {
        const response = await axiosClient.get("/api/yields");
        if (response.data.status === 200 && Array.isArray(response.data.data)) {
          setYields(response.data.data);
        } else {
          setError("Không thể tải danh sách yields.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải danh sách yields.");
      } finally {
        setLoading(false);
      }
    };

    fetchYields();
  }, []);

  const getTypeColor = (type: YieldType) => {
    switch (type) {
      case "Đất thịt":
        return "blue";
      case "Đất mùn":
        return "green";
      default:
        return "default";
    }
  };

  if (loading) return <Spin size="large" className="flex justify-center" />;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <>
      <Table
        dataSource={yields}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="yields" />
          ),
        }}
      >
        <Table.Column title="ID" dataIndex="id" key="id" width={80} />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
          width={300}
        />
        <Table.Column
          title="Availability"
          dataIndex="isAvailable"
          key="isAvailable"
          width={120}
          render={(value: YieldAvailability) => (
            <Tag color={value === "Available" ? "green" : "red"}>{value}</Tag>
          )}
        />
        <Table.Column title="Area" dataIndex="area" key="area" width={120} />
        <Table.Column
          title="Area Unit"
          dataIndex="areaUnit"
          key="areaUnit"
          width={120}
        />
        <Table.Column
          title="Type"
          dataIndex="type"
          key="type"
          width={120}
          render={(value: YieldType) => (
            <Tag color={getTypeColor(value)}>{value}</Tag>
          )}
        />
        <Table.Column
          title="Size"
          dataIndex="size"
          key="size"
          width={120}
          render={(value: YieldSize) => <Tag color="blue">{value}</Tag>}
        />
        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IYield) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedYieldId(record.id.toString())}
            />
          )}
        />
      </Table>

      {selectedYieldId && (
        <YieldDrawerShow
          id={selectedYieldId}
          onClose={() => setSelectedYieldId(null)}
        />
      )}
    </>
  );
};
