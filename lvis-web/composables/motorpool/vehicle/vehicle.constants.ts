import { VEHICLE_CLASSIFICATION, VehicleClassificationMapper } from "./vehicle.enums";
import type { VehicleClassification, VehicleType } from "./vehicle.types";


export const VEHICLE_CLASSIFICATIONS: VehicleClassification[] = [
    {
        id: VEHICLE_CLASSIFICATION.COMPANY,
        name: VehicleClassificationMapper[VEHICLE_CLASSIFICATION.COMPANY]
    },
    {
        id: VEHICLE_CLASSIFICATION.GOVERNMENT,
        name: VehicleClassificationMapper[VEHICLE_CLASSIFICATION.GOVERNMENT]
    },
    {
        id: VEHICLE_CLASSIFICATION.OUTSOURCE,
        name: VehicleClassificationMapper[VEHICLE_CLASSIFICATION.OUTSOURCE]
    },
    {
        id: VEHICLE_CLASSIFICATION.PRIVATE,
        name: VehicleClassificationMapper[VEHICLE_CLASSIFICATION.PRIVATE]
    },
    {
        id: VEHICLE_CLASSIFICATION.V_HIRE,
        name: VehicleClassificationMapper[VEHICLE_CLASSIFICATION.V_HIRE]
    }
]


export const VEHICLE_TYPES: VehicleType[] = ['BOD', 'GV', 'MU', 'OM', 'PV', 'SV', 'TR', 'VH']