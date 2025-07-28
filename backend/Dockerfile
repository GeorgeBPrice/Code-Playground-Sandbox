# Use Node.js with .NET SDK for C# compilation
FROM mcr.microsoft.com/dotnet/sdk:8.0

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm && apt-get clean

# Set working directory
WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ .

# Create code directory for C# execution
RUN mkdir -p /app/code

# Expose port
EXPOSE 5445

# Start the backend server
CMD ["node", "server.js"] 