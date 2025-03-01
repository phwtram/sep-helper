import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGo } from "@refinedev/core";
import { useLocation } from "react-router-dom";
import { axiosClient } from "@/lib/api/config/axios-client";
import { PaginationTotal } from "@/components/paginationTotal";
import { ISeed } from "@/interfaces";
import { SeedDrawerShow } from "../drawer-show";

export const SeedsListTable: React.FC = () => {
  const go = useGo();
  const { pathname } = useLocation();

  const [plants, setPlants] = useState<ISeed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axiosClient.get("/api/plants");
        console.log("API Response:", response.data);

        if (response.status === 200 && Array.isArray(response.data.data)) {
          setPlants(response.data.data); 
        } else {
          setError("Không thể tải danh sách cây trồng.");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Có lỗi xảy ra khi tải danh sách cây trồng.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // 🎨 Màu sắc GT Test Kit Color
  const getGTTestKitColor = (color: string | null | undefined) => {
    const colorMap: Record<string, string> = {
      Blue: "blue",
      Yellow: "gold",
      Red: "red",
      Orange: "orange",
      Green: "green",
    };
    return colorMap[color || ""] || "default";
  };

  if (loading) return <Spin size="large" className="flex justify-center" />;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <>
      <Table
        dataSource={plants}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          showTotal: (total) => <PaginationTotal total={total} entityName="plants" />,
        }}
      >
        {/* ✅ ID */}
        <Table.Column title="ID" dataIndex="id" key="id" width={80} />

        {/* ✅ Image */}
        <Table.Column
          title="Image"
          dataIndex="image_url"
          key="image_url"
          render={(image) => <Avatar shape="square" src={image} alt="Plant" />}
        />

        {/* ✅ Name */}
        <Table.Column title="Plant Name" dataIndex="plant_name" key="plant_name" />

        {/* ✅ Description */}
        <Table.Column title="Description" dataIndex="description" key="description" width={300} />

        {/* ✅ Availability */}
        <Table.Column
          title="Availability"
          dataIndex="is_available"
          key="is_available"
          width={140}
          align="center"
          render={(value) => (
            <Tag color={value ? "green" : "red"}>
              {value ? "Available" : "Not Available"}
            </Tag>
          )}
        />

        {/* ✅ Temperature */}
        <Table.Column
          title="Temperature (°C)"
          key="temperature"
          width={180}
          render={(_, record: ISeed) => (
            <Typography.Text>
              {record.min_temp} - {record.max_temp}°C
            </Typography.Text>
          )}
        />

        {/* ✅ Humidity */}
        <Table.Column
          title="Humidity (%)"
          key="humidity"
          width={180}
          render={(_, record: ISeed) => (
            <Typography.Text>
              {record.min_humid} - {record.max_humid}%
            </Typography.Text>
          )}
        />

        {/* ✅ Fertilizer */}
        <Table.Column
          title="Fertilizer"
          key="fertilizer"
          width={200}
          render={(_, record: ISeed) => (
            <Tag color="blue">
              {record.min_fertilizer} - {record.max_fertilizer} {record.fertilizer_unit}
            </Tag>
          )}
        />

        {/* ✅ Pesticide */}
        <Table.Column
          title="Pesticide"
          key="pesticide"
          width={200}
          align="center"
          render={(_, record: ISeed) => (
            <Tag color="gold">
              {record.min_pesticide} - {record.max_pesticide} {record.pesticide_unit}
            </Tag>
          )}
        />

        {/* ✅ GT Test Kit Color */}
        <Table.Column
          title="GT Test Kit Color"
          dataIndex="gt_test_kit_color"
          key="gt_test_kit_color"
          width={120}
          align="center"
          render={(value) => <Tag color={getGTTestKitColor(value)}>{value || "-"}</Tag>}
        />

        {/* ✅ Actions */}
        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: ISeed) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                console.log("Opening drawer for ID:", record.id);
                setSelectedPlantId(record.id.toString());
              }}
            />
          )}
        />
      </Table>

      {selectedPlantId && (
        <SeedDrawerShow id={selectedPlantId} onClose={() => setSelectedPlantId(null)} />
      )}
    </>
  );
};
