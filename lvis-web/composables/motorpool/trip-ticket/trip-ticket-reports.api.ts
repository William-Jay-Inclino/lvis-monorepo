

export async function fetchFilterData(): Promise<{
    vehicles: Vehicle[],
}> {

    const query = `
        query {
            vehicles(page: 1, pageSize: 10) {
                data {
                    id
                    vehicle_number
                    plate_number
                    name
                    classification_id
                    date_acquired
                    status
                    assignee {
                        id 
                        firstname 
                        middlename 
                        lastname
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let vehicles = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.vehicles && data.vehicles.data) {
            vehicles = response.data.data.vehicles.data
        }
        return {
            vehicles,
        }

    } catch (error) {
        console.error(error);
        return {
            vehicles: [],
        }
    }

}