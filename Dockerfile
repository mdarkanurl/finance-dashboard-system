FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy important files and folders first
COPY package.json pnpm-lock.yaml prisma ./
RUN pnpm install --frozen-lockfile

# Setup database
RUN npx prisma generate

# Now copy everything
COPY . .
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start"]