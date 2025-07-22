import React, { useState } from 'react';
import { Database, Table, ChevronDown, ChevronRight } from 'lucide-react';

interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  description: string;
}

interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
  key: string;
  description: string;
}

const DatabaseSchema: React.FC = () => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const schema: TableSchema[] = [
    {
      name: 'categories',
      description: 'Product categories for organizing inventory',
      columns: [
        { name: 'category_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique category identifier' },
        { name: 'category_name', type: 'VARCHAR(100)', nullable: false, key: '', description: 'Name of the category' },
        { name: 'description', type: 'TEXT', nullable: true, key: '', description: 'Category description' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: true, key: '', description: 'Record creation timestamp' }
      ]
    },
    {
      name: 'suppliers',
      description: 'Product suppliers and vendors',
      columns: [
        { name: 'supplier_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique supplier identifier' },
        { name: 'supplier_name', type: 'VARCHAR(200)', nullable: false, key: '', description: 'Name of the supplier' },
        { name: 'contact_person', type: 'VARCHAR(100)', nullable: true, key: '', description: 'Primary contact person' },
        { name: 'email', type: 'VARCHAR(100)', nullable: true, key: '', description: 'Contact email address' },
        { name: 'phone', type: 'VARCHAR(20)', nullable: true, key: '', description: 'Contact phone number' },
        { name: 'address', type: 'TEXT', nullable: true, key: '', description: 'Supplier address' },
        { name: 'country', type: 'VARCHAR(50)', nullable: true, key: '', description: 'Supplier country' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: true, key: '', description: 'Record creation timestamp' }
      ]
    },
    {
      name: 'products',
      description: 'Product catalog with inventory information',
      columns: [
        { name: 'product_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique product identifier' },
        { name: 'product_name', type: 'VARCHAR(200)', nullable: false, key: '', description: 'Name of the product' },
        { name: 'description', type: 'TEXT', nullable: true, key: '', description: 'Product description' },
        { name: 'category_id', type: 'INT', nullable: true, key: 'FOREIGN', description: 'Reference to categories table' },
        { name: 'supplier_id', type: 'INT', nullable: true, key: 'FOREIGN', description: 'Reference to suppliers table' },
        { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false, key: '', description: 'Product unit price' },
        { name: 'stock_quantity', type: 'INT', nullable: true, key: '', description: 'Current stock quantity' },
        { name: 'reorder_level', type: 'INT', nullable: true, key: '', description: 'Reorder threshold' },
        { name: 'is_active', type: 'BOOLEAN', nullable: true, key: '', description: 'Product availability status' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: true, key: '', description: 'Record creation timestamp' }
      ]
    },
    {
      name: 'customers',
      description: 'Customer information and contact details',
      columns: [
        { name: 'customer_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique customer identifier' },
        { name: 'first_name', type: 'VARCHAR(50)', nullable: false, key: '', description: 'Customer first name' },
        { name: 'last_name', type: 'VARCHAR(50)', nullable: false, key: '', description: 'Customer last name' },
        { name: 'email', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'Customer email address' },
        { name: 'phone', type: 'VARCHAR(20)', nullable: true, key: '', description: 'Customer phone number' },
        { name: 'address', type: 'TEXT', nullable: true, key: '', description: 'Customer address' },
        { name: 'city', type: 'VARCHAR(50)', nullable: true, key: '', description: 'Customer city' },
        { name: 'state', type: 'VARCHAR(50)', nullable: true, key: '', description: 'Customer state' },
        { name: 'country', type: 'VARCHAR(50)', nullable: true, key: '', description: 'Customer country' },
        { name: 'postal_code', type: 'VARCHAR(20)', nullable: true, key: '', description: 'Customer postal code' },
        { name: 'registration_date', type: 'TIMESTAMP', nullable: true, key: '', description: 'Customer registration date' },
        { name: 'is_active', type: 'BOOLEAN', nullable: true, key: '', description: 'Customer account status' }
      ]
    },
    {
      name: 'payment_methods',
      description: 'Available payment methods',
      columns: [
        { name: 'payment_method_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique payment method identifier' },
        { name: 'method_name', type: 'VARCHAR(50)', nullable: false, key: '', description: 'Name of payment method' },
        { name: 'description', type: 'TEXT', nullable: true, key: '', description: 'Payment method description' },
        { name: 'is_active', type: 'BOOLEAN', nullable: true, key: '', description: 'Payment method availability' }
      ]
    },
    {
      name: 'shipping_methods',
      description: 'Available shipping methods and costs',
      columns: [
        { name: 'shipping_method_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique shipping method identifier' },
        { name: 'method_name', type: 'VARCHAR(50)', nullable: false, key: '', description: 'Name of shipping method' },
        { name: 'description', type: 'TEXT', nullable: true, key: '', description: 'Shipping method description' },
        { name: 'base_cost', type: 'DECIMAL(10,2)', nullable: true, key: '', description: 'Base shipping cost' },
        { name: 'is_active', type: 'BOOLEAN', nullable: true, key: '', description: 'Shipping method availability' }
      ]
    },
    {
      name: 'orders',
      description: 'Customer orders with status and totals',
      columns: [
        { name: 'order_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique order identifier' },
        { name: 'customer_id', type: 'INT', nullable: false, key: 'FOREIGN', description: 'Reference to customers table' },
        { name: 'order_date', type: 'TIMESTAMP', nullable: true, key: '', description: 'Order creation date' },
        { name: 'required_date', type: 'DATE', nullable: true, key: '', description: 'Required delivery date' },
        { name: 'shipped_date', type: 'TIMESTAMP', nullable: true, key: '', description: 'Actual shipping date' },
        { name: 'shipping_method_id', type: 'INT', nullable: true, key: 'FOREIGN', description: 'Reference to shipping_methods table' },
        { name: 'payment_method_id', type: 'INT', nullable: true, key: 'FOREIGN', description: 'Reference to payment_methods table' },
        { name: 'order_status', type: 'ENUM', nullable: true, key: '', description: 'Current order status' },
        { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: true, key: '', description: 'Order subtotal' },
        { name: 'tax_amount', type: 'DECIMAL(10,2)', nullable: true, key: '', description: 'Tax amount' },
        { name: 'shipping_cost', type: 'DECIMAL(10,2)', nullable: true, key: '', description: 'Shipping cost' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: true, key: '', description: 'Total order amount' },
        { name: 'notes', type: 'TEXT', nullable: true, key: '', description: 'Order notes' }
      ]
    },
    {
      name: 'order_items',
      description: 'Individual items within orders',
      columns: [
        { name: 'order_item_id', type: 'INT', nullable: false, key: 'PRIMARY', description: 'Unique order item identifier' },
        { name: 'order_id', type: 'INT', nullable: false, key: 'FOREIGN', description: 'Reference to orders table' },
        { name: 'product_id', type: 'INT', nullable: false, key: 'FOREIGN', description: 'Reference to products table' },
        { name: 'quantity', type: 'INT', nullable: false, key: '', description: 'Quantity ordered' },
        { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false, key: '', description: 'Unit price at time of order' },
        { name: 'discount_percentage', type: 'DECIMAL(5,2)', nullable: true, key: '', description: 'Discount percentage applied' },
        { name: 'total_price', type: 'DECIMAL(10,2)', nullable: false, key: '', description: 'Total price for this item' }
      ]
    }
  ];

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const getKeyIcon = (key: string) => {
    switch (key) {
      case 'PRIMARY':
        return '🔑';
      case 'FOREIGN':
        return '🔗';
      case 'UNIQUE':
        return '🔒';
      default:
        return '';
    }
  };

  const getKeyColor = (key: string) => {
    switch (key) {
      case 'PRIMARY':
        return 'text-yellow-400';
      case 'FOREIGN':
        return 'text-blue-400';
      case 'UNIQUE':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold">IT Store Database Schema</h3>
      </div>
      
      <div className="space-y-2">
        {schema.map((table) => (
          <div key={table.name} className="border border-dark-600 rounded-lg">
            <button
              onClick={() => toggleTable(table.name)}
              className="w-full p-3 text-left hover:bg-dark-700 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-primary-400" />
                <span className="font-mono font-semibold">{table.name}</span>
                <span className="text-sm text-dark-400">({table.columns.length} columns)</span>
              </div>
              {expandedTables.has(table.name) ? (
                <ChevronDown className="w-4 h-4 text-dark-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-dark-400" />
              )}
            </button>
            
            {expandedTables.has(table.name) && (
              <div className="border-t border-dark-600 p-3 bg-dark-800">
                <p className="text-sm text-dark-300 mb-3">{table.description}</p>
                <div className="space-y-2">
                  {table.columns.map((column) => (
                    <div key={column.name} className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-mono text-white">{column.name}</span>
                        <span className="text-dark-400">{column.type}</span>
                        {column.nullable && <span className="text-orange-400 text-xs">NULL</span>}
                        {!column.nullable && <span className="text-green-400 text-xs">NOT NULL</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        {column.key && (
                          <span className={`text-xs ${getKeyColor(column.key)}`}>
                            {getKeyIcon(column.key)} {column.key}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-dark-800 rounded-lg">
        <h4 className="font-semibold mb-2">Database Views</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary-400">product_inventory</span>
            <span className="text-dark-400">- Product stock levels and status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary-400">order_summary</span>
            <span className="text-dark-400">- Order details with customer info</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary-400">top_products</span>
            <span className="text-dark-400">- Best selling products by revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchema; 