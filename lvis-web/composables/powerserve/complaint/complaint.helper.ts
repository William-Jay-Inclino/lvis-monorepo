import type { Department } from "~/composables/hr/department/department";
import type { Division } from "~/composables/hr/division/division";
import type { Area } from "../area/area.types";
import { ASSIGNED_GROUP_TYPE } from "./complaint.constants";
import type { AssignedGroup, Complaint, ComplaintAssignment } from "./complaint.types";



export function generateRandomId() {
    return Date.now() + Math.floor(Math.random() * 1000); // Ensures uniqueness
};


export function getAssignmentLabel(assignment?: ComplaintAssignment) {

    if(!assignment) return 'N/A'
    if (assignment.area) return assignment.area?.name
    if (assignment.department) return assignment.department?.name
    if (assignment.division) return assignment.division?.name

}


export function combineAddress(payload: { municipality?: string; barangay?: string; sitio?: string }) {
    const { barangay, municipality, sitio } = payload;
    
    // Filter out falsy values (null, undefined, empty string) and join with ", "
    return [barangay, municipality, sitio].filter(Boolean).join(", ");
}

export function get_assigned_group(payload: { 
    complaint: Complaint, 
    areas?: Area[], 
    departments?: Department[], 
    divisions?: Division[] 
}): AssignedGroup | null {

    const { complaint, areas, departments, divisions } = payload

    if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.AREA && areas) {

        const area = areas.find(i => i.id === complaint.assigned_group_id)

        if(!area) {
            console.error('Area not found with id ', complaint.assigned_group_id);
            return null
        }

        return {
            id: complaint.assigned_group_id,
            name: area.name,
            type: complaint.assigned_group_type,
        }

    } else if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.DIVISION && divisions) {
        const division = divisions.find(i => i.id === complaint.assigned_group_id)

        if(!division) {
            console.error('Division not found with id ', complaint.assigned_group_id);
            return null
        }

        return {
            id: complaint.assigned_group_id,
            name: division.name,
            type: complaint.assigned_group_type,
        }

    } else if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.DEPARTMENT && departments) {
        const department = departments.find(i => i.id === complaint.assigned_group_id)

        if(!department) {
            console.error('Department not found with id ', complaint.assigned_group_id);
            return null
        }

        return {
            id: complaint.assigned_group_id,
            name: department.name,
            type: complaint.assigned_group_type,
        }
    }

    return null

}