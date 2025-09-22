# Use a base image with Node.js and pnpm support
FROM node:24-slim AS base

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack to manage pnpm version
RUN corepack enable

# Copy package.json and pnpm-lock.yaml to leverage Docker's build cache
WORKDIR /app/frontend
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
# Use --frozen-lockfile for consistent builds
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port your development server runs on
EXPOSE 5173

# Command to run the development server
CMD ["pnpm", "run", "dev", "--host"]
