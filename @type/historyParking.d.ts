import type { List } from "postcss/lib/list";

type ParkingRecord = {
    date: string;
    motorbikes: List<VehicleInfo>;
    cars: List<VehicleInfo>;
};

type VehicleInfo = {
    licensePlate: string;
    solanvao: number;
    solanra: number;
    timeline: Array<TimeLine>;
    vehicleType: string;
};

type TimeLine = {
    timeOut: string;
    timeIn: string;
    imageOut: string;
    imageIn: string;
    hinhdauxera: string;
    hinhdauxevao: string;
};
