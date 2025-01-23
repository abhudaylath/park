export type LatLng = {
    lat: number,
    lng: number
}

export type ListSpotPropsType = {
    onNext: () => void,
    onPrev?: () => void
}

export type Price = {
    hourly: number
}

export enum ParkingLocationStatus {
    AVAILABLE = 'AVAILABLE',
    FULL = 'FULL',
    NOTAVAILABLE = 'NOTAVAILABLE',
}

export type UpdateLocationParams = {
    address: string,
    numberofspots: number,
    price: {
        hourly: number
    }
}

export enum MapAddressType {
    PARKINGLOCATION = 'PARKINGLOCATION',
    DESTINATION = 'DESTINATION',
    ADMIN = 'ADMIN'
}

export type MapParams = {
    id: string,
    gpscoords: LatLng,
    address: string,
    numberofspots?: number,
    bookedspots?: number,
    price?: Price,
    type?: string,
    status?: string,
    radius?: number
}

export enum BookingStatus {
    CANCELLED = 'CANCELLED',
    BOOKED = 'BOOKED',
    PENDING = 'PENDING_PAYMENT'
}

export type ActionResponse = {
    code: number,
    message: string,
    data?: Date,
    error?: string
}


export type ParkingLocationDoc = {
    address: string;
    gpscoords: { lat: number; lng: number };
    price: { hourly: number };
    numberofspots: number;
    status: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
};


export type ParkingLocationResponse = {
    $__: object; // MongoDB's internal metadata
    $isNew: boolean;
    bookedspots: number;
    _doc: ParkingLocationDoc;
};
