# My Node.js Project

This project is a Node.js application built with TypeScript, Express, Mongoose, Kafka and Redis. It serves as a template for creating RESTful APIs with a focus on modular architecture.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Source Files Included](#files-included)
- [Setup](#setup)
- [Other](#other)

## Tech Stack

1. Node.js (Typescript)
2. Redis
3. Kafka
4. MongoDB
5. Docker (`docker-compose.yml` to run Redis, Kafka and MongoDB images)

## Source Files Included

1. records.json (1000 records)
2. fields.json
3. apis.json (postman collection)
4. flow.png

## Setup

1. In docker-compose.yml change `KAFKA_ZOOKEEPER_CONNECT` and `KAFKA_ADVERTISED_LISTENERS` ip according to your network ip.
2. Run docker-compose file `npm run docker`.
3. Manually import `records.json` and `fields.json` files to records and fields collections.
4. Run `npm run dev`.
5. Run `POST => action-types` to create multiple action types.
6. Run `bulk-action` apis (only "upd" action will work as there is only one kafka consumer handler i.e. for update function, but other functions can also be added and it will work perfectly fine).

## Other

1. View the redis keys and value in the redis ui running on => `http://localhost:8001/redis-stack/browser`
