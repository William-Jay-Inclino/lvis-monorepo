import type { Item } from "../item/item.type"
import type { Project } from "./project.types"

export interface ProjectItem {
    id: string  
    project_id: string 
    item_id: string 


    // derived / resolvers 
    project: Project,
    item: Item
}