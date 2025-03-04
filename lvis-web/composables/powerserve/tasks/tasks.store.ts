import { defineStore } from 'pinia';
import type { Task, TaskLog, TaskStatus } from './tasks.types';
import { task_logs, tasks, taskStatuses } from './tasks.mock-data';

export const useTaskStore = defineStore('task', {

    state: () => ({
        _tasks: [...tasks] as Task[],
        _task_logs: [...task_logs] as TaskLog[],
        _task_statuses: [...taskStatuses] as TaskStatus[],
    }),

    getters: {
        tasks: (state) => {
            return state._tasks.map(task => ({
                ...task,
                assign_to: {
                    id: '477549cc-167e-493c-b641-892b33c9cb23',
                    name: 'admin',
                },
                task_status: taskStatuses.find(i => i._id === task.task_status_id),
                logs: state._task_logs.filter(i => i.task_id === task._id).map(i => ({...i, task_status: taskStatuses.find(j => j._id === i.task_status_id)})),
            }))
        },
        task_logs: (state) => {
            return state._task_logs
        },
        task_statuses: (state) => {
            return state._task_statuses
        },
    },

    actions: {


    },

});