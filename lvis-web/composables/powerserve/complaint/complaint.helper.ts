import type { ComplaintAssignment } from "./complaint.types";



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