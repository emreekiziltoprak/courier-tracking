export interface Coordinate {
  readonly lat: number;
  readonly lng: number;
}

export interface CourierCreateDTO {
  readonly name: string;
  readonly lastLocation: Coordinate;
}

export interface CourierDTO {
  readonly id: string;
  readonly name: string;
  readonly lastLocation: Coordinate;
  readonly totalDistance: number;
  readonly lastUpdated: string;
}

export interface CourierDetailDTO {
  readonly id: string;
  readonly name: string;
  readonly lastLocation: Coordinate;
  readonly totalDistance: number;
  readonly lastUpdated: string;
  readonly storeEntries: readonly StoreEntryLogDTO[];
}

export interface StoreDTO {
  readonly name: string;
  readonly location: Coordinate;
}

export interface StoreEntryLogDTO {
  readonly id: string;
  readonly courierId: string;
  readonly storeName: string;
  readonly storeLocation: Coordinate;
  readonly entryTime: string;
}

export interface LocationEventDTO {
  readonly courierId: string;
  readonly coordinate: Coordinate;
  readonly timestamp: string;
}

export interface LogsFilter {
  readonly courierId?: string;
  readonly storeName?: string;
  readonly from?: string;
  readonly to?: string;
}
