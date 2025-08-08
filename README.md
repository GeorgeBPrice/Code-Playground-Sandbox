# Code Playground Sandbox

**(NOT FOR PRODUCTION ENVIRONMENTS)**

This is a `localhost` web-based code playground for practicing multiple programming languages including JavaScript, C#, and SQL. Built with React, TypeScript, Monaco Editor, and Docker integration for sandboxed code execution with optimized performance. Just run `Docker Compose Up --build` and your off!

<img width="1518" height="1191" alt="image" src="https://github.com/user-attachments/assets/bd3fb6e1-3e72-4cda-b1fd-83f05f821903" />


## Features

- Multi-language support: JavaScript, C#, and SQL (SQL Server)
- Monaco Editor: Professional code editor with IntelliSense and error detection
- Real-time console output: See execution results and errors instantly
- High-performance code execution: Optimized C# compilation with assembly caching
- Dedicated database migration system: Version-controlled schema management
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
- Backend: Node.js (Express) with integrated .NET SDK for C# compilation
- Database: SQL Server 2022 (containerized)
- Migrations: Dedicated Node.js migration container with version tracking

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

2. Start all services (SQL Server, migrations, backend, frontend):
   ```bash
   docker-compose up --build
   ```

3. The system will automatically:
   - Start SQL Server and wait for it to be healthy
   - Run database migrations to create the schema
   - Start the backend API with C# compilation support
   - Start the frontend web application

4. Open your browser and navigate to:
   ```
   http://localhost:80
   ```

### Database Migrations

The system uses a dedicated migration container that runs automatically during startup. The migration system:

- Creates the `it_store_sales` database if it doesn't exist
- Runs versioned SQL migration scripts from `migrations/sql/`
- Tracks applied migrations in a `schema_migrations` table
- Only runs new migrations on subsequent startups

To manually run migrations:
```bash
# Run only the migration container
docker-compose up --build db-migrations

# Or run migrations in isolation
docker-compose run --rm db-migrations
```

Migration files are located in `migrations/sql/` and should follow the naming pattern: `YYYYMMDDHHMM-description.sql`


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
├── backend/                    # Backend API server
│   ├── server.js              # Express server with integrated C# execution
│   ├── Dockerfile             # Backend container with .NET SDK
│   └── package.json           # Backend dependencies
├── migrations/                 # Database migration system
│   ├── migration-runner.js    # Migration execution engine
│   ├── Dockerfile             # Migration container
│   ├── package.json           # Migration dependencies
│   └── sql/                   # Versioned migration scripts
│       └── *.sql              # Migration files (YYYYMMDDHHMM-description.sql)
├── src/                       # Frontend React application
│   ├── components/            # React components
│   │   ├── CodeEditor.tsx     # Monaco editor with performance optimizations
│   │   ├── Console.tsx        # Console output display
│   │   └── LanguageSelector.tsx # Language selection UI
│   ├── config/
│   │   └── languages.ts       # Language configurations
│   ├── services/
│   │   ├── api.ts             # API communication layer
│   │   └── codeExecution.ts   # Code execution service
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── App.tsx                # Main application component
├── docker-compose.yml         # Container orchestration
└── README.md
```

## Language Support

### JavaScript
- ES6+ support
- Console output capture
- Array, object, and function examples

### C#
- .NET 8.0 runtime with optimized compilation
- Assembly caching for fast repeated execution (~100ms vs 2-3 seconds)
- Console application support
- LINQ operations
- Object-oriented programming examples
- Integrated compilation in backend (no separate containers)

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

## Debugging

If you encounter issues with the application:

### Container Status
Check that all containers are running properly:
```bash
docker ps
```

You should see containers for:
- `sqlserver-it-store` (SQL Server database)
- `backend-api` (Backend API with C# support)
- `frontend-app` (React frontend)
- `db-migrations` (should exit after successful migration)

### Manual Container Startup
If the automatic startup fails, you can start containers manually:

```bash
# Start SQL Server first
docker-compose up -d sqlserver-db

# Run migrations manually
docker-compose up db-migrations

# Start backend manually
docker-compose up -d backend-api

# Start frontend manually  
docker-compose up -d frontend-app
```

### Common Issues
- **Migration failures**: Check `docker logs db-migrations` for SQL syntax errors
- **Backend connection issues**: Ensure SQL Server is healthy before backend starts
- **Frontend not loading**: Verify backend is running on port 5445
- **C# compilation errors**: Check that .NET SDK is properly installed in backend container

### Logs
View container logs for troubleshooting:
```bash
# View all logs
docker-compose logs

# View specific container logs
docker logs backend-api
docker logs db-migrations
docker logs sqlserver-it-store
```

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
- Production level security (the works!)
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
