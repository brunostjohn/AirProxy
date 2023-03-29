# Build Stage
# ---
FROM node
EXPOSE 5173
WORKDIR /opt/app

COPY package.json ./
COPY . .
RUN npm install
RUN npm run build

WORKDIR /opt/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV PATH /opt/node_app/node_modules/.bin:$PATH

CMD ["npm", "run", "dev"]
