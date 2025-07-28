# Database Migration Container - Fixed Node.js approach
FROM node:18-alpine

# Set working directory
WORKDIR /migrations

# Copy package files first for better caching
COPY migrations/package.json ./

# Install Node.js dependencies
RUN npm install

# Copy migration files ONLY
COPY migrations/ ./

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S migration -u 1001 -G nodejs

# Change ownership of the migration directory
RUN chown -R migration:nodejs /migrations

# Switch to non-root user
USER migration

# Run migrations
CMD ["node", "migration-runner.js"]