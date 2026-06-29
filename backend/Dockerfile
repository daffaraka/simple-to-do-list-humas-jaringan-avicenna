FROM node:18-alpine
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install dependencies (will trigger postinstall script: prisma generate)
RUN npm ci


# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 3001

# Run migrations and start the server
# Note: In production it's better to run migrations separately or during deployment pipeline, 
# but for simplicity in this setup we can run them before starting the server.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
