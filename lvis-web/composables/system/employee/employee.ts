import type { Employee } from "./employee.types";



export function addPropertyFullName(employees: Employee[]) {
    return employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })
}