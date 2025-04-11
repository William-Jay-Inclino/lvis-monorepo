

export interface ActivityLog {
    id: string 
    username: string 
    action: string 
    reference_id: string 
    metadata: string 
    ip_address: string
    device_info: string 
    created_at: string
}


export interface WarehouseAudit {
    id: string 
    username: string 
    table: string
    action: string 
    reference_id: string 
    metadata: string 
    ip_address: string
    device_info: string 
    notes: string 
    created_at: string
}


export interface SystemAudit {
    id: string 
    username: string 
    table: string
    action: string 
    reference_id: string 
    metadata: string 
    ip_address: string
    device_info: string 
    notes: string 
    created_at: string
}