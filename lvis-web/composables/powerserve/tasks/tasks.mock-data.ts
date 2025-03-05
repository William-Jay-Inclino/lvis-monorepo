
import type { Task, TaskLog, TaskStatus } from './tasks.types'

export const taskStatuses: TaskStatus[] = [
    { _id: 1, name: "Pending", color_class: "gray", total: 8 },
    { _id: 2, name: "Assigned", color_class: "violet", total: 2 },
    { _id: 3, name: "Ongoing", color_class: "blue", total: 0 },
    { _id: 4, name: "Completed", color_class: "green", total: 1 },
    { _id: 5, name: "Unresolved", color_class: "orange", total: 0 },
    { _id: 6, name: "Cancelled", color_class: "red", total: 0 },
];


export const tasks: Task[] = [
    {
        _id: 1,
        ref_number: "25-00001",
        complaint_id: 1,
        assigned_to_id: null,
        task_status_id: 1,
        remarks: '',
        accomplishment: '',
        action_taken: '',
        units_earned: 1,
        created_at: '03-03-2025'
    },
    {
        _id: 2,
        ref_number: "25-00002",
        complaint_id: 2,
        assigned_to_id: "477549cc-167e-493c-b641-892b33c9cb23",
        task_status_id: 2,
        remarks: '',
        accomplishment: '',
        action_taken: '',
        units_earned: 1,
        created_at: '03-03-2025'
    },
    {
        _id: 3,
        ref_number: "25-00003",
        complaint_id: 3,
        assigned_to_id: "477549cc-167e-493c-b641-892b33c9cb23",
        task_status_id: 4,
        remarks: 'test remarks',
        accomplishment: 'test accompishment',
        action_taken: 'test action taken',
        units_earned: 1,
        created_at: '03-03-2025'
    },
    {
        _id: 4,
        ref_number: "25-00004",
        complaint_id: 4,
        assigned_to_id: null,
        task_status_id: 1,
        remarks: '',
        accomplishment: '',
        action_taken: '',
        units_earned: 1,
        created_at: '03-03-2025'
    },
    {
        _id: 5,
        ref_number: "25-00005",
        complaint_id: 5,
        assigned_to_id: "477549cc-167e-493c-b641-892b33c9cb23",
        task_status_id: 2,
        remarks: '',
        accomplishment: '',
        action_taken: '',
        units_earned: 1,
        created_at: '03-03-2025'
    }
]


export const task_logs: TaskLog[] = [
    {
        _id: 1,
        task_id: 1,
        task_status_id: 1,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 2,
        task_id: 2,
        task_status_id: 1,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 3,
        task_id: 2,
        task_status_id: 2,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 4,
        task_id: 2,
        task_status_id: 3,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 5,
        task_id: 3,
        task_status_id: 1,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 6,
        task_id: 3,
        task_status_id: 2,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 7,
        task_id: 3,
        task_status_id: 3,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 8,
        task_id: 3,
        task_status_id: 4,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 9,
        task_id: 4,
        task_status_id: 1,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 10,
        task_id: 5,
        task_status_id: 1,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 11,
        task_id: 5,
        task_status_id: 2,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    },
    {
        _id: 12,
        task_id: 5,
        task_status_id: 3,
        remarks: 'test remarks',
        updated_by: 'admin',
        updated_at: '03-03-2025'
    }
]