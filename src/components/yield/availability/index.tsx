import { YieldAvailability } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";


interface Props {
  value: YieldAvailability;
}

export const YieldAvailabilityTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Available</Tag>;
    case "Unavailable":
      return <Tag color="red">Unavailablek</Tag>;
  }
};