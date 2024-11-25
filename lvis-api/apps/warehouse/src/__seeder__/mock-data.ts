import { faker } from "@faker-js/faker"
import { ItemCodeTracker, ItemType, Project, Station, Supplier, Unit, VAT_TYPE, Vehicle } from "../__common__/types"
import { GasStation } from "../gas-station/entities/gas-station.entity"
import { FuelType } from "../fuel-type/entities/fuel-type.entity"

export const suppliers: Supplier[] = [
    {
        id: faker.string.uuid(),
        name: 'Robinson',
        contact: '+639000000000',
        tin: '209-609-185-00054',
        address: 'Brgy. Cogon, Ormoc City, Leyte',
        created_by: 'admin',
        is_vat_registered: true,
        vat_type: VAT_TYPE.INC,
    },
    {
        id: faker.string.uuid(),
        name: 'SM',
        contact: '+639000000000',
        tin: '209-609-185-00054',
        address: 'REAL ST., ORMOC CITY',
        is_vat_registered: true,
        created_by: 'admin',
        vat_type: VAT_TYPE.EXC,
    },
    {
        id: faker.string.uuid(),
        name: 'Puregold',
        contact: '+639000000000',
        tin: '209-609-185-00054',
        address: 'REAL ST., ORMOC CITY',
        is_vat_registered: true,
        created_by: 'admin',
        vat_type: VAT_TYPE.INC,
    },
    {
        id: faker.string.uuid(),
        name: 'PC Tools',
        contact: '+639000000000',
        tin: '209-609-185-00054',
        address: 'REAL ST., ORMOC CITY',
        is_vat_registered: false,
        created_by: 'admin',
        vat_type: VAT_TYPE.NONE,
    }
]

export const itemTypes: ItemType[] = [
    {
        id: 1,
        name: 'Office Supply',
        code: 'OS',
    },
    {
        id: 2,
        name: 'Special Equipment',
        code: 'SE',
    },
    {
        id: 3,
        name: 'Line Material',
        code: 'LM',
    },
    {
        id: 4,
        name: 'Spare Parts',
        code: 'SP',
    }
]

export const itemCodeTracker: ItemCodeTracker[] = [
    {
        id: 1,
        item_code: 'OS',
        year: 24,
        last_incremental: 0,
    },
    {
        id: 2,
        item_code: 'SE',
        year: 24,
        last_incremental: 0,
    },
    {
        id: 3,
        item_code: 'LM',
        year: 24,
        last_incremental: 0,
    },
    {
        id: 4,
        item_code: 'SP',
        year: 24,
        last_incremental: 0,
    }
]

export const main_office_id = faker.string.uuid()

export const stations: Station[] = [
    {
        id: main_office_id,
        name: 'Main Office',
    },
    {
        id: faker.string.uuid(),
        name: 'Talisayan Substation',
    },
    {
        id: faker.string.uuid(),
        name: 'Mahayag Substation',
    },
    {
        id: faker.string.uuid(),
        name: 'Tabango Substation',
    },
    {
        id: faker.string.uuid(),
        name: 'Sambulawan Substation',
    },
    {
        id: faker.string.uuid(),
        name: 'Libongao Substation',
    },
    {
        id: faker.string.uuid(),
        name: 'Calibuan Substation',
    },
    {
        id: faker.string.uuid(),
        name: 'Palompon Substation',
    }
]

export const projects: Project[] = [
    {
        id: faker.string.uuid(),
        name: 'Project 1',
    },
    {
        id: faker.string.uuid(),
        name: 'Project 2',
    },
    {
        id: faker.string.uuid(),
        name: 'Project 3',
    },
]

export const units: Unit[] = [
    {
        id: faker.string.uuid(),
        name: 'Pcs',
    },
    {
        id: faker.string.uuid(),
        name: 'Cartons',
    },
    {
        id: faker.string.uuid(),
        name: 'Pallets',
    }
]

export const vehicles: Vehicle[] = [
    {
        id: faker.string.uuid(),
        name: 'Vehicle 1',
        plate_number: 'ABC-123',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        name: 'Vehicle 2',
        plate_number: 'ABC-456',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        name: 'Vehicle 3',
        plate_number: 'ABC-789',
        created_by: 'admin'
    }
]

export const gasStations: GasStation[] = [
    {
        id: 1,
        name: "Leyeco Gas Station",
    },
    {
        id: 2,
        name: "Shell Cogon Ormoc City",
    },
    {
        id: 3,
        name: "Petron Libertad Ormoc City",
    },
]


export const fuelTypes: FuelType[] = [
    {
        id: 1,
        name: 'Diesel',
    },
    {
        id: 2,
        name: 'Unleaded',
    },
]