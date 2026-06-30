export enum UserRole {
  Customer = 'Customer',
  Administrator = 'Administrator',
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Packed = 'Packed',
  Shipped = 'Shipped',
  InTransit = 'In Transit',
  OutForDelivery = 'Out For Delivery',
  Delivered = 'Delivered',
  Delayed = 'Delayed',
  Returned = 'Returned',
}

export enum TrackingStatus {
  ShipmentCreated = 'Shipment Created',
  PickedUp = 'Picked Up',
  HubReceived = 'Hub Received',
  InTransit = 'In Transit',
  DestinationHub = 'Destination Hub',
  OutForDelivery = 'Out For Delivery',
  Delivered = 'Delivered',
}

export enum NotificationType {
  DelayAlert = 'Delay Alert',
  DeliveryConfirmation = 'Delivery Confirmation',
  TrackingUpdate = 'Tracking Update',
}

export enum AgentLogAction {
  OrderFetched = 'ORDER_FETCHED',
  TrackingAnalyzed = 'TRACKING_ANALYZED',
  DelayDetected = 'DELAY_DETECTED',
  ResponseGenerated = 'RESPONSE_GENERATED',
}

export enum SenderType {
  User = 'user',
  Agent = 'agent',
}

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
  sender: SenderType;
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

export interface OrderWithTracking {
  order: Order;
  trackingUpdates: TrackingUpdate[];
}

export interface OrderSummary {
  order_number: string;
  status: OrderStatus;
  courier_name: string;
  expected_delivery_date: string;
}

export interface DelayResult {
  isDelayed: boolean;
  ruleTriggered: 'R1' | 'R2' | null;
  reason: string | null;
}

export interface AgentResponse {
  message: string;
  orderNumber: string | null;
  isDelayed: boolean;
  trackingUpdates: TrackingUpdate[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const ORDER_NUMBER_REGEX = /^ORD-\d{4}$/;

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.Shipped,
  OrderStatus.InTransit,
  OrderStatus.OutForDelivery,
];
