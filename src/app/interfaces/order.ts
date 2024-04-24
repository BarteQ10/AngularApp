// interfaces/order.ts
export interface Order {
    id: number;
    customer: string;
    orderDate: Date;
    status: string;
  }