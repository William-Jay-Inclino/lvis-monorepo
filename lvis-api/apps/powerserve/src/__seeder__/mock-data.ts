import { faker } from "@faker-js/faker";
import { Area, Barangay, ComplaintCategory, ComplaintReportType, ComplaintStatus, Device, Feeder, Lineman, MeterBrand, Municipality, NatureOfComplaint, TaskStatus, WeatherCondition } from "./types";

const lineman_employees: { id: string, name: string }[] = [
    { id: '4e92e854-a584-42d9-b082-89dbdeab7d1c', name: 'Rosalito C. Abao' },
    { id: 'd3e0a3da-ee14-4558-9fef-33cf4c4467ec', name: 'Robert V. Abuyabor' },
    { id: '52fbd7b9-ffe6-4937-8f91-38ffebd91dc9', name: 'Jefrey M. Andrade' },
    { id: 'b6d2c0cb-80c9-4fef-9ee9-9622c15507b4', name: 'Junrey T. Anoos' },
    { id: '2a9b9ad9-2817-4aee-b877-516430726ae9', name: 'Alexis C. Arnejo' },
    { id: '5ac58b83-470c-4e41-8ad6-d0951529be82', name: 'Christopher S. Arnejo' },
    { id: '34dc0d5e-12a2-4c80-9f47-458c865ab49b', name: 'Ernesto L. Bang-ay' },
    { id: '7393e8e0-5318-4142-811b-9dcc97fa5703', name: 'Aldrin D. Batac' },
    { id: 'b6780dcd-0af9-414f-a688-6d8174b94daf', name: 'Martjun Q. Batan' },
    { id: 'f60dd675-7e81-4a54-b2f8-d2d9f787cbc8', name: 'Franklin S. Belacho' },
]

const area_head_employees: { id: string, name: string, area: string }[] = [
    { id: 'efd90c58-801f-4edd-a972-f74c3eaf3041', name: 'Ronie Cloyd L. Anito', area: 'Area 1' },
    { id: 'df6c1f74-69a9-489e-bab6-a38b7df6ea25', name: 'Jean van A. Sta. Iglesia', area: 'Area 2' },
    { id: 'eac98489-841b-4bdf-89e3-f5dc43f60f3e', name: 'Brixnel P. Emping', area: 'Area 3' },
    { id: '9b0fc623-42f7-40da-a5fe-5b44313a119a', name: 'Jomar M. Maglasang', area: 'Area 4' },
    { id: '3a0f0ec6-811b-430e-a204-d20586b1266b', name: 'Anthony S. Cecilio', area: 'Area 5' },
]

const areas: Area[] = [
    { id: faker.string.uuid(), oic_id: 'efd90c58-801f-4edd-a972-f74c3eaf3041', name: 'Area 1' },
    { id: faker.string.uuid(), oic_id: 'df6c1f74-69a9-489e-bab6-a38b7df6ea25', name: 'Area 2' },
    { id: faker.string.uuid(), oic_id: 'eac98489-841b-4bdf-89e3-f5dc43f60f3e', name: 'Area 3' },
    { id: faker.string.uuid(), oic_id: '9b0fc623-42f7-40da-a5fe-5b44313a119a', name: 'Area 4' },
    { id: faker.string.uuid(), oic_id: '3a0f0ec6-811b-430e-a204-d20586b1266b', name: 'Area 5' },
]

export const linemen: Lineman[] = [
    // Area 1
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[0].id, 
        area_id: areas[0].id, 
        supervisor_id:  'efd90c58-801f-4edd-a972-f74c3eaf3041',
    },
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[1].id, 
        area_id: areas[0].id, 
        supervisor_id:  'efd90c58-801f-4edd-a972-f74c3eaf3041',
    },
    // Area 2
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[2].id, 
        area_id: areas[1].id, 
        supervisor_id:  'df6c1f74-69a9-489e-bab6-a38b7df6ea25',
    },
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[3].id, 
        area_id: areas[1].id, 
        supervisor_id:  'df6c1f74-69a9-489e-bab6-a38b7df6ea25',
    },
    // Area 3
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[4].id, 
        area_id: areas[2].id, 
        supervisor_id:  'eac98489-841b-4bdf-89e3-f5dc43f60f3e',
    },
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[5].id, 
        area_id: areas[2].id, 
        supervisor_id:  'eac98489-841b-4bdf-89e3-f5dc43f60f3e',
    },
    // Area 4
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[6].id, 
        area_id: areas[3].id, 
        supervisor_id:  '9b0fc623-42f7-40da-a5fe-5b44313a119a',
    },
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[7].id, 
        area_id: areas[3].id, 
        supervisor_id:  '9b0fc623-42f7-40da-a5fe-5b44313a119a',
    },
    // Area 5
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[8].id, 
        area_id: areas[4].id, 
        supervisor_id:  '3a0f0ec6-811b-430e-a204-d20586b1266b',
    },
    { 
        id: faker.string.uuid(), 
        employee_id: lineman_employees[9].id, 
        area_id: areas[4].id, 
        supervisor_id:  '3a0f0ec6-811b-430e-a204-d20586b1266b',
    },

]

const municipalities: Municipality[] = [
    // Area 1
    { id: faker.string.uuid(), area_id: areas[0].id, name: 'Palompon' },
    { id: faker.string.uuid(), area_id: areas[0].id, name: 'Isabel' },
    { id: faker.string.uuid(), area_id: areas[0].id, name: 'Merida' },
    // Area 2
    { id: faker.string.uuid(), area_id: areas[1].id, name: 'Villaba' },
    { id: faker.string.uuid(), area_id: areas[1].id, name: 'Tabango' },
    { id: faker.string.uuid(), area_id: areas[1].id, name: 'San Isidro' },
    // Area 3
    { id: faker.string.uuid(), area_id: areas[2].id, name: 'Leyte-Leyte' },
    { id: faker.string.uuid(), area_id: areas[2].id, name: 'Calubian' },
    // Area 4
    { id: faker.string.uuid(), area_id: areas[2].id, name: 'Matag-ob' },
    { id: faker.string.uuid(), area_id: areas[3].id, name: 'Kananga' },
    // Area 5
    { id: faker.string.uuid(), area_id: areas[3].id, name: 'Albuera' },
    { id: faker.string.uuid(), area_id: areas[3].id, name: 'Ormoc City' },
]

const barangays: Barangay[] = [
    // Palompon
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[0].id,
        name: 'Tinubdan'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[0].id,
        name: '	Tinago'
    },
    // Isabel
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[1].id,
        name: '	Tubod'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[1].id,
        name: '	Tolingon'
    },
    // Merida
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[2].id,
        name: '	Puerto Bello'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[2].id,
        name: '	Poblacion'
    },
    // Villaba
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[3].id,
        name: 'Suba'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[3].id,
        name: 'Santa Cruz'
    },
    // Tabango
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[4].id,
        name: 'Tugas'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[4].id,
        name: 'Tabing'
    },
    // San Isidro
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[5].id,
        name: 'San Miguel'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[5].id,
        name: 'Busay'
    },
    // Leyte-Leyte
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[6].id,
        name: 'Wague'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[6].id,
        name: 'Ugbon'
    },
    // Calubian
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[7].id,
        name: 'Villanueva'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[7].id,
        name: 'Villalon'
    },
    // Matag-ob
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[8].id,
        name: 'San Guillermo'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[8].id,
        name: 'Malazarte'
    },
    // Kananga
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[9].id,
        name: 'Tugbong'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[9].id,
        name: 'Tongonan'
    },
    // Albuera 
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[10].id,
        name: '	Sherwood'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[10].id,
        name: '	Mahayag'
    },
    // Ormoc City
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[11].id,
        name: 'Nadongholan'
    },
    {
        id: faker.string.uuid(),
        municipality_id: municipalities[11].id,
        name: 'Kangleon Street'
    },
]

const feeders: Feeder[] = [
    { id: faker.string.uuid(), name: 'Feeder 1' },
    { id: faker.string.uuid(), name: 'Feeder 2' },
    { id: faker.string.uuid(), name: 'Feeder 3' },
]

const weather_conditions: WeatherCondition[] = [
    { id: faker.string.uuid(), name: 'Sunny' },
    { id: faker.string.uuid(), name: 'Cloudy' },
    { id: faker.string.uuid(), name: 'Rainy' },
    { id: faker.string.uuid(), name: 'Windy' },
    { id: faker.string.uuid(), name: 'Thunderstorm' },
]

const devices: Device[] = [
    { id: faker.string.uuid(), name: 'Device 1' },
    { id: faker.string.uuid(), name: 'Device 2' },
    { id: faker.string.uuid(), name: 'Device 3' },
]

const meter_brands: MeterBrand[] = [
    { id: faker.string.uuid(), name: 'Meter Brand 1' },
    { id: faker.string.uuid(), name: 'Meter Brand 2' },
    { id: faker.string.uuid(), name: 'Meter Brand 3' },
]

const complaint_statuses: ComplaintStatus[] = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'For Review' },
    { id: 4, name: 'Escalated' },
    { id: 5, name: 'Closed' },
    { id: 6, name: 'Cancelled' },
]

const task_statuses: TaskStatus[] = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Assigned' },
    { id: 3, name: 'Ongoing' },
    { id: 4, name: 'Completed' },
    { id: 5, name: 'Unresolved' },
    { id: 6, name: 'Cancelled' },
]

const complaint_report_types: ComplaintReportType[] = [
    { id: 1, name: 'Phone Call' },
    { id: 2, name: 'Walk In' },
    { id: 3, name: 'SMS' },
    { id: 4, name: 'Thru LEYECO V Employee' },
]

const complaint_categories: ComplaintCategory[] = [
    { id: 1, name: 'KWH Meter' },
    { id: 2, name: 'Power Interruption' },
    { id: 3, name: 'Line Services' },
    { id: 4, name: 'Distribution Line Equipment Services' },
    { id: 5, name: 'Load Management and Data Gathering Activities' },
    { id: 6, name: 'Billing' },
    { id: 7, name: 'Line Construction' },
]

const nature_of_complaints: NatureOfComplaint[] = [
    // KWH METER
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[0].id,
        name: 'New Connection',
        number_of_personnel_required: 1,
    },
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[0].id,
        name: 'Reconnection/Disconnection',
        number_of_personnel_required: 1,
    },
    // POWER INTERUPTION
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[1].id,
        name: 'Power Outage Restoration (Feeder Line)',
        number_of_personnel_required: 1,
    },
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[1].id,
        name: 'Power Outage Restoration (Backbone Line)',
        number_of_personnel_required: 1,
    },
    // LINE SERVICES
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[2].id,
        name: 'Withdrawal of Materials for CS Use',
        number_of_personnel_required: 1,
    },
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[2].id,
        name: 'Service Pole Installation',
        number_of_personnel_required: 1,
    },
    // DLES 
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[3].id,
        name: 'DT Replacement',
        number_of_personnel_required: 1,
    },
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[3].id,
        name: 'DT Installation',
        number_of_personnel_required: 1,
    },
    // LMDGA
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[4].id,
        name: 'Line/Load Balancing',
        number_of_personnel_required: 1,
    },
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[4].id,
        name: 'Transformer Load Management (Data Gathering Only)',
        number_of_personnel_required: 1,
    },
    // Billing
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[5].id,
        name: 'NOC-Billing Example ',
        number_of_personnel_required: 1,
    },
    // Line Construction
    {
        id: faker.string.uuid(),
        category_id: complaint_categories[6].id,
        name: 'NOC-Line Construction Example ',
        number_of_personnel_required: 1,
    },
]