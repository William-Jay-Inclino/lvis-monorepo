
export enum DB_ENTITY {
    COMPLAINT = 'complaint',
    TASK = 'task',
}

export interface ModuleMapping {
    model: string;
    rcNumber: string;
    id: string;
}


export const MODULE_MAPPER: Record<DB_ENTITY, ModuleMapping> = {
    [DB_ENTITY.COMPLAINT]: {
        model: 'complaint',
        rcNumber: 'ref_number',
        id: 'complaint_id',
    },
    [DB_ENTITY.TASK]: {
        model: 'task',
        rcNumber: 'ref_number',
        id: 'task_id',
    },
}