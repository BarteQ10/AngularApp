export interface Order {
  Id: number;
  StatusName: string;
  SenderMail: string;
  ReceiverMail: string;
  ChamberId: string;
  PaymentMethodName: string;
  Description: string;
  Active: boolean;
  StartDate: string;
  EndDate: string;
  MachineIdFrom: number;
  MachineIdTo: number;
  DeliveryDate: string;
  ReturnDeliveryDate: string | null;
  Postponed: boolean;
  PostponedDays: number | null;
  IsReturn: boolean;
  DeliveryCost: number;
}