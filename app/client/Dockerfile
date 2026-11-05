FROM node:lts AS runtime
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
RUN npm run build

ENV PORT=4321
EXPOSE 4321
CMD ["npm", "run", "start"]