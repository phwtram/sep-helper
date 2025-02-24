import { useSimpleList } from "@refinedev/antd";
import {
  type HttpError,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";

import {
  Card,
  Divider,
  Flex,
  List,
  Tag,
  Typography,
  theme,
} from "antd";

import { EyeOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";
import { useLocation } from "react-router";
import { IInspector, InspectorAvailability } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { useStyles } from "./styled";

const additionalStyles = {
  image: {
    aspectRatio: '288/160',
    objectFit: 'cover',
    width: '100%',
  } as CSSProperties,
  availabilityTag: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1,
  } as CSSProperties
};

export const InspectorListCard = () => {
  const { token } = theme.useToken();
  const { styles, cx } = useStyles();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { listProps } = useSimpleList<IInspector, HttpError>({
    resource: "inspector",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  const getAvailabilityColor = (availability: InspectorAvailability) => {
    return availability === "Available" ? "green" : "red";
  };

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...listProps}
        pagination={{
          ...listProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="inspectors" />
          ),
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
          xxl: 4,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        renderItem={(inspector) => (
          <List.Item style={{ height: "100%" }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: {
                  padding: 16,
                },
                cover: {
                  position: "relative",
                },
                actions: {
                  marginTop: "auto",
                },
              }}
              cover={
                <>
                  <Tag
                    onClick={() => {
                      return go({
                        to: `${showUrl("inspector", inspector.id)}`,
                        query: {
                          to: pathname,
                        },
                        options: {
                          keepQuery: true,
                        },
                        type: "replace",
                      });
                    }}
                    className={cx(styles.viewButton, "viewButton")}
                    icon={<EyeOutlined />}
                  >
                    View
                  </Tag>
                  <Tag
                    color={getAvailabilityColor(inspector.isAvailable)}
                    style={additionalStyles.availabilityTag}
                  >
                    {inspector.isAvailable}
                  </Tag>
                  <img
                    src={inspector.imageUrl || "/images/inspector-default-img.png"}
                    alt={inspector.name}
                    style={additionalStyles.image}
                  />
                </>
              }
              actions={[
                <Flex
                  key="actions"
                  justify="space-between"
                  style={{
                    padding: "0 16px",
                  }}
                >
                  <Typography.Text type="secondary">
                    {inspector.accountID}
                  </Typography.Text>
                </Flex>,
              ]}
            >
              <Card.Meta
                title={
                  <Flex align="center" justify="space-between">
                    <Typography.Title
                      level={5}
                      ellipsis={{
                        rows: 1,
                        tooltip: inspector.name,
                      }}
                      style={{ marginBottom: 0 }}
                    >
                      {inspector.name}
                    </Typography.Title>
                  </Flex>
                }
                description={
                  <Typography.Paragraph
                    ellipsis={{
                      rows: 2,
                      tooltip: inspector.description,
                    }}
                    style={{ marginBottom: 0 }}
                  >
                    {inspector.description}
                  </Typography.Paragraph>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
