# Node backend Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache curl \
	&& npm ci --only=production \
	&& npm i -g pm2@latest
COPY . .
ENV NODE_ENV=production
EXPOSE 3001
# Run PM2 in cluster mode, instances = CPU cores (or override with PM2_INSTANCES)
ENV PM2_INSTANCES=0
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--only", "server"]
