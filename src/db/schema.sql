-- Create users table
CREATE TABLE users (
    id uuid primary key,
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
    featured boolean DEFAULT false,
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
    tracking_number text,
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
    receipt_number text,
    phone_number text,
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Only insert if email is not null
  if new.email is not null then
    insert into public.users (id, email, metadata)
    values (new.id, new.email, new.raw_user_meta_data)
    on conflict (id) do nothing; -- prevents duplicate insert errors
  end if;

  return new;
end;
$$;

-- Trigger on auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.get_dashboard_data()
returns json
language plpgsql
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'stats', json_build_object(
      'totalSales', coalesce(sum(total),0),
      'totalOrders', count(*),
      'totalCustomers', (select count(*) from users),
      'totalProducts', (select count(*) from products),
      'pageViews', (select count(*) from page_views)
    ),
    'recentOrders', (
      select json_agg(
        json_build_object(
          'id', o.id,
          'customer', o.shipping_info->>'firstName' || ' ' || coalesce(o.shipping_info->>'lastName',''),
          'date', o.created_at,
          'total', o.total,
          'status', o.status
        )
        order by o.created_at desc
      )
      from orders o
      limit 5
    )
  )
  into result
  from orders; -- aggregate over all orders for totals

  return result;
end;
$$;

create or replace function public.get_all_orders()
returns json
language plpgsql
set search_path = public
as $$
declare
  result json;
begin
  select json_agg(
    json_build_object(
      'id', o.id,
      'customer', o.shipping_info->>'firstName' || ' ' || coalesce(o.shipping_info->>'lastName',''),
      'email', o.shipping_info->>'email',
      'date', o.created_at,
      'total', o.total,
      'status', o.status,
      'items', coalesce(count(oi.id),0)
    )
    order by o.created_at desc
  )
  into result
  from orders o
  left join order_items oi on o.id = oi.order_id
  group by o.id;

  return result;
end;
$$;

create or replace function public.get_order_details(order_uuid uuid)
returns json
language sql
as $$
  select json_build_object(
    'id', o.id,
    'customer', json_build_object(
      'name', o.shipping_info->>'firstName' || ' ' || coalesce(o.shipping_info->>'lastName',''),
      'email', o.shipping_info->>'email',
      'phone', o.shipping_info->>'phone'
    ),
    'date', o.created_at,
    'total', o.total,
    'status', o.status,
    'tracking', o.tracking_number,
    'shipping_address', json_build_object(
      'street', o.shipping_info->>'address',
      'city', o.shipping_info->>'city',
      'state', o.shipping_info->>'state',
      'postal_code', o.shipping_info->>'postalCode',
      'country', o.shipping_info->>'country'
    ),
    'items', (
      select json_agg(
        json_build_object(
          'id', oi.id,
          'title', p.name,
          'sku', p.sku,
          'price', oi.unit_price,
          'quantity', oi.qty
        )
      )
      from order_items oi
      join products p on oi.product_id = p.id
      where oi.order_id = o.id
    ),
    'payment', (
      select json_build_object(
        'method', t.gateway,
        'transaction_id', t.gateway_tx_id,
        'status', t.status,
        'amount', t.amount,
        'phone', t.phone_number
      )
      from transactions t
      where t.order_id = o.id
      order by t.created_at desc
      limit 1
    )
  )
  from orders o
  where o.id = order_uuid;
$$;

-- Function: get_analytics(time_period text)
create or replace function public.get_analytics(time_period text)
returns jsonb
language plpgsql
security definer
as $$
declare
    start_date timestamptz;
    sales jsonb;
    visits jsonb;
    category jsonb;
    stats jsonb;
begin
    -- Determine the start date based on the time period
    start_date := case time_period
        when '7d' then now() - interval '7 days'
        when '30d' then now() - interval '30 days'
        when '90d' then now() - interval '90 days'
        when '1y' then now() - interval '1 year'
        else '1970-01-01'::timestamptz
    end;

    -- Sales by month
select coalesce(jsonb_agg(jsonb_build_object(
    'name', to_char(created_at, 'Mon'),
    'sales', coalesce(sum(total), 0)
)), '[]'::jsonb)
into sales
from orders
where created_at >= start_date;

-- Page views by month
select coalesce(jsonb_agg(jsonb_build_object(
    'name', to_char(created_at, 'Mon'),
    'visits', count(*)
)), '[]'::jsonb)
into visits
from page_views
where created_at >= start_date;

-- Product category distribution
select coalesce(jsonb_agg(jsonb_build_object(
    'name', p.category,
    'value', coalesce(sum(oi.qty), 0)
)), '[]'::jsonb)
into category
from order_items oi
join products p on p.id = oi.product_id
join orders o on o.id = oi.order_id
where o.created_at >= start_date
group by p.category;

    -- Summary stats
    select jsonb_build_object(
        'totalSales', coalesce(sum(total), 0),
        'totalOrders', coalesce(count(*), 0),
        'totalCustomers', coalesce(count(distinct user_id), 0),
        'totalProducts', (select count(*) from products),
        'pageViews', (select count(*) from page_views where created_at >= start_date),
        'conversionRate', 
            case 
                when (select count(*) from page_views where created_at >= start_date) > 0 
                then round((count(*)::numeric / (select count(*) from page_views where created_at >= start_date)) * 100, 1)
                else 0
            end
    )
    into stats
    from orders
    where created_at >= start_date;

    return jsonb_build_object(
        'salesData', sales,
        'visitsData', visits,
        'categoryData', category,
        'stats', stats
    );
end;
$$;

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

-- Allow users to read their own user data
CREATE POLICY "Allow individual user read access" ON users FOR SELECT USING (auth.uid() = id);

-- Allow users to read order items for their own orders
CREATE POLICY "Allow individual order items read access" ON order_items FOR SELECT USING (
  exists (
    select 1 from orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  )
);

-- only user role admin can read, write, delete on users, products, orders, order_items, page_views and transactions;
CREATE POLICY "Allow admin access" ON users FOR ALL using (exists (
  select 1 from users u
  where u.id = auth.uid() and u.role = 'admin'
));
CREATE POLICY "Allow admin access" ON products FOR ALL using (exists (
  select 1 from users u
  where u.id = auth.uid() and u.role = 'admin'
));
CREATE POLICY "Allow admin access" ON orders FOR ALL using (exists (
  select 1 from users u
  where u.id = auth.uid() and u.role = 'admin'
));
CREATE POLICY "Allow admin access" ON order_items FOR ALL using (exists (
  select 1 from users u
  where u.id = auth.uid() and u.role = 'admin'
));
CREATE POLICY "Allow admin access" ON transactions FOR ALL using (exists (
  select 1 from users u
  where u.id = auth.uid() and u.role = 'admin'
));
CREATE POLICY "Allow admin access" ON page_views FOR ALL using (exists (
  select 1 from users u
  where u.id = auth.uid() and u.role = 'admin'
));

-- Note: You will need to create more specific RLS policies based on your application's needs.
-- For example, admins should have broader access, while customers should only be able to see and manage their own data.
