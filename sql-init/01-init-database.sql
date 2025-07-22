-- IT Store Sales Database Initialization for SQL Server
-- This script creates a comprehensive database for an IT store with products, customers, orders, and shipping

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'it_store_sales')
BEGIN
    CREATE DATABASE it_store_sales;
END
GO

USE it_store_sales;
GO

-- Drop tables if they exist (for clean initialization)
IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('customers', 'U') IS NOT NULL DROP TABLE customers;
IF OBJECT_ID('products', 'U') IS NOT NULL DROP TABLE products;
IF OBJECT_ID('categories', 'U') IS NOT NULL DROP TABLE categories;
IF OBJECT_ID('suppliers', 'U') IS NOT NULL DROP TABLE suppliers;
IF OBJECT_ID('shipping_methods', 'U') IS NOT NULL DROP TABLE shipping_methods;
IF OBJECT_ID('payment_methods', 'U') IS NOT NULL DROP TABLE payment_methods;
GO

-- Create Categories table
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Create Suppliers table
CREATE TABLE suppliers (
    supplier_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_name NVARCHAR(200) NOT NULL,
    contact_person NVARCHAR(100),
    email NVARCHAR(100),
    phone NVARCHAR(20),
    address NVARCHAR(MAX),
    country NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Create Products table
CREATE TABLE products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    product_name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    category_id INT,
    supplier_id INT,
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Create Customers table
CREATE TABLE customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    address NVARCHAR(MAX),
    city NVARCHAR(50),
    state NVARCHAR(50),
    country NVARCHAR(50),
    postal_code NVARCHAR(20),
    registration_date DATETIME2 DEFAULT GETDATE(),
    is_active BIT DEFAULT 1
);

-- Create Payment Methods table
CREATE TABLE payment_methods (
    payment_method_id INT IDENTITY(1,1) PRIMARY KEY,
    method_name NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX),
    is_active BIT DEFAULT 1
);

-- Create Shipping Methods table
CREATE TABLE shipping_methods (
    shipping_method_id INT IDENTITY(1,1) PRIMARY KEY,
    method_name NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX),
    base_cost DECIMAL(10,2) DEFAULT 0.00,
    is_active BIT DEFAULT 1
);

-- Create Orders table
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATETIME2 DEFAULT GETDATE(),
    required_date DATE,
    shipped_date DATETIME2 NULL,
    shipping_method_id INT,
    payment_method_id INT,
    order_status NVARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    notes NVARCHAR(MAX),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(shipping_method_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id)
);

-- Create Order Items table
CREATE TABLE order_items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
GO

-- Insert sample data

-- Insert Categories
INSERT INTO categories (category_name, description) VALUES
('Laptops', 'Portable computers for work and gaming'),
('Desktops', 'High-performance desktop computers'),
('Monitors', 'Computer displays and screens'),
('Keyboards', 'Input devices for computers'),
('Mice', 'Pointing devices and trackballs'),
('Storage', 'Hard drives, SSDs, and storage solutions'),
('Networking', 'Routers, switches, and network equipment'),
('Software', 'Operating systems and applications'),
('Accessories', 'Cables, adapters, and other accessories'),
('Gaming', 'Gaming hardware and peripherals');

-- Insert Suppliers
INSERT INTO suppliers (supplier_name, contact_person, email, phone, address, country) VALUES
('TechCorp Inc.', 'John Smith', 'john@techcorp.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA', 'USA'),
('Global Electronics', 'Maria Garcia', 'maria@globalelec.com', '+1-555-0102', '456 Electronics Ave, Austin, TX', 'USA'),
('Asian Tech Ltd.', 'Li Wei', 'li@asiantech.com', '+86-555-0103', '789 Innovation Road, Shenzhen', 'China'),
('EuroTech Solutions', 'Hans Mueller', 'hans@eurotech.com', '+49-555-0104', '321 Tech Boulevard, Berlin', 'Germany'),
('Digital Dynamics', 'Sarah Johnson', 'sarah@digitaldyn.com', '+1-555-0105', '654 Digital Drive, Seattle, WA', 'USA');

-- Insert Products
INSERT INTO products (product_name, description, category_id, supplier_id, unit_price, stock_quantity, reorder_level) VALUES
-- Laptops
('MacBook Pro 16"', 'Apple MacBook Pro with M2 chip, 16GB RAM, 512GB SSD', 1, 1, 2499.99, 15, 5),
('Dell XPS 15', 'Dell XPS 15 with Intel i7, 16GB RAM, 512GB SSD', 1, 2, 1899.99, 20, 8),
('Lenovo ThinkPad X1', 'Lenovo ThinkPad X1 Carbon with Intel i5, 8GB RAM, 256GB SSD', 1, 3, 1299.99, 25, 10),
('HP Spectre x360', 'HP Spectre x360 2-in-1 laptop with Intel i7, 16GB RAM, 1TB SSD', 1, 2, 1599.99, 12, 5),

-- Desktops
('iMac 27"', 'Apple iMac 27" with Intel i5, 8GB RAM, 1TB Fusion Drive', 2, 1, 1799.99, 8, 3),
('Dell OptiPlex 7090', 'Dell OptiPlex 7090 with Intel i7, 16GB RAM, 512GB SSD', 2, 2, 1299.99, 15, 5),
('HP EliteDesk 800', 'HP EliteDesk 800 with Intel i5, 8GB RAM, 256GB SSD', 2, 2, 899.99, 20, 8),

-- Monitors
('Dell UltraSharp 27"', 'Dell UltraSharp 27" 4K Monitor', 3, 2, 599.99, 30, 10),
('LG 34" Ultrawide', 'LG 34" Ultrawide Curved Monitor', 3, 4, 449.99, 18, 6),
('Samsung 32" 4K', 'Samsung 32" 4K UHD Monitor', 3, 4, 399.99, 25, 8),

-- Keyboards
('Logitech MX Keys', 'Logitech MX Keys Wireless Keyboard', 4, 5, 99.99, 50, 15),
('Corsair K95 RGB', 'Corsair K95 RGB Mechanical Gaming Keyboard', 4, 5, 199.99, 30, 10),
('Apple Magic Keyboard', 'Apple Magic Keyboard for Mac', 4, 1, 99.99, 40, 12),

-- Mice
('Logitech MX Master 3', 'Logitech MX Master 3 Wireless Mouse', 5, 5, 79.99, 60, 20),
('Razer DeathAdder', 'Razer DeathAdder Gaming Mouse', 5, 5, 69.99, 45, 15),
('Apple Magic Mouse', 'Apple Magic Mouse 2', 5, 1, 79.99, 35, 10),

-- Storage
('Samsung 970 EVO 1TB', 'Samsung 970 EVO 1TB NVMe SSD', 6, 3, 149.99, 100, 30),
('WD Blue 2TB', 'Western Digital Blue 2TB HDD', 6, 2, 59.99, 80, 25),
('Seagate Barracuda 4TB', 'Seagate Barracuda 4TB HDD', 6, 2, 89.99, 60, 20),

-- Networking
('TP-Link Archer C7', 'TP-Link Archer C7 AC1750 Router', 7, 3, 79.99, 40, 12),
('Netgear GS308', 'Netgear GS308 8-Port Gigabit Switch', 7, 2, 29.99, 50, 15),
('Ubiquiti UniFi AP', 'Ubiquiti UniFi AP-AC Lite', 7, 4, 89.99, 25, 8),

-- Software
('Windows 11 Pro', 'Microsoft Windows 11 Professional', 8, 1, 199.99, 200, 50),
('Office 365 Home', 'Microsoft Office 365 Home Subscription', 8, 1, 69.99, 500, 100),
('Adobe Creative Suite', 'Adobe Creative Suite Subscription', 8, 1, 52.99, 150, 30),

-- Accessories
('USB-C Hub', '7-in-1 USB-C Hub with HDMI', 9, 3, 39.99, 120, 40),
('Webcam 1080p', 'Logitech C920 HD Pro Webcam', 9, 5, 79.99, 80, 25),
('Bluetooth Speaker', 'JBL Flip 5 Bluetooth Speaker', 9, 4, 119.99, 60, 20),

-- Gaming
('NVIDIA RTX 4080', 'NVIDIA GeForce RTX 4080 Graphics Card', 10, 2, 1199.99, 10, 3),
('PlayStation 5', 'Sony PlayStation 5 Console', 10, 4, 499.99, 15, 5),
('Xbox Series X', 'Microsoft Xbox Series X Console', 10, 1, 499.99, 12, 4);

-- Insert Payment Methods
INSERT INTO payment_methods (method_name, description) VALUES
('Credit Card', 'Visa, MasterCard, American Express'),
('PayPal', 'PayPal digital payments'),
('Bank Transfer', 'Direct bank transfer'),
('Cash on Delivery', 'Cash payment upon delivery'),
('Apple Pay', 'Apple Pay digital wallet'),
('Google Pay', 'Google Pay digital wallet');

-- Insert Shipping Methods
INSERT INTO shipping_methods (method_name, description, base_cost) VALUES
('Standard Shipping', '5-7 business days', 9.99),
('Express Shipping', '2-3 business days', 19.99),
('Overnight Shipping', 'Next business day', 29.99),
('Free Shipping', 'Free shipping on orders over $100', 0.00),
('Local Pickup', 'Pick up from our store', 0.00);

-- Insert Customers
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, country, postal_code) VALUES
('Alice', 'Johnson', 'alice.johnson@email.com', '+1-555-0001', '123 Main Street', 'New York', 'NY', 'USA', '10001'),
('Bob', 'Smith', 'bob.smith@email.com', '+1-555-0002', '456 Oak Avenue', 'Los Angeles', 'CA', 'USA', '90210'),
('Carol', 'Davis', 'carol.davis@email.com', '+1-555-0003', '789 Pine Road', 'Chicago', 'IL', 'USA', '60601'),
('David', 'Wilson', 'david.wilson@email.com', '+1-555-0004', '321 Elm Street', 'Houston', 'TX', 'USA', '77001'),
('Emma', 'Brown', 'emma.brown@email.com', '+1-555-0005', '654 Maple Drive', 'Phoenix', 'AZ', 'USA', '85001'),
('Frank', 'Miller', 'frank.miller@email.com', '+1-555-0006', '987 Cedar Lane', 'Philadelphia', 'PA', 'USA', '19101'),
('Grace', 'Taylor', 'grace.taylor@email.com', '+1-555-0007', '147 Birch Way', 'San Antonio', 'TX', 'USA', '78201'),
('Henry', 'Anderson', 'henry.anderson@email.com', '+1-555-0008', '258 Spruce Court', 'San Diego', 'CA', 'USA', '92101'),
('Ivy', 'Thomas', 'ivy.thomas@email.com', '+1-555-0009', '369 Willow Place', 'Dallas', 'TX', 'USA', '75201'),
('Jack', 'Jackson', 'jack.jackson@email.com', '+1-555-0010', '741 Aspen Circle', 'San Jose', 'CA', 'USA', '95101');

-- Insert Orders
INSERT INTO orders (customer_id, order_date, required_date, shipped_date, shipping_method_id, payment_method_id, order_status, subtotal, tax_amount, shipping_cost, total_amount, notes) VALUES
(1, '2024-01-15 10:30:00', '2024-01-22', '2024-01-18 14:20:00', 2, 1, 'delivered', 2599.98, 259.99, 19.99, 2879.96, 'Customer requested signature delivery'),
(2, '2024-01-16 11:45:00', '2024-01-23', '2024-01-19 09:15:00', 1, 2, 'delivered', 1199.99, 119.99, 9.99, 1329.97, NULL),
(3, '2024-01-17 14:20:00', '2024-01-24', '2024-01-20 16:30:00', 3, 1, 'delivered', 899.99, 89.99, 29.99, 1019.97, 'Express delivery requested'),
(4, '2024-01-18 09:15:00', '2024-01-25', NULL, 1, 3, 'processing', 1599.99, 159.99, 9.99, 1769.97, NULL),
(5, '2024-01-19 16:30:00', '2024-01-26', NULL, 2, 1, 'processing', 449.99, 44.99, 19.99, 514.97, NULL),
(6, '2024-01-20 13:45:00', '2024-01-27', NULL, 4, 2, 'pending', 299.97, 29.99, 0.00, 329.96, 'Free shipping applied'),
(7, '2024-01-21 10:00:00', '2024-01-28', NULL, 1, 1, 'pending', 179.98, 17.99, 9.99, 207.96, NULL),
(8, '2024-01-22 15:30:00', '2024-01-29', NULL, 2, 2, 'pending', 599.99, 59.99, 19.99, 679.97, NULL),
(9, '2024-01-23 12:15:00', '2024-01-30', NULL, 1, 1, 'pending', 399.99, 39.99, 9.99, 449.97, NULL),
(10, '2024-01-24 08:45:00', '2024-01-31', NULL, 3, 1, 'pending', 1299.99, 129.99, 29.99, 1459.97, 'Overnight shipping requested');

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, discount_percentage, total_price) VALUES
-- Order 1: MacBook Pro + Accessories
(1, 1, 1, 2499.99, 0.00, 2499.99),
(1, 12, 1, 99.99, 0.00, 99.99),

-- Order 2: Graphics Card
(2, 25, 1, 1199.99, 0.00, 1199.99),

-- Order 3: Desktop
(3, 6, 1, 1299.99, 0.00, 1299.99),

-- Order 4: Laptop
(4, 4, 1, 1599.99, 0.00, 1599.99),

-- Order 5: Monitor
(5, 8, 1, 599.99, 0.00, 599.99),

-- Order 6: Multiple accessories
(6, 13, 1, 79.99, 0.00, 79.99),
(6, 15, 1, 149.99, 0.00, 149.99),
(6, 22, 1, 39.99, 0.00, 39.99),
(6, 23, 1, 79.99, 0.00, 79.99),

-- Order 7: Keyboard and Mouse
(7, 11, 1, 99.99, 0.00, 99.99),
(7, 13, 1, 79.99, 0.00, 79.99),

-- Order 8: Monitor
(8, 8, 1, 599.99, 0.00, 599.99),

-- Order 9: Storage
(9, 16, 1, 149.99, 0.00, 149.99),
(9, 17, 2, 59.99, 0.00, 119.98),
(9, 18, 1, 89.99, 0.00, 89.99),

-- Order 10: Gaming Console
(10, 26, 1, 499.99, 0.00, 499.99),
(10, 27, 1, 499.99, 0.00, 499.99),
(10, 12, 1, 199.99, 0.00, 199.99),
(10, 14, 1, 69.99, 0.00, 69.99);
GO

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_customers_email ON customers(email);
GO

-- Create views for common queries
CREATE VIEW product_inventory AS
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    s.supplier_name,
    p.unit_price,
    p.stock_quantity,
    p.reorder_level,
    CASE 
        WHEN p.stock_quantity <= p.reorder_level THEN 'Low Stock'
        WHEN p.stock_quantity = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
    END as stock_status
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers s ON p.supplier_id = s.supplier_id;
GO

CREATE VIEW order_summary AS
SELECT 
    o.order_id,
    c.first_name + ' ' + c.last_name as customer_name,
    c.email,
    o.order_date,
    o.order_status,
    o.total_amount,
    COUNT(oi.order_item_id) as item_count
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, c.first_name, c.last_name, c.email, o.order_date, o.order_status, o.total_amount;
GO

CREATE VIEW top_products AS
SELECT 
    p.product_name,
    c.category_name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.total_price) as total_revenue,
    AVG(oi.unit_price) as avg_price
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
GROUP BY p.product_id, p.product_name, c.category_name;
GO 