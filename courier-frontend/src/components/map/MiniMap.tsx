import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from "ol/style";
import "ol/ol.css";
import type { CourierDetailDTO, StoreEntryLogDTO } from "@/types/api";

const STORE_RADIUS_M = 100;

interface MiniMapProps {
  readonly detail: CourierDetailDTO;
}

export function MiniMap({ detail }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const source = new VectorSource();

    const courierCoord = fromLonLat([
      detail.lastLocation.lng,
      detail.lastLocation.lat,
    ]);
    const courierFeature = new Feature({ geometry: new Point(courierCoord) });
    courierFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: "#D9822B" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
        text: new Text({
          text: detail.name,
          offsetY: -16,
          fill: new Fill({ color: "#D9822B" }),
          stroke: new Stroke({ color: "#fff", width: 3 }),
          font: "bold 11px sans-serif",
        }),
      })
    );
    source.addFeature(courierFeature);

    const seen = new Set<string>();
    for (const entry of detail.storeEntries as readonly StoreEntryLogDTO[]) {
      if (seen.has(entry.storeName)) continue;
      seen.add(entry.storeName);

      const coord = fromLonLat([entry.storeLocation.lng, entry.storeLocation.lat]);

      const point = new Feature({ geometry: new Point(coord) });
      point.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: "#2965CC" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
          text: new Text({
            text: entry.storeName,
            offsetY: 16,
            fill: new Fill({ color: "#2965CC" }),
            stroke: new Stroke({ color: "#fff", width: 3 }),
            font: "10px sans-serif",
          }),
        })
      );

      const radiusFeature = new Feature({ geometry: new Circle(coord, STORE_RADIUS_M) });
      radiusFeature.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(41,101,204,0.08)" }),
          stroke: new Stroke({ color: "rgba(41,101,204,0.4)", width: 1, lineDash: [4, 4] }),
        })
      );

      source.addFeature(radiusFeature);
      source.addFeature(point);
    }

    if (mapRef.current) {
      mapRef.current.setTarget(undefined);
    }

    mapRef.current = new Map({
      target: containerRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source }),
      ],
      view: new View({
        center: courierCoord,
        zoom: 14,
      }),
    });

    const extent = source.getExtent();
    if (extent && extent[0] !== Infinity && mapRef.current) {
      mapRef.current.getView().fit(extent as [number, number, number, number], { padding: [40, 40, 40, 40], maxZoom: 16 });
    }

    return () => {
      mapRef.current?.setTarget(undefined);
    };
  }, [detail]);

  return (
    <div ref={containerRef} className="mini-map" />
  );
}
