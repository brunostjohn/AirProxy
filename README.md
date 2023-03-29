# ![App Logo](https://github.com/brunostjohn/AirProxy/raw/main/web/src/assets/icons/favicon-32x32.png)AirProxy

A work in progress solution to proxy music from Spotify Connect to AirPlay

Thank you to the Cider team for their work on reverse engineering AirPlay and implementing it as [this module](https://github.com/ciderapp/node_airtunes2).

## Installing

At the moment, this stack is under a lot of development. It might not work. Nevertheless, here's the recommended Docker Compose setup.

```yaml
version: "3.9"
name: airproxy
services:
  server:
    image: brunostjohn/airproxy-server:0.0.1
    restart: always
    container_name: airproxy-server
    network_mode: host
  web:
    image: brunostjohn/airproxy-web:0.0.1
    restart: always
    container_name: airproxy-web
    ports:
      - 5173:5173
    depends_on:
      - server
```

All you have to do is `docker compose pull && docker compose up -d` and you're rolling. Hope it works for you.
