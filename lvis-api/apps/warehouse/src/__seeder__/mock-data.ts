import { faker } from "@faker-js/faker"
import { ItemCodeTracker, ItemType, Project, Station, Supplier, Unit, VAT_TYPE, Vehicle } from "../__common__/types"

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

export const stations: Station[] = [
    {
        id: faker.string.uuid(),
        name: 'Main Office',
        location: 'Ormoc City',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Talisayan Substation',
        location: 'Talisayan kilid julies',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Mahayag Substation',
        location: 'Mahayag Eskina',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Tabango Substation',
        location: 'Tabango mo tanan',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Sambulawan Substation',
        location: 'Sambulawan Dimension',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Libongao Substation',
        location: 'Libongao States',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Calibuan Substation',
        location: 'Calibuan atbang sapa',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Palompon Substation',
        location: 'Palompon atbang kalanggaman',
        created_by: 'admin',
    }
]

export const projects: Project[] = [
    {
        id: faker.string.uuid(),
        name: 'Project 1',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Project 2',
        created_by: 'admin',
    },
    {
        id: faker.string.uuid(),
        name: 'Project 3',
        created_by: 'admin',
    },
]

export const units: Unit[] = [
    {
        id: faker.string.uuid(),
        name: 'Pieces',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        name: 'Cartons',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        name: 'Pallets',
        created_by: 'admin'
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