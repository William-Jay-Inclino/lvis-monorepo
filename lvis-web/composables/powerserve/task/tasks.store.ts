import { defineStore } from 'pinia';
import type { Task, TaskStatus } from './tasks.types';
import { TASK_STATUS } from './task.constants';


export const useTaskStore = defineStore('task', {
    
    state: () => ({
        _tasks_by_assignee: [] as Task[],
        _task_statuses: [] as TaskStatus[],
        _pending_tasks: [] as Task[],
    }),

    getters: {
        tasks_by_assignee: (state) => {
            return state._tasks_by_assignee
        },
        task_statuses: (state) => {
            return state._task_statuses
        },
        pending_tasks(): Task[] {
            return this._pending_tasks
        }, 
        not_pending_task_statuses(): TaskStatus[] {
            return this.task_statuses.filter(i => i.id !== TASK_STATUS.PENDING)
        },
    },

    actions: {

        set_tasks_by_assignee(payload: { tasks_by_assignee: Task[] }) {
            this._tasks_by_assignee = payload.tasks_by_assignee
        },
        set_task_statuses(payload: { task_statuses: TaskStatus[] }) {
            this._task_statuses = payload.task_statuses
        },
        set_pending_tasks(payload: { pending_tasks: Task[] }) {
            this._pending_tasks = payload.pending_tasks
        },
        add_tasks_by_assignee(payload: { task: Task }) {
            this._tasks_by_assignee.unshift(payload.task)
        },
        remove_pending_task(payload: { task_id: number }) {
            const { task_id } = payload
            const pending_task_indx = this._pending_tasks.findIndex(i => i.id === task_id)

            if(pending_task_indx === -1) {
                console.error('pending_task not found with id ', task_id);
                return 
            }

            this._pending_tasks.splice(pending_task_indx, 1)

        }
    },

});