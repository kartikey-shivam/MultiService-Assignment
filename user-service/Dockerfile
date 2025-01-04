# Stage 1: Build
FROM node:16 as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3001
CMD ["node", "src/app.js"]