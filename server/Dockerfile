# Node backend Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache curl \
	&& npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "index.js"]
