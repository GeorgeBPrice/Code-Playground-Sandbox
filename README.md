# Code Playground Sandbox

A web-based code playground for practicing multiple programming languages including JavaScript, C#, and SQL. Built with React, TypeScript, Monaco Editor, and Docker integration for sandboxed code execution.

## Features

- Multi-language support: JavaScript, C#, and SQL (SQL Server)
- Monaco Editor: Professional code editor with IntelliSense and error detection
- Real-time console output: See execution results and errors instantly
- Sandboxed code execution: Each language runs in its own Docker container for security
- Modern UI: Dark theme with Tailwind CSS
- File operations: Upload, download, and reset code
- Responsive design: Works on desktop and mobile devices
- SQL Server integration: Comprehensive IT store sales database with 8 tables and 3 views
- Database schema viewer: Explore table structures interactively in the UI
- Code block actions: Run, copy, comment, or delete selected code blocks
- Adjustable layout: Resize editor and console columns with a slider
- Fixed console output height for consistent experience

## Tech Stack

- Frontend: React 18, TypeScript
- Editor: Monaco Editor
- Styling: Tailwind CSS
- Icons: Lucide React
- Backend: Node.js (Express), Docker containers for code execution
- Database: SQL Server 2022 (containerized)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- npm or yarn

### Running with Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/GeorgeBPrice/Code-Playground-Sandbox.git
   ```
2. In the root folder, start all services (frontend, backend, SQL Server, code runners):
   ```bash
   docker-compose up --build
   ```
3. Allowing some time, Open your browser and navigate to:
   ```
   http://localhost:80
   ```

4. If there are issues, check docker is correctly deployed, check all containers are running. **OR use Docker Desktop to view deployment**
   ```
   docker ps
   ```


### Local Development (VSCode or Terminal)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. The app will be available at:
   ```
   http://localhost:3000
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── CodeEditor.tsx   # Monaco editor wrapper
│   ├── Console.tsx      # Console output display
│   └── LanguageSelector.tsx # Language selection UI
├── config/
│   └── languages.ts     # Language configurations
├── services/
│   └── codeExecution.ts # Code execution service
├── types/
│   └── index.ts         # TypeScript type definitions
└── App.tsx              # Main application component
```

## Language Support

### JavaScript
- ES6+ support
- Console output capture
- Array, object, and function examples

### C#
- .NET 8.0 runtime
- Console application support
- LINQ operations
- Object-oriented programming examples

### SQL
- SQL Server 2022 with IT store sales database
- 8 tables: categories, suppliers, products, customers, payment_methods, shipping_methods, orders, order_items
- 3 views: product_inventory, order_summary, top_products
- Realistic sample data
- Advanced queries: JOINs, aggregations, subqueries, window functions
- Interactive database schema viewer

## Usage

1. Select a language (JavaScript, C#, or SQL)
2. Write code in the Monaco editor
3. Run code to see output in the console panel
4. Use file operations to upload, download, or reset code
5. For SQL, explore the database schema in the UI
6. Use the slider to adjust the width of the console and editor
7. Use code block actions (run, copy, comment, delete) on selected code

## Development Phases

### Phase 1: Core Features (Completed)
- Multi-language code execution (JavaScript, C#, SQL)
- Monaco Editor integration
- Real-time console output with error and info messages
- Sandboxed execution using Docker containers for each language
- SQL Server 2022 with comprehensive IT store sales schema and sample data
- Interactive database schema viewer in the UI
- File upload, download, and reset for code
- Responsive, modern UI with Tailwind CSS
- Adjustable layout with slider for editor/console width
- Code block actions: run, copy, comment, delete
- Fixed console output height

### Phase 2: Advanced Features (Planned)
- Support for additional languages and Frameworks (TypeScript, Python, React, Java, Go, yaml, PHP, etc.)
- Code sharing and templates
- Advanced debugging tools (breakpoints, step-through)
- Integration with external APIs for code execution
- Enhanced database management (import/export, schema editing)
- Real-time code linting and suggestions


### Phase 3: Wishlist
- Customizable themes and layouts
- User authentication and profiles
- Real-time collaboration (multi-user editing)
- Persistent user workspaces
- Performance profiling for code execution
- Integration with cloud IDEs


## License

MIT Non-Commercial License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software", which is this entire solution), to use, copy, modify, and distribute the Software for non-commercial purposes only, subject to the following conditions:

1. The Software is provided "as is", without warranty of any kind, express or implied. Use of the Software is at your own risk.
2. The Software is intended for educational and learning purposes only. You are solely responsible for any use of the Software and any consequences thereof.
3. You must not use the Software for any illegal or unethical activities.
4. Commercial use of the Software is strictly prohibited without prior written permission from the author(s).

By using this Software, you acknowledge and agree to these terms.