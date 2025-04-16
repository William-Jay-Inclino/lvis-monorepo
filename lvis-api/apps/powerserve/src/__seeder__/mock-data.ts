import { faker } from "@faker-js/faker";
import { Area, Barangay, ActivityCategory, ComplaintReportType, ComplaintStatus, Device, Feeder, Lineman, MeterBrand, Municipality, Activity, TaskStatus, WeatherCondition, Unit, ActivityCategoryCauses, Remarks } from "./types";
import { Equipment } from "apps/powerserve/prisma/generated/client";

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

export const areas: Area[] = [
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

export const municipalities: Municipality[] = [
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

export const barangays: Barangay[] = [
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

export const feeders: Feeder[] = [
    { id: faker.string.uuid(), name: 'Feeder 1-1' },
    { id: faker.string.uuid(), name: 'Feeder 1-2' },
    { id: faker.string.uuid(), name: 'Feeder 1-3' },
    { id: faker.string.uuid(), name: 'Feeder 1-4' },
    { id: faker.string.uuid(), name: 'Feeder 1-5' },
    { id: faker.string.uuid(), name: 'Feeder 1-6' },
    { id: faker.string.uuid(), name: 'Feeder 2-1' },
    { id: faker.string.uuid(), name: 'Feeder 2-2' },
    { id: faker.string.uuid(), name: 'Feeder 2-3' },
    { id: faker.string.uuid(), name: 'Feeder 6-1' },
    { id: faker.string.uuid(), name: 'Feeder 6-2' },
    { id: faker.string.uuid(), name: 'Feeder 6-3' },
    { id: faker.string.uuid(), name: 'Feeder 3-1' },
    { id: faker.string.uuid(), name: 'Feeder 3-2' },
    { id: faker.string.uuid(), name: 'Feeder 3-3' },
    { id: faker.string.uuid(), name: 'Feeder 4-1' },
    { id: faker.string.uuid(), name: 'Feeder 4-2' },
    { id: faker.string.uuid(), name: 'Feeder 5-1' },
    { id: faker.string.uuid(), name: 'Feeder 5-2' },
    { id: faker.string.uuid(), name: 'Feeder 5-3' },
]

export const units: Unit[] = [
    { id: faker.string.uuid(), name: 'Assy.' },
    { id: faker.string.uuid(), name: 'DTs' },
    { id: faker.string.uuid(), name: 'Holes' },
    { id: faker.string.uuid(), name: 'Hrs.' },
    { id: faker.string.uuid(), name: 'Km' },
    { id: faker.string.uuid(), name: 'KwhM' },
    { id: faker.string.uuid(), name: 'Pcs.' },
    { id: faker.string.uuid(), name: 'Points' },
    { id: faker.string.uuid(), name: 'Poles' },
    { id: faker.string.uuid(), name: 'SCO' },
    { id: faker.string.uuid(), name: 'Spans' },
    { id: faker.string.uuid(), name: 'Structures' },
    { id: faker.string.uuid(), name: 'Units' },
]

export const remarks: Remarks[] = [
    { id: 1, min: 0, max: 79, label: 'Poor' },
    { id: 2, min: 80, max: 89, label: 'Fair' },
    { id: 3, min: 90, max: 99, label: 'Good' },
    { id: 4, min: 100, max: 120, label: 'Excellent' },
]

export const activity_categories: ActivityCategory[] = [
    { id: 1, name: 'KWH Meter' },
    { id: 2, name: 'Power Interruption' },
    { id: 3, name: 'Line Services' },
    { id: 4, name: 'Distribution Line Equipment Services' },
    { id: 5, name: 'Load Management and Data Gathering Activities' },
    { id: 6, name: 'Billing' },
    { id: 7, name: 'Line Construction' },
]

export const causes: ActivityCategoryCauses[] = [
    { id: faker.string.uuid(), name: 'HUMAN BEING', code:'001' },
    { id: faker.string.uuid(), name: 'LIGHTNING', code:'002' },
    { id: faker.string.uuid(), name: 'MAJOR STORM DISASTER', code:'003' },
    { id: faker.string.uuid(), name: 'SCHEDULED', code:'004' },
    { id: faker.string.uuid(), name: 'TREES', code:'005' },
    { id: faker.string.uuid(), name: 'OVERLOAD', code:'006' },
    { id: faker.string.uuid(), name: 'ERROR', code:'007' },
    { id: faker.string.uuid(), name: 'SUPPLY', code:'008' },
    { id: faker.string.uuid(), name: 'EQUIPMENT', code:'009' },
    { id: faker.string.uuid(), name: 'OTHER ', code:'010' },
    { id: faker.string.uuid(), name: 'UNKNOWN', code:'011' },
    { id: faker.string.uuid(), name: 'EARTHQUAKE', code:'012' },
    { id: faker.string.uuid(), name: 'Broken Glass Cover', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Broken Terminal', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Burn Meter', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Burn Terminal ', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Fast Running', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Moisturized', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'No Display', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Not Running', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Slow Running', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Up-Grading', category_id: activity_categories[0].id },
    { id: faker.string.uuid(), name: 'Up-rating', category_id: activity_categories[0].id },
]

export const weather_conditions: WeatherCondition[] = [
    { id: faker.string.uuid(), name: 'WIND', code:'101' },
    { id: faker.string.uuid(), name: 'LIGHTNING', code:'102' },
    { id: faker.string.uuid(), name: 'RAIN', code:'103' },
    { id: faker.string.uuid(), name: 'CLEAR DAY', code:'104' },
    { id: faker.string.uuid(), name: 'TYPHOON', code:'105' },
]

export const devices: Device[] = [
    { id: faker.string.uuid(), name: 'BREAKER', code:'201' },
    { id: faker.string.uuid(), name: 'RECLOSER', code:'202' },
    { id: faker.string.uuid(), name: 'FUSE', code:'203' },
    { id: faker.string.uuid(), name: 'SECTIONALIZER', code:'204' },
    { id: faker.string.uuid(), name: 'SWITCH', code:'205' },
    { id: faker.string.uuid(), name: 'NETWORK PROTECTORS', code:'206' },
]

export const equipments: Equipment[] = [
    { id: faker.string.uuid(), name: 'PRIMARY LINE', code:'301' },
    { id: faker.string.uuid(), name: 'SECONDARY LINE', code:'302' },
    { id: faker.string.uuid(), name: 'DISTRIBUTION TRANSFORMER', code:'003' },
    { id: faker.string.uuid(), name: 'DISTRIBUTION SUBSTATION', code:'304' },
    { id: faker.string.uuid(), name: 'SPLICE (RISER)', code:'305' },
    { id: faker.string.uuid(), name: 'LIGHTNING ARRESTER', code:'306' },
    { id: faker.string.uuid(), name: 'SWITCHES', code:'307' },
    { id: faker.string.uuid(), name: 'CROSSARM', code:'308' },
    { id: faker.string.uuid(), name: 'POLE', code:'309' },
    { id: faker.string.uuid(), name: 'INSULATOR', code:'310' },
    { id: faker.string.uuid(), name: 'CONNECTOR', code:'311' },
    { id: faker.string.uuid(), name: 'OTHERS', code:'312' },
    { id: faker.string.uuid(), name: 'UNKNOWN', code:'313' },
]

export const meter_brands: MeterBrand[] = [
    { id: faker.string.uuid(), name: 'EDMI' },
    { id: faker.string.uuid(), name: 'ENERTEK' },
    { id: faker.string.uuid(), name: 'EVER' },
    { id: faker.string.uuid(), name: 'FUJI' },
    { id: faker.string.uuid(), name: 'FUJI DARMA' },
    { id: faker.string.uuid(), name: 'HOLLEY' },
    { id: faker.string.uuid(), name: 'MITSUBISHI' },
    { id: faker.string.uuid(), name: 'TRITECH' },
]

export const complaint_statuses: ComplaintStatus[] = [
    { id: 1, name: 'Pending', color_class: 'gray', description: 'The complaint has been received but not yet addressed' },
    { id: 2, name: 'In Progress', color_class: 'blue', description: 'The issue is actively being worked on' },
    { id: 3, name: 'For Review', color_class: 'yellow', description: 'The resolution is completed and awaiting verification' },
    { id: 4, name: 'Escalated', color_class: 'orange', description: 'The complaint requires higher-level intervention' },
    { id: 5, name: 'Closed', color_class: 'green', description: 'The issue has been resolved and finalized' },
    { id: 6, name: 'Cancelled', color_class: 'red', description: 'The complaint was withdrawn or deemed invalid' },
]

export const task_statuses: TaskStatus[] = [
    { id: 1, name: 'Pending', color_class: 'gray', description: 'Task is created but not yet assigned or started' },
    { id: 2, name: 'Assigned', color_class: 'violet', description: 'Task has been assigned but not yet started' },
    { id: 3, name: 'Ongoing', color_class: 'blue', description: 'Assignee is currently working on the issue' },
    { id: 4, name: 'Completed', color_class: 'green', description: 'Task is finished, and the issue is fully resolved' },
    { id: 5, name: 'Unresolved', color_class: 'orange', description: 'Task is completed, but requires further action' },
    { id: 6, name: 'Cancelled', color_class: 'red', description: 'Task was stopped and will not proceed' },
]

export const complaint_report_types: ComplaintReportType[] = [
    { id: 1, name: 'Phone Call' },
    { id: 2, name: 'Walk In' },
    { id: 3, name: 'SMS' },
    { id: 4, name: 'Thru LEYECO V Employee' },
]

export const activities: Activity[] = [
    // KWH METER
    {
        id: faker.string.uuid(),
        category_id: activity_categories[0].id,
        code: '001',
        name: 'New Connection',
        unit_id: units[0].id,
        quantity: 10,
        num_of_personnel: 1,
    },
    {
        id: faker.string.uuid(),
        category_id: activity_categories[0].id,
        code: '002',
        name: 'Reconnection/Disconnection',
        unit_id: units[0].id,
        quantity: 11,
        num_of_personnel: 1,
    },
    // POWER INTERUPTION
    {
        id: faker.string.uuid(),
        category_id: activity_categories[1].id,
        code: '003',
        name: 'Power Outage Restoration (Feeder Line)',
        unit_id: units[0].id,
        quantity: 12,
        num_of_personnel: 1,
    },
    {
        id: faker.string.uuid(),
        category_id: activity_categories[1].id,
        code: '004',
        name: 'Power Outage Restoration (Backbone Line)',
        unit_id: units[0].id,
        quantity: 15,
        num_of_personnel: 1,
    },
    // LINE SERVICES
    {
        id: faker.string.uuid(),
        category_id: activity_categories[2].id,
        code: '005',
        name: 'Withdrawal of Materials for CS Use',
        unit_id: units[0].id,
        quantity: 10,
        num_of_personnel: 2,
    },
    {
        id: faker.string.uuid(),
        category_id: activity_categories[2].id,
        code: '006',
        name: 'Service Pole Installation',
        unit_id: units[1].id,
        quantity: 4,
        num_of_personnel: 3,
    },
    // DLES 
    {
        id: faker.string.uuid(),
        category_id: activity_categories[3].id,
        code: '007',
        name: 'DT Replacement',
        unit_id: units[1].id,
        quantity: 3,
        num_of_personnel: 10,
    },
    {
        id: faker.string.uuid(),
        category_id: activity_categories[3].id,
        code: '008',
        name: 'DT Installation',
        unit_id: units[1].id,
        quantity: 4,
        num_of_personnel: 3,
    },
    // LMDGA
    {
        id: faker.string.uuid(),
        category_id: activity_categories[4].id,
        code: '009',
        name: 'Line/Load Balancing',
        unit_id: units[1].id,
        quantity: 4,
        num_of_personnel: 3,
    },
    {
        id: faker.string.uuid(),
        category_id: activity_categories[4].id,
        code: '010',
        name: 'Transformer Load Management (Data Gathering Only)',
        unit_id: units[1].id,
        quantity: 4,
        num_of_personnel: 3,
    },
    // Billing
    {
        id: faker.string.uuid(),
        category_id: activity_categories[5].id,
        code: '011',
        name: 'NOC-Billing Example ',
        unit_id: units[1].id,
        quantity: 4,
        num_of_personnel: 3,
    },
    // Line Construction
    {
        id: faker.string.uuid(),
        category_id: activity_categories[6].id,
        code: '012',
        name: 'NOC-Line Construction Example ',
        unit_id: units[1].id,
        quantity: 2,
        num_of_personnel: 1,
    },
]