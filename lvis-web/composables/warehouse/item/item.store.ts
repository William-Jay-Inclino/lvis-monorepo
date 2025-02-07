import { defineStore } from 'pinia';
import type { Item, ItemType } from './item.type';
import type { Project } from '../project/project.types';

export const useItemStore = defineStore('item', {

    state: () => ({
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            itemOptions: [] as Item[],
            itemTypes: [] as ItemType[],
            projects: [] as Project[],
            searchItem: null as Item | null,
            searchDesc: '',
            searchItemType: null as ItemType | null,
            searchProject: null as Project | null,
        },
        items: [] as Item[]
    }),

    getters: {

        visiblePages: (state) => {
            const maxVisible = PAGINATION_MAX_VISIBLE_PAGES; 
            const currentPage = state.pagination.currentPage;
            const totalPages = state.pagination.totalPages;

            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages, start + maxVisible - 1);

            // Adjust start if we're near the end
            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            const pages: number[] = [];
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
        itemOptions: (state) => {
            return state.search_filters.itemOptions
        },
        itemTypes: (state) => {
            return state.search_filters.itemTypes
        },
        projects: (state) => {
            return state.search_filters.projects
        },

    },

    actions: {

        set_searched_results(payload: { items: Item[] }) {
            this.items = payload.items
        },

        set_pagination(payload: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
        }) {
            this.pagination = {...payload, pageSize: PAGINATION_SIZE}
        },

        set_search_filters(payload: {
            itemOptions?: Item[],
            itemTypes?: ItemType[],
            projects?: Project[],
        }) {

            const { itemOptions, itemTypes, projects } = payload

            if(itemOptions){
                this.search_filters.itemOptions = itemOptions 
            }

            if(itemTypes){
                this.search_filters.itemTypes = itemTypes 
            }

            if(projects){
                this.search_filters.projects = projects 
            }

        }

    },

});