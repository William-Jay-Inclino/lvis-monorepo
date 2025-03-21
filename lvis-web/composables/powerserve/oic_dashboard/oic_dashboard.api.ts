import type { Activity } from "../common";
import type { Task, TaskStatus } from "../task/task.types";

// export async function init_data(payload: {
//     oic_id: string,
//     page: number, 
//     pageSize: number, 
// }): Promise<{ 
//     pending_and_escalated_tasks: Task[],
//     task_statuses: TaskStatus[],
//     activities: Activity[],
// }> {

//     const { oic_id, page, pageSize } = payload
//     const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

//     const query = `
//         query {
//             pending_tasks_by_group {
//                 id
//                 ref_number
//                 status {
//                     id 
//                     name
//                     color_class
//                 }
//                 description
//                 created_at
//             }
//             tasks(
//                 page: ${page},
//                 pageSize: ${pageSize},
//                 assignee_id: ${assignee_id2},
//             ) {
//                 data {
//                     id
//                     ref_number
//                     status {
//                         id 
//                         name
//                         color_class
//                     }
//                     activity {
//                         id 
//                         name
//                     }
//                     description
//                     created_at
//                 }
//                 totalItems
//                 currentPage
//                 totalPages
//             }
//             task_statuses {
//                 id 
//                 name
//                 color_class
//                 description
//                 total_count_by_assignee
//             }
//             activities {
//                 id 
//                 name 
//                 category {
//                     id 
//                     name
//                 }
//             }
//             linemen {
//                 id 
//                 employee {
//                     id
//                     firstname
//                     middlename
//                     lastname
//                 }
//             }
//             feeders {
//                 id 
//                 name
//             }
//             weather_conditions {
//                 id 
//                 name
//             }
//             devices {
//                 id 
//                 name
//             }
//         }
//     `;

//     try {
//         const response = await sendRequest(query);
//         console.log('response', response)
//         return {
//             pending_tasks: response.data.data.pending_tasks_by_group,
//             tasks_by_assignee_response: response.data.data.tasks,
//             task_statuses: response.data.data.task_statuses,
//             activities: response.data.data.activities,
//             linemen: response.data.data.linemen,
//             feeders: response.data.data.feeders,
//             weather_conditions: response.data.data.weather_conditions,
//             devices: response.data.data.devices,
//         }
//     } catch (error) {
//         console.error(error);
//         throw error
//     }
// }