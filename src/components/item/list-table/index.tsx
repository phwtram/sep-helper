import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGo } from "@refinedev/core";
import { useLocation } from "react-router-dom";
import { axiosClient } from "@/lib/api/config/axios-client";
import { PaginationTotal } from "@/components/paginationTotal";
import { ItemStatusTag } from "../status";
import { IItem } from "@/interfaces";
import { ItemDrawerShow } from "../drawer-show";

export const ItemsListTable: React.FC = () => {
  const go = useGo();
  const { pathname } = useLocation();

  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosClient.get("/api/items");
        if (response.data.status === 200 && Array.isArray(response.data.data)) {
          setItems(response.data.data);
        } else {
          setError("Không thể tải danh sách sản phẩm.");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getTypeColor = (type: string) => {
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

  if (loading) return <Spin size="large" className="flex justify-center" />;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <>
      <Table
        dataSource={items}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="items" />
          ),
        }}
      >
        <Table.Column title="ID" dataIndex="id" key="id" width={80} />
        <Table.Column
          title="Image"
          dataIndex="image"
          key="image"
          render={(image) => <Avatar shape="square" src={image} alt="Item" />}
        />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
          width={300}
        />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <ItemStatusTag value={value} />}
        />
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
          render={(_, record: IItem) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                console.log("Opening drawer for ID:", record.id);
                setSelectedItemId(record.id.toString());
              }}
            />
          )}
        />
      </Table>
      {selectedItemId && (
        <ItemDrawerShow
          id={selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </>
  );
};
