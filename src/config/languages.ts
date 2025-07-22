import { LanguageConfig } from '../types';

export const languageConfigs: Record<string, LanguageConfig> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    monacoLanguage: 'javascript',
    icon: '⚡',
    defaultCode: `// Welcome to JavaScript Playground!
// Try running this code and see the output

console.log("Hello from JavaScript!");

// Basic array operations
const numbers = [1, 2, 3, 4, 5];
console.log("Original array:", numbers);

const doubled = numbers.map(n => n * 2);
console.log("Doubled array:", doubled);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum of array:", sum);

// Object example
const person = {
  name: "John",
  age: 30,
  city: "New York"
};

console.log("Person object:", person);
console.log("Person name:", person.name);

// Function example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`
  },
  
  csharp: {
    id: 'csharp',
    name: 'C#',
    extension: '.cs',
    monacoLanguage: 'csharp',
    icon: '🔷',
    defaultCode: `using System;
using System.Collections.Generic;
using System.Linq;

// Welcome to C# Playground!
// This is a simple C# console application

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello from C#!");
        
        // Basic list operations
        var numbers = new List<int> { 1, 2, 3, 4, 5 };
        Console.WriteLine($"Original list: [{string.Join(", ", numbers)}]");
        
        var doubled = numbers.Select(n => n * 2).ToList();
        Console.WriteLine($"Doubled list: [{string.Join(", ", doubled)}]");
        
        var sum = numbers.Sum();
        Console.WriteLine($"Sum of list: {sum}");
        
        // Object example
        var person = new { Name = "John", Age = 30, City = "New York" };
        Console.WriteLine($"Person: {person.Name}, Age: {person.Age}, City: {person.City}");
        
        // Method example
        Console.WriteLine(Greet("World"));
    }
    
    static string Greet(string name)
    {
        return $"Hello, {name}!";
    }
}`
  },
  
  sql: {
    id: 'sql',
    name: 'SQL',
    extension: '.sql',
    monacoLanguage: 'sql',
    icon: '🗄️',
    defaultCode: `-- Welcome to SQL Server Playground!
-- This is a comprehensive IT Store Sales Database
-- Use the database schema viewer to explore table structures

-- Basic queries to get started:

-- 1. View all products with their categories and suppliers
SELECT 
    p.product_name,
    c.category_name,
    s.supplier_name,
    p.unit_price,
    p.stock_quantity
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers s ON p.supplier_id = s.supplier_id
ORDER BY p.product_name;

-- 2. Find products with low stock (below reorder level)
SELECT 
    product_name,
    stock_quantity,
    reorder_level,
    CASE 
        WHEN stock_quantity <= reorder_level THEN 'Low Stock'
        WHEN stock_quantity = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
    END as stock_status
FROM products
WHERE stock_quantity <= reorder_level
ORDER BY stock_quantity;

-- 3. Customer order summary
SELECT 
    c.first_name + ' ' + c.last_name as customer_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as avg_order_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.email
ORDER BY total_spent DESC;

-- 4. Top selling products by revenue
SELECT TOP 10
    p.product_name,
    c.category_name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.total_price) as total_revenue,
    AVG(oi.unit_price) as avg_price
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
GROUP BY p.product_id, p.product_name, c.category_name
ORDER BY total_revenue DESC;

-- 5. Order status breakdown
SELECT 
    order_status,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value
FROM orders
GROUP BY order_status
ORDER BY order_count DESC;

-- 6. Monthly sales analysis
SELECT 
    FORMAT(order_date, 'yyyy-MM') as month,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value
FROM orders
WHERE order_date >= DATEADD(MONTH, -12, GETDATE())
GROUP BY FORMAT(order_date, 'yyyy-MM')
ORDER BY month DESC;

-- 7. Product category performance
SELECT 
    c.category_name,
    COUNT(DISTINCT p.product_id) as product_count,
    SUM(p.stock_quantity) as total_stock,
    AVG(p.unit_price) as avg_price,
    SUM(oi.total_price) as total_revenue
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY c.category_id, c.category_name
ORDER BY total_revenue DESC;

-- 8. Customer geographic analysis
SELECT 
    state,
    COUNT(DISTINCT c.customer_id) as customer_count,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.state IS NOT NULL
GROUP BY c.state
ORDER BY total_revenue DESC;

-- 9. Shipping method analysis
SELECT 
    sm.method_name,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_revenue,
    AVG(o.shipping_cost) as avg_shipping_cost
FROM orders o
JOIN shipping_methods sm ON o.shipping_method_id = sm.shipping_method_id
GROUP BY sm.shipping_method_id, sm.method_name
ORDER BY order_count DESC;

-- 10. Payment method analysis
SELECT 
    pm.method_name,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value
FROM orders o
JOIN payment_methods pm ON o.payment_method_id = pm.payment_method_id
GROUP BY pm.payment_method_id, pm.method_name
ORDER BY total_revenue DESC;

-- 11. Using the pre-built views
SELECT * FROM product_inventory WHERE stock_status = 'Low Stock';
SELECT * FROM order_summary ORDER BY total_amount DESC;
SELECT * FROM top_products ORDER BY total_revenue DESC;`
  }
}; 