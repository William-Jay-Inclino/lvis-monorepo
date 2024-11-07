import axios, { type AxiosResponse } from 'axios';
import type { AuthUser } from '~/composables/common.types';


export const sendRequest = async (
    queryOrMutation: string, 
    variables?: Record<string, any>
  ): Promise<AxiosResponse> => {
    const config = useRuntimeConfig();
    const GRAPHQL_API_URL = config.public.graphqlApiUrl;
  
    console.log('GRAPHQL_API_URL', GRAPHQL_API_URL);
    console.log('sendRequest()', queryOrMutation);
    console.log('=== variables ===', JSON.stringify(variables));
  
    // Try to retrieve authUser from localStorage
    const authUserJson = localStorage.getItem('authUser');
    const authUser = authUserJson ? JSON.parse(authUserJson) as AuthUser : null;
  
    // Prepare headers conditionally, adding Authorization only if authUser is found
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(authUser && { Authorization: `Bearer ${authUser.access_token}` }),
    };
  
    try {
      const requestData = {
        query: queryOrMutation,
        variables,
      };
  
      return await axios.post(GRAPHQL_API_URL, requestData, { headers });
    } catch (error) {
      console.error('Error in sendRequest:', error);
      throw error;
    }
};


// export const sendRequest = async (queryOrMutation: string, variables?: Record<string, any>): Promise<AxiosResponse> => {

//     const config = useRuntimeConfig()

//     const GRAPHQL_API_URL = config.public.graphqlApiUrl
//     console.log('GRAPHQL_API_URL', GRAPHQL_API_URL)

//     console.log('sendRequest()', queryOrMutation);
//     console.log('=== variables ===', JSON.stringify(variables))

//     const authUserJson = localStorage.getItem('authUser')

//     if(!authUserJson) {
//         throw console.error('authUser in localstorage not found');
//     }

//     const authUser = JSON.parse(authUserJson) as AuthUser
    
//     try {
//         const requestData = {
//             query: queryOrMutation,
//             variables,
//         };

//         return await axios.post(
//             GRAPHQL_API_URL,
//             requestData,
//             { 
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${authUser.access_token}`
//                 } 
//             }
//         );
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };
