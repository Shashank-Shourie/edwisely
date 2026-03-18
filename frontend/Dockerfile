FROM node:20

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Copy rest of the source
COPY . .

# Expose Next dev port
EXPOSE 3000

# Start Next in dev mode binding to all interfaces
CMD ["/bin/sh", "-c", "npm run dev -- --hostname 0.0.0.0"]
