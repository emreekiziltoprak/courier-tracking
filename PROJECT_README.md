# Courier Tracking System

A real-time courier location tracking application that processes streaming geolocation data, detects store proximity entries, and visualizes courier movements on an interactive map.

## Architecture

```
┌──────────────┐     ┌───────────┐     ┌──────────────────────────────────┐
│   Simulator  │────▶│   Kafka   │────▶│  Location Event Publisher       │
│  (150 couriers)    │ (3 parts) │     │    ├─ DistanceUpdateListener    │
└──────────────┘     └───────────┘     │    ├─ ProximityCheckListener    │
                                       │    └─ SseBroadcastListener     │
                                       └──────┬───────┬───────┬─────────┘
                                              │       │       │
                                         ┌────▼──┐ ┌──▼───┐ ┌─▼──┐
                                         │ PgSQL │ │Redis │ │ SSE│──▶ React
                                         └───────┘ └──────┘ └────┘
```

**Backend:** Spring Boot 4, Java 21, PostgreSQL, Redis, Kafka, JTS (R-Tree), MapStruct

**Frontend:** React 18, TypeScript, Vite, OpenLayers, AG Grid, Zustand

## Key Features

- **Streaming Location Processing** — Kafka-based pipeline with 3 partitions for parallel consumption
- **Proximity Detection** — R-Tree spatial index with Haversine distance calculation for efficient 100m radius store entry detection
- **Cooldown Mechanism** — Redis TTL-based deduplication (1 min) with database fallback
- **Real-Time Dashboard** — SSE streaming with WebGL-accelerated map rendering and requestAnimationFrame batching
- **Observer Pattern** — Decoupled event processing with parallel listener execution via Virtual Threads

## Design Patterns

| Pattern | Usage |
|---------|-------|
| **Observer** | `LocationEventPublisher` dispatches location events to independent listeners |
| **Template Method** | `AbstractBaseService` provides generic CRUD operations |
| **Strategy** | `DistanceCalculator` / `SpatialIndex` interfaces with pluggable implementations |
| **Builder** | Domain entities and DTOs via Lombok `@Builder` |

## Quick Start (Docker Compose)

```bash
docker compose up --build
```

| Service    | URL                                  |
|------------|--------------------------------------|
| Frontend   | http://localhost:3000                 |
| Backend    | http://localhost:8080                 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

> See [INSTRUCTIONS.md](INSTRUCTIONS.md) for detailed setup, development, and troubleshooting.

## Local Development

### 1. Start infrastructure services

```bash
docker compose up -d postgresql zookeeper kafka redis
```

### 2. Run the backend

```bash
./mvnw spring-boot:run
```

The application starts a courier simulator on boot — 150 couriers generating location updates every 2 seconds.

### 3. Run the frontend

```bash
cd courier-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` by default.

## Project Structure

```
├── src/main/java/com/courier/tracking/
│   ├── feature/
│   │   ├── courier/          # Courier CRUD, location processing, distance tracking
│   │   ├── store/            # Store proximity detection, entry logging
│   │   └── sse/              # Server-Sent Events broadcasting
│   ├── infrastructure/
│   │   ├── kafka/            # Producer, Consumer, Dead Letter Queue
│   │   ├── observer/         # Event publisher + listeners (distance, proximity, SSE)
│   │   ├── scheduler/        # Location history cleanup (7-day retention)
│   │   └── simulator/        # Courier movement simulator
│   ├── shared/               # Base entity, spatial index (R-Tree), coordinate model
│   └── config/               # Kafka, Store, Observer configuration
├── courier-frontend/         # React SPA
├── docker-compose.yml
├── Dockerfile
└── pom.xml
```

## API

Full API documentation is available via Swagger UI at `/swagger-ui.html` when the application is running.

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | `/api/v1/couriers`              | List all couriers              |
| GET    | `/api/v1/couriers/{id}`         | Get courier by ID              |
| GET    | `/api/v1/couriers/{id}/detail`  | Get courier with entry logs    |
| GET    | `/api/v1/couriers/{id}/distance`| Get total travel distance      |
| GET    | `/api/v1/stores`                | List all stores                |
| GET    | `/api/v1/stores/logs`           | Query store entry logs         |
| GET    | `/api/v1/sse/stream`            | SSE stream for live updates    |
