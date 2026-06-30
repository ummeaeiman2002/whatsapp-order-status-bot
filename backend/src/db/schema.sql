CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Customer', 'Administrator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) NOT NULL UNIQUE CHECK (order_number ~ '^ORD-\d{4}$'),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Pending','Processing','Packed','Shipped','In Transit','Out For Delivery','Delivered','Delayed','Returned')),
  courier_name VARCHAR(255) NOT NULL,
  expected_delivery_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tracking_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  current_status VARCHAR(50) NOT NULL CHECK (current_status IN ('Shipment Created','Picked Up','Hub Received','In Transit','Destination Hub','Out For Delivery','Delivered')),
  current_location VARCHAR(255) NOT NULL,
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  session_id VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  sender VARCHAR(50) NOT NULL CHECK (sender IN ('user', 'agent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('Delay Alert','Delivery Confirmation','Tracking Update')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL CHECK (action IN ('ORDER_FETCHED','TRACKING_ANALYZED','DELAY_DETECTED','RESPONSE_GENERATED')),
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_tracking_updates_order_id ON tracking_updates(order_id);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_agent_logs_action ON agent_logs(action);
