# Courier Tracking – Fullstack Case Study

You are supposed to create a full-stack web application with **Java** on the backend and **React + TypeScript** on the frontend, that mainly takes streaming geolocations of couriers as input and visualizes them on a dashboard.  
The application must meet the following criteria.

# Backend Criteria

The **backend part** of the application must meet the following criteria:

* Take streaming courier location data as input: (timestamp, courierId, lat, lng)
* The application must provide a way for querying total distances, over which any courier travels. A sample method signature may be such as;  ``Double getTotalTravelDistance(courierId);``
* Log courier and store when any courier enters radius of 100 meters from Migros stores. Reentries to the same store's circumference within 1 minute should not count as "entrance". 
* Implement at least 2 design patterns of your choice. 
* Create instructions to easily run and test your application (i.e. README or an executable script is nice to have).

## Input Data
stores.json
```
[
  {
    "name": "Ataşehir MMM Migros",
    "lat": 40.9923307,
    "lng": 29.1244229
  },
  {
    "name": "Novada MMM Migros",
    "lat": 40.986106,
    "lng": 29.1161293
  },
  {
    "name": "Beylikdüzü 5M Migros",
    "lat": 41.0066851,
    "lng": 28.6552262
  },
  {
    "name": "Ortaköy MMM Migros",
    "lat": 41.055783,
    "lng": 29.0210292
  },
  {
    "name": "Caddebostan MMM Migros",
    "lat": 40.9632463,
    "lng": 29.0630908
  }
]
```
Use the stores.json file as reference for Migros store locations.


# Frontend Criteria


You are supposed to create a **Single-Page Application (SPA)** using **React + TypeScript**, which consumes the backend APIs and visualizes courier and store data on a real-time dashboard.  
The frontend application must meet the following criteria:
* The frontend must be implemented using **React 18+**.
* You are expected to use a **modern build setup (e.g., Vite or Webpack)**
* You are expected to implement at least one reusable UI component and at least one custom React hook as part of the solution.


### Dashboard Screen: 
You are supposed to include the following functional elements (the layout and visual arrangement are up to you):
- A real-time list or visualization of **courier–store entrance events/logs**
- A map-based visual representation showing:
  - Migros store locations
  - Courier locations, updated periodically
  - Optional: 100m store radius visualization
- You are free to use **any map component/library** (e.g. Google Maps, Leaflet, Mapbox, OpenLayers, etc.)  
- A set of simple **filters**, such as:
  - Courier
  - Store
  - Date / time range
 - Users should be able to refresh the page and retain the same view.


### Courier Screen: 
Build a unified courier screen with the following features:

- Display a list of couriers (table, list, or card layout) showing:
  - Courier ID
  - Last known location
  - Total travel distance

- Provide search and filter functionality (e.g. by courier ID or name)

- Persist the current view state so that page refresh does not reset filters or selections

- Allow navigation to a courier-specific detail view when a courier is selected


**When a courier is selected, you must show:**

- Basic courier details (ID, last known coordinates, metadata if available)
- Total travel distance for this courier
- Optional:
  - A mini map showing the courier’s last location and visualization of the **stores entered** by this courier including timestamps


## Solution Proposal
* Push your solution to `origin/<your-branch-name>`, and create a pull request. Please do not merge your pull request.

