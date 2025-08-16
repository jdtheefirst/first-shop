-- Create users table
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    role text DEFAULT 'customer' NOT NULL,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    title text NOT NULL,
    image text,
    sku text UNIQUE,
    description text,
    price numeric(10, 2) NOT NULL,
    stock integer DEFAULT 0,
    category text,
    currency text NOT NULL,
    belt_level text,
    tags text[],
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    total numeric(10, 2) NOT NULL,
    currency text NOT NULL,
    status text DEFAULT 'pending' NOT NULL,
    shipping_info jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) NOT NULL,
    product_id uuid REFERENCES products(id) NOT NULL,
    qty integer NOT NULL,
    unit_price numeric(10, 2) NOT NULL
);

-- Create transactions table
CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) NOT NULL,
    gateway text NOT NULL,
    amount numeric(10, 2) NOT NULL,
    fees numeric(10, 2),
    gateway_tx_id text,
    status text NOT NULL,
    payload jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create page_views table for simple stats
CREATE TABLE page_views (
    id bigserial PRIMARY KEY,
    path text NOT NULL,
    user_id uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX ON orders (user_id);
CREATE INDEX ON order_items (order_id);
CREATE INDEX ON order_items (product_id);
CREATE INDEX ON transactions (order_id);
CREATE INDEX ON page_views (user_id);
CREATE INDEX ON page_views (path);

-- Enable RLS for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Example: Allow users to see their own orders
CREATE POLICY "Allow individual read access" ON orders FOR SELECT USING (auth.uid() = user_id);
-- Example: Allow users to insert their own orders
CREATE POLICY "Allow individual insert access" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: You will need to create more specific RLS policies based on your application's needs.
-- For example, admins should have broader access, while customers should only be able to see and manage their own data.
