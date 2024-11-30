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
    const authUserJson = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_KEY);
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

