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
import { IItem, ItemType } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { ItemStatusTag } from "../status";
import { useStyles } from "./styled";

const additionalStyles = {
  image: {
    aspectRatio: '288/160',
    objectFit: 'cover',
    width: '100%',
  } as CSSProperties,
  typeTag: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1,
  } as CSSProperties
};

export const ItemsListCard = () => {
  const { token } = theme.useToken();
  const { styles, cx } = useStyles();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { listProps } = useSimpleList<IItem, HttpError>({
    resource: "item",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  const getTypeColor = (type: ItemType) => {
    switch (type) {
      case 'Productive':
        return 'blue';
      case 'Harvestive':
        return 'green';
      case 'Packaging':
        return 'orange';
      case 'Inspecting':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...listProps}
        pagination={{
          ...listProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="items" />
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
        renderItem={(item) => (
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
                        to: `${showUrl("item", item.id)}`,
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
                    color={getTypeColor(item.type)}
                    style={additionalStyles.typeTag}
                  >
                    {item.type}
                  </Tag>
                  <img
                    src={item.image}
                    alt={item.name}
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
                  <ItemStatusTag value={item.status} />
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
                        tooltip: item.name,
                      }}
                      style={{ marginBottom: 0 }}
                    >
                      {item.name}
                    </Typography.Title>
                  </Flex>
                }
                description={
                  <Typography.Paragraph
                    ellipsis={{
                      rows: 2,
                      tooltip: item.description,
                    }}
                    style={{ marginBottom: 0 }}
                  >
                    {item.description}
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