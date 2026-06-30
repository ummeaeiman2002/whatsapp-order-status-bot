export type UserRole = 'Customer' | 'Administrator';

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'In Transit'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Delayed'
  | 'Returned';

export type TrackingStatus =
  | 'Shipment Created'
  | 'Picked Up'
  | 'Hub Received'
  | 'In Transit'
  | 'Destination Hub'
  | 'Out For Delivery'
  | 'Delivered';

export type NotificationType = 'Delay Alert' | 'Delivery Confirmation' | 'Tracking Update';

export type AgentLogAction = 'ORDER_FETCHED' | 'TRACKING_ANALYZED' | 'DELAY_DETECTED' | 'RESPONSE_GENERATED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  courier_name: string;
  expected_delivery_date: string;
  created_at: string;
}

export interface TrackingUpdate {
  id: string;
  order_id: string;
  current_status: TrackingStatus;
  current_location: string;
  update_time: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  session_id: string;
  message: string;
  sender: 'user' | 'agent';
  created_at: string;
}

export interface Notification {
  id: string;
  order_id: string;
  notification_type: NotificationType;
  message: string;
  created_at: string;
}

export interface AgentLog {
  id: string;
  action: AgentLogAction;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface OrderDetail {
  order: Order;
  trackingUpdates: TrackingUpdate[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatReply {
  reply: string;
  order: {
    order_number: string;
    is_delayed: boolean;
  } | null;
  isDelayed: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
