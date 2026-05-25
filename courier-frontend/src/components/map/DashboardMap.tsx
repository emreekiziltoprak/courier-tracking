import { useEffect, useRef, useState } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import type { FeatureLike } from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Circle from "ol/geom/Circle";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from "ol/style";
import "ol/ol.css";
import { useCourierStore } from "@/store/courierStore";
import { useStoreStore } from "@/store/storeStore";
import { useUiStore } from "@/store/uiStore";
import type { CourierDTO, StoreDTO } from "@/types/api";

const TRAIL_MAX = 25;
const STORE_RADIUS_M = 100;

const CLR_BRAND = "#009af2";
const CLR_WARNING = "#f89927";
const CLR_WARNING_HOVER = "#ffb54d";
const CLR_SUCCESS = "#36da43";
const CLR_FG1 = "#2b2b2b";

const labelStyleCache = new Map<string, Style>();
const trailStyle: Style[] = [
  new Style({ stroke: new Stroke({ color: "rgba(248,153,39,0.55)", width: 3 }) }),
];

function getLabelStyle(name: string): Style {
  let cached = labelStyleCache.get(name);
  if (!cached) {
    cached = new Style({
      text: new Text({
        text: name,
        offsetY: 20,
        fill: new Fill({ color: "#ffffff" }),
        backgroundFill: new Fill({ color: "rgba(33,33,33,0.82)" }),
        padding: [2, 6, 2, 6],
        font: "bold 11px Inter,sans-serif",
      }),
    });
    labelStyleCache.set(name, cached);
  }
  return cached;
}

function bearingRad(from: number[], to: number[]): number {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9) return 0;
  return Math.atan2(dx, dy);
}

function buildStoreStyles(name: string): Style[] {
  return [
    new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: CLR_BRAND }),
        stroke: new Stroke({ color: CLR_FG1, width: 2 }),
      }),
      text: new Text({
        text: name,
        offsetY: -18,
        fill: new Fill({ color: "#ffffff" }),
        backgroundFill: new Fill({ color: "rgba(33,33,33,0.82)" }),
        padding: [2, 6, 2, 6],
        font: "bold 11px Inter,sans-serif",
      }),
    }),
  ];
}

function buildRadiusStyle(): Style {
  return new Style({
    fill: new Fill({ color: "rgba(0,154,242,0.06)" }),
    stroke: new Stroke({ color: "rgba(0,154,242,0.3)", width: 1, lineDash: [5, 5] }),
  });
}

function buildFocusStyle(): Style {
  return new Style({
    fill: new Fill({ color: "rgba(54,218,67,0.15)" }),
    stroke: new Stroke({ color: CLR_SUCCESS, width: 3 }),
  });
}

function initStores(stores: readonly StoreDTO[], source: VectorSource) {
  source.clear();
  for (const store of stores) {
    const coord = fromLonLat([store.location.lng, store.location.lat]);

    const radius = new Feature({ geometry: new Circle(coord, STORE_RADIUS_M) });
    radius.setStyle(buildRadiusStyle());
    source.addFeature(radius);

    const point = new Feature({ geometry: new Point(coord) });
    point.setStyle(buildStoreStyles(store.name));
    source.addFeature(point);
  }
}

export function DashboardMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<OlMap | null>(null);

  const storeSourceRef = useRef(new VectorSource());
  const trailSourceRef = useRef(new VectorSource());
  const courierSourceRef = useRef(new VectorSource({ useSpatialIndex: false }));
  const focusSourceRef = useRef(new VectorSource());

  const courierFeaturesRef = useRef<globalThis.Map<string, Feature<Point>>>(new globalThis.Map());
  const trailFeaturesRef = useRef<globalThis.Map<string, Feature<LineString>>>(new globalThis.Map());
  const trailCoordsRef = useRef<globalThis.Map<string, number[][]>>(new globalThis.Map());
  const lastOlCoordsRef = useRef<globalThis.Map<string, number[]>>(new globalThis.Map());
  const prevByIdRef = useRef<Record<string, CourierDTO>>({});
  const mapRenderedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  const couriersById = useCourierStore((s) => s.couriersById);
  const stores = useStoreStore((s) => s.stores);
  const mapFocus = useUiStore((s) => s.mapFocus);
  const clearMapFocus = useUiStore((s) => s.clearMapFocus);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new OlMap({
      target: mapContainerRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: storeSourceRef.current, zIndex: 1 }),
        new VectorLayer({ source: trailSourceRef.current, zIndex: 2 }),
        new VectorLayer({ source: focusSourceRef.current, zIndex: 3 }),
        new WebGLVectorLayer({
          source: courierSourceRef.current,
          style: {
            "circle-radius": ["match", ["get", "moving"], 1, 10, 8],
            "circle-fill-color": ["match", ["get", "moving"], 1, CLR_WARNING_HOVER, CLR_WARNING],
            "circle-stroke-color": CLR_FG1,
            "circle-stroke-width": 2,
          },
          disableHitDetection: true,
          zIndex: 4,
        }),
        new VectorLayer({
          source: courierSourceRef.current,
          minZoom: 14,
          style: (feature: FeatureLike) => {
            const name = feature.get("name") as string;
            return name ? getLabelStyle(name) : undefined;
          },
          zIndex: 5,
        }),
      ],
      view: new View({ center: fromLonLat([28.9784, 41.0082]), zoom: 13 }),
    });
    mapRef.current = map;
    map.once("rendercomplete", () => {
      mapRenderedRef.current = true;
      setMapReady(true);
    });

    const ro = new ResizeObserver(() => map.updateSize());
    ro.observe(mapContainerRef.current);

    return () => {
      ro.disconnect();
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    initStores(stores, storeSourceRef.current);
  }, [stores]);

  useEffect(() => {
    if (!mapRenderedRef.current) return;

    const prev = prevByIdRef.current;
    const current = couriersById;

    for (const id of Object.keys(current)) {
      if (prev[id] === current[id]) continue;

      const courier = current[id];
      if (!courier.lastLocation) continue;

      const olCoord = fromLonLat([courier.lastLocation.lng, courier.lastLocation.lat]);
      const existing = courierFeaturesRef.current.get(id);

      if (!existing) {
        const feat = new Feature<Point>({ geometry: new Point(olCoord) });
        feat.setProperties({ name: courier.name, rotation: 0, moving: 0 }, true);
        courierFeaturesRef.current.set(id, feat);
        courierSourceRef.current.addFeature(feat);

        const trailFeat = new Feature<LineString>({ geometry: new LineString([olCoord]) });
        trailFeat.setStyle(trailStyle);
        trailFeaturesRef.current.set(id, trailFeat);
        trailSourceRef.current.addFeature(trailFeat);

        trailCoordsRef.current.set(id, [olCoord]);
        lastOlCoordsRef.current.set(id, olCoord);
      } else {
        const lastOl = lastOlCoordsRef.current.get(id) ?? olCoord;
        const moved =
          Math.abs(olCoord[0] - lastOl[0]) > 0.5 ||
          Math.abs(olCoord[1] - lastOl[1]) > 0.5;
        const rotation = bearingRad(lastOl, olCoord);

        existing.setProperties(
          { name: courier.name, rotation, moving: moved ? 1 : 0 },
          true
        );
        existing.getGeometry()!.setCoordinates(olCoord);

        if (moved) {
          const trail = trailCoordsRef.current.get(id) ?? [];
          trail.unshift(olCoord);
          if (trail.length > TRAIL_MAX) trail.length = TRAIL_MAX;
          trailCoordsRef.current.set(id, trail);
          const trailFeat = trailFeaturesRef.current.get(id);
          if (trailFeat && trail.length > 1) {
            trailFeat.getGeometry()!.setCoordinates(trail);
          }
          lastOlCoordsRef.current.set(id, olCoord);
        }
      }
    }

    for (const id of Object.keys(prev)) {
      if (current[id]) continue;

      const feat = courierFeaturesRef.current.get(id);
      if (feat) {
        courierSourceRef.current.removeFeature(feat);
        courierFeaturesRef.current.delete(id);
      }
      const trailFeat = trailFeaturesRef.current.get(id);
      if (trailFeat) {
        trailSourceRef.current.removeFeature(trailFeat);
        trailFeaturesRef.current.delete(id);
      }
      trailCoordsRef.current.delete(id);
      lastOlCoordsRef.current.delete(id);
    }

    prevByIdRef.current = current;
  }, [couriersById, mapReady]);

  useEffect(() => {
    if (!mapFocus) return;

    const { coord } = mapFocus;
    const olCoord = fromLonLat([coord.lng, coord.lat]);

    focusSourceRef.current.clear();
    const feat = new Feature({ geometry: new Circle(olCoord, STORE_RADIUS_M) });
    feat.setStyle(buildFocusStyle());
    focusSourceRef.current.addFeature(feat);

    const doAnimate = () => {
      mapRef.current?.getView().animate({
        center: olCoord,
        zoom: 17,
        duration: 800,
      });
    };

    if (mapRef.current) {
      setTimeout(doAnimate, 50);
    } else {
      const interval = setInterval(() => {
        if (mapRef.current) {
          clearInterval(interval);
          doAnimate();
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 3000);
    }

    return () => {
      clearMapFocus();
    };
  }, [mapFocus?.ts]);

  return <div ref={mapContainerRef} className="map-container" />;
}
