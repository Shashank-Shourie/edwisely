FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy app
COPY . .

# Expose Next dev port
EXPOSE 3000

# Start Next in dev mode
CMD ["/bin/sh", "-c", "npm run dev -- --hostname 0.0.0.0"]
