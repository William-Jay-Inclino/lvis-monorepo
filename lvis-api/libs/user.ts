import axios from "axios";

interface User {
    id: string 
    username: string
}

export async function get_user(payload: { employee_id?: string, api_url: string }): Promise<User> {

    const { employee_id, api_url } = payload

    if(employee_id) {

        try {
            const { data } = await axios.get(
                `${api_url}/user/get-user-by-employee-id/${encodeURIComponent(employee_id)}`,
                { timeout: 3000 }
            );
            return data?.username ? data : null;
        } catch (error) {
            return null;
        }

    }


}


export async function get_usernames(payload: { division_id?: string, department_id?: string, api_url: string }): Promise<string[]> {

    const { division_id, department_id, api_url } = payload;

    if (!division_id && !department_id) return [];

    try {
        const endpoint = division_id 
            ? `get-usernames-by-division-id/${encodeURIComponent(division_id)}`
            : `get-usernames-by-department-id/${encodeURIComponent(department_id!)}`;

        const { data } = await axios.get<string[]>(
            `${api_url}/user/${endpoint}`,
            { timeout: 3000 }
        );

        return Array.isArray(data) 
            ? data.filter(username => typeof username === 'string' && username)
            : [];
    } catch (error) {
        return [];
    }


}