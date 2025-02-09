import { ItemStatus } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";


interface Props {
  value: ItemStatus;
}

export const ItemStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "InStock":
      return <Tag color="green">In Stock</Tag>;
    case "OutStock":
      return <Tag color="red">Out of Stock</Tag>;
    case "UnActived":
      return <Tag color="default">Inactive</Tag>;
    default:
      return null;
  }
};