
export const enum VEHICLE_STATUS {
    AVAILABLE_FOR_TRIP = 1,
    IN_USE = 2,
    UNDER_REPAIR = 3,
    UNDER_MAINTENANCE = 4,
    OUT_OF_SERVICE = 5,
    DECOMMISSIONED = 6,
}

export const VehicleStatusMapper = {
    [VEHICLE_STATUS.AVAILABLE_FOR_TRIP]: {
        label: 'Available for Trip',
        color: 'success' 
    },
    [VEHICLE_STATUS.IN_USE]: {
        label: 'In Use',
        color: 'primary'
    },
    [VEHICLE_STATUS.UNDER_REPAIR]: {
        label: 'Under Repair',
        color: 'warning'
    },
    [VEHICLE_STATUS.UNDER_MAINTENANCE]: {
        label: 'Under Maintenance',
        color: 'info'
    },
    [VEHICLE_STATUS.OUT_OF_SERVICE]: {
        label: 'Out of Service',
        color: 'danger'
    },
    [VEHICLE_STATUS.DECOMMISSIONED]: {
        label: 'Decommissioned',
        color: 'secondary'
    },
}


export const enum VEHICLE_CLASSIFICATION {
    COMPANY = 1,
    GOVERNMENT = 2,
    OUTSOURCE = 3,
    PRIVATE = 4,
    V_HIRE = 5,
}

export const VehicleClassificationMapper = {
    [VEHICLE_CLASSIFICATION.COMPANY]: 'Company',
    [VEHICLE_CLASSIFICATION.GOVERNMENT]: 'Government',
    [VEHICLE_CLASSIFICATION.OUTSOURCE]: 'Outsource',
    [VEHICLE_CLASSIFICATION.PRIVATE]: 'Private',
    [VEHICLE_CLASSIFICATION.V_HIRE]: 'V-Hire',
}


