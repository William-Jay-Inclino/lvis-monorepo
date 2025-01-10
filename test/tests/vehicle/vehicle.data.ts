import { VehicleData } from "./vehicle.types";
import { faker } from '@faker-js/faker';

export const vehicle_data: VehicleData = {
    name: faker.vehicle.vehicle(),
    vehicle_number: `SV-${Math.floor(10000 + Math.random() * 90000)}`,
    plate_number: faker.vehicle.vrm(),
    classification: 'Company',
    assignee: 'Tayag',
    date_acquired: new Date().toISOString().split('T')[0],
}