import exp from "constants";
import type { Dayjs } from "dayjs";

export interface IOrderChart {
  count: number;
  status:
    | "waiting"
    | "ready"
    | "on the way"
    | "delivered"
    | "could not be delivered";
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: IFile[];
  addresses: IAddress[];
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: IProduct[];
  status: IOrderStatus;
  adress: IAddress;
  store: IStore;
  courier: ICourier;
  events: IEvent[];
  orderNumber: number;
  amount: number;
}
export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}

export interface IProductivityOverTimeEntry {
  key: number;
  timestamp: string;
  value: number;
}
export interface IQuickStatsEntry {
  key: number;
  stat_name: string;
  value: number;
  description: string;
}

export interface ISeasonProgressEntry {
  key: number;
  timestamp: string;
  progress: number;
}

export type FertilizerStatus = "UnActived" | "InStock" | "OutStock";
export type FertilizerType = "Organic" | "Chemical" | "Mixed";
export type ItemStatus = "UnActived" | "InStock" | "OutStock";
export type ItemType = "Productive" | "Harvestive" | "Packaging" | "Inspecting";
export type SeedTestKitColor = "Blue" | "Yellow" | "Red" | "Orange";
export type SeedAvailability = "Available" | "Unavailable";
export type YieldType = "Đất thịt" | "Đất mùn" ;
export type YieldAvailability = "Available" | "Unavailable";
export type YieldSize = "Small" | "Medium" | "Large";
export type PesticideStatus = "UnActived" | "InStock" | "OutStock";
export type PesticideType = "Insecticide" | "Fungicide" | "Herbicide"| "Other";
export type InspectorAvailability = "Available" | "Unavailable";
export type InspectingTaskStatus = "pending" | "ongoing" | "completed" | "cancel";
export type InspectingTestKitColor = "Blue" | "Yellow" | "Red" | "Orange";
export interface IFertilizer {
  id: number;
  name: string;
  description: string;
  image: string;
  available_quantity: number;
  unit: string;
  total_quantity: number;
  status: FertilizerStatus;
  type: FertilizerType;
}

export interface IItem {
  id: number;
  name: string;
  description: string;
  image: string;
  status: ItemStatus;
  type: ItemType;
}

export interface ISeed {
  id: number;
  name: string;
  Description: string;
  IsAvailable: SeedAvailability;
  MinTemp: number;
  MaxTemp: number;
  MinHumid: number;
  MaxHumid: number;
  MinMoisture: number;
  MaxMoisture: number;
  MinFertilizerQuantity: number;
  MaxFertilizerQuantity: number;
  FertilizerUnit: string;
  MinPesticideQuantity: number;
  MaxPesticideQuantity: number;
  PesticideUnit: string;
  MinBrixPoint: number;
  MaxBrixPoint: number;
  GTTestKitColor: SeedTestKitColor;
}

export interface IYield {
  id: number;
  name: string;
  areaUnit: string;
  area: number;
  type: YieldType;
  description: string;
  isAvailable: YieldAvailability;
  size: YieldSize;
}

export interface IPesticide {
  id: number;
  name: string;
  description: string;
  unit: string;
  image: string;
  available_quantity: number;
  total_quantity: number;
  status: PesticideStatus;
  type: PesticideType;
}

export interface IInspector {
  id: number
  accountID: string;
  address: string;
  name: string;
  imageUrl: string;
  description: string;
  isAvailable: InspectorAvailability;
}
export interface IInspectingTask {
  taskID: number;
  planID: number;
  taskName: string;
  taskType: string; 
  description: string;
  startDate: Date;
  endDate: Date;
  resultContent: string;
  brixPoint?: number;
  temperature?: number;
  humidity?: number;
  moisture?: number;
  shellColor?: string; 
  testGTKitColor?: InspectingTestKitColor;
  inspectingQuantity: number;
  unit: string;
  issuePercent: number; 
  canHarvest: boolean;
  completedDate?: Date;
  inspectorID: number;
  status: InspectingTaskStatus;
  createdAt: Date;
  updatedAt: Date;
}