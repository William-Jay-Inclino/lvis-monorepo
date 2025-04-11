import type { SystemAudit, WarehouseAudit } from "./activity-log";



export async function get_activity_logs(payload: { username: string }): Promise<{
    system_logs: SystemAudit[],
    warehouse_logs: WarehouseAudit[],
}> {

    const { username } = payload

    const query = `
        query {
            system_audit_logs(username: "${ username }") {
                username
                action
                reference_id
                ip_address
                device_info
                created_at
                notes
            }
            warehouse_audit_logs(username: "${ username }") {
                username
                action
                reference_id
                ip_address
                device_info
                metadata
                created_at
                notes
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            system_logs: response.data.data.system_audit_logs,
            warehouse_logs: response.data.data.warehouse_audit_logs,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}