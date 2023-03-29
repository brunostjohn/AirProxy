# Build Stage
# ---
FROM node:16 AS builder
WORKDIR /opt/app

COPY package*.json ./
COPY . .
RUN npm install --omit optional
RUN npm run build
RUN rm -rf node_modules && npm i --production --ignore-scripts

# Run Stage
# ---
FROM gcr.io/distroless/nodejs:16
EXPOSE 8008
EXPOSE 554/tcp
EXPOSE 554/udp
EXPOSE 3689
EXPOSE 5353/udp

USER nobody

COPY --chown=nobody --from=builder /opt/app /opt/app
WORKDIR /opt/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV PATH /opt/node_app/node_modules/.bin:$PATH

CMD ["dist/main.js"]
