import { defineStore } from 'pinia';
import type { Task, TaskLog, TaskStatus } from './tasks.types';
import { task_logs, tasks, taskStatuses } from './tasks.mock-data';
import { barangays, complaintDetails, complaints, municipalities, natureOfComplaints, sitios } from '../complaints/complaints.mock-data';
import type { Complaint } from '../complaints/complaints.types';
import { TASK_STATUS } from './task.constants';


export const useTaskStore = defineStore('task', {
    
    state: () => ({
        _complaints: [...complaints] as Complaint[],
        _tasks: [...tasks] as Task[],
        _task_logs: [...task_logs] as TaskLog[],
        _task_statuses: [...taskStatuses] as TaskStatus[],
    }),

    getters: {
        tasks: (state) => {
            return state._tasks.map(task => ({
                ...task,
                complaint: (() => {
                    const complaint = state._complaints.find(i => i._id === task.complaint_id)

                    if(!complaint) return undefined

                    complaint.nature_of_complaint = natureOfComplaints.find(i => i._id === complaint?.nature_of_complaint_id)
                    const detail = complaintDetails.find(i => i.complaint_id === complaint._id)

                    if(detail) {
                        const barangay = barangays.find(b => b._id === detail.barangay_id)
                        detail.barangay = barangay
                        detail.municipality = municipalities.find(m => m._id === barangay?.municipality_id)
                        detail.sitio = sitios.find(s => s._id === detail.sitio_id)
                    } 

                    complaint.detail = detail

                    return complaint

                })(),
                assign_to: {
                    id: '477549cc-167e-493c-b641-892b33c9cb23',
                    name: 'admin',
                },
                task_status: taskStatuses.find(i => i._id === task.task_status_id),
                logs: state._task_logs.filter(i => i.task_id === task._id).map(i => ({...i, task_status: taskStatuses.find(j => j._id === i.task_status_id)})),
            }))
        },
        task_statuses: (state) => {
            return state._task_statuses
        },
        pending_tasks(): Task[] {
            return this.tasks.filter(i => i.task_status_id === TASK_STATUS.PENDING)
        }, 
        not_pending_tasks(): Task[] {
            return this.tasks.filter(i => i.task_status_id !== TASK_STATUS.PENDING)
        },
        not_pending_task_statuses(): TaskStatus[] {
            return this.task_statuses.filter(i => i._id !== TASK_STATUS.PENDING)
        },
        task_logs: (state) => {
            return state._task_logs
        },
    },

    actions: {

        update_task_status(payload: { task: Task, status_id: TASK_STATUS }) {
            console.log('update_task_status', payload);

            const { task, status_id } = payload 

            const task_to_update = this._tasks.find(i => i._id === task._id)

            console.log('task_to_update', task_to_update);

            if(!task_to_update) return 

            task_to_update.task_status_id = status_id

        }

    },

});