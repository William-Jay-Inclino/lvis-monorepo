
export function showORnumber(request_type_id: number): boolean { 
    const x = [
        WAREHOUSE_REQUEST_TYPE.TURN_ON_ORDER,
        WAREHOUSE_REQUEST_TYPE.CONSTRUCTION_WORK_ORDER,
        WAREHOUSE_REQUEST_TYPE.EMERGENCY_WITHDRAW,
        WAREHOUSE_REQUEST_TYPE.SERVICE_REQUEST_ORDER,
        WAREHOUSE_REQUEST_TYPE.HW_KIT_FABRICATED,
    ]

    return x.includes(request_type_id)
}

export function showMWOnumber(request_type_id: number): boolean { 
    const x = [
        WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER,
        WAREHOUSE_REQUEST_TYPE.STOCK_TRANSFER,
    ]

    return x.includes(request_type_id)
}

export function showCWOnumber(request_type_id: number): boolean { 
    const x = [
        WAREHOUSE_REQUEST_TYPE.CONSTRUCTION_WORK_ORDER,
    ]

    return x.includes(request_type_id)
}