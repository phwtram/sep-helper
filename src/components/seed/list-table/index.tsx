import {
    type HttpError,
    getDefaultFilter,
    useGo,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import {
    FilterDropdown,
    useTable,
} from "@refinedev/antd";

import {
    Button,
    Input,
    InputNumber,
    Table,
    Tag,
    Typography,
    Badge,
    Tooltip,
    theme,
} from "antd";

import {
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";

import { useLocation } from "react-router";
import { ISeed, SeedTestKitColor } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";

export const SeedsListTable: React.FC = () => {
    const { token } = theme.useToken();
    const t = useTranslate();
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl } = useNavigation();

    const { tableProps, sorters, filters } = useTable<ISeed, HttpError>({
        resource: "seed",
        filters: {
            initial: [
                { field: "SeedName", operator: "contains", value: "" },
                { field: "Description", operator: "contains", value: "" },
            ],
        },
    });

    // 🎨 Màu sắc GT Test Kit
    const getGTTestKitColor = (color: SeedTestKitColor | null | undefined) => {
        switch (color) {
            case "Blue": return "blue";
            case "Yellow": return "gold";
            case "Red": return "red";
            case "Orange": return "orange";
            default: return "default";
        }
    };

    return (
        <Table
            {...tableProps}
            rowKey={(record) => record.SeedID?.toString() || Math.random().toString()}
            scroll={{ x: true }}
            pagination={{
                ...tableProps.pagination,
                showTotal: (total) => (
                    <PaginationTotal total={total} entityName="seeds" />
                ),
            }}
        >
            {/* ✅ ID */}
            <Table.Column
                title="ID"
                dataIndex="SeedID"
                key="SeedID"
                width={80}
                align="center"
                render={(value) => <Typography.Text strong>#{value ?? "-"}</Typography.Text>}
            />

            {/* ✅ Name */}
            <Table.Column
                title="Name"
                dataIndex="SeedName"
                key="SeedName"
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
                dataIndex="Description"
                key="Description"
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
                dataIndex="IsAvailable"
                key="IsAvailable"
                width={140}
                align="center"
                render={(value: boolean | null) => (
                    <Tag
                        icon={value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        color={value ? "green" : "red"}
                        style={{ padding: "2px 6px", borderRadius: "6px", fontSize: "12px" }}
                    >
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
                        {record.MinTemp} - {record.MaxTemp}°C
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
                        {record.MinHumid} - {record.MaxHumid}%
                    </Typography.Text>
                )}
            />

            {/* ✅ Fertilizer */}
            <Table.Column
                title="Fertilizer (Kg)"
                key="fertilizer"
                width={180}
                render={(_, record: ISeed) => (
                    <Tag color="blue" style={{ fontSize: "12px", padding: "2px 6px" }}>
                        {record.MinFertilizerQuantity} - {record.MaxFertilizerQuantity} Kg
                    </Tag>
                )}
            />

            {/* ✅ Pesticide */}
            <Table.Column
                title="Pesticide (Litre)"
                key="pesticide"
                width={200}
                align="center"
                render={(_, record: ISeed) => (
                    <Tag color="gold" style={{ padding: "5px 10px", borderRadius: "8px" }}>
                        {record.MinPesticideQuantity} - {record.MaxPesticideQuantity} {record.PesticideUnit ?? ""}
                    </Tag>
                )}
            />

            {/* ✅ GT Test Kit Color */}
            <Table.Column
                title="GT Test Kit Color"
                dataIndex="GTTestKitColor"
                key="GTTestKitColor"
                width={120}
                align="center"
                render={(value) => (
                    <Tag color={getGTTestKitColor(value)}>{value || "-"}</Tag>
                )}
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
                            go({
                                to: `${showUrl("seed", record.SeedID)}`,
                                query: { to: pathname },
                                options: { keepQuery: true },
                                type: "replace",
                            });
                        }}
                    />
                )}
            />
        </Table>
    );
};
