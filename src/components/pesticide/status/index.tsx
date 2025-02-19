import { PesticideStatus } from "@/interfaces";
import { Tag } from "antd";


interface Props {
  value: PesticideStatus;
}

export const PesticideStatusTag: React.FC<Props> = ({ value }) => {
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