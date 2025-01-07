import axios, { type AxiosResponse } from 'axios';
import type { AuthUser } from '~/composables/common.types';
import Swal from 'sweetalert2'


const getAuthUser = (): AuthUser | null => {
	const authUserJson = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_KEY);
	return authUserJson ? JSON.parse(authUserJson) : null;
};
  
const handleSessionExpiration = (errors: any[]): void => {
	const hasInvalidToken = errors.some((i) => i?.message?.includes('Invalid token'));

	if (hasInvalidToken) {
		Swal.fire({
			title: 'Session Expired',
			text: 'Your session has expired. Please log in again.',
			icon: 'warning',
			position: 'top',
		}).then(() => {
			localStorage.removeItem(LOCAL_STORAGE_AUTH_USER_KEY);
			window.location.href = '/';
		});
	}
};
  
  // Main sendRequest function
  export const sendRequest = async (
	queryOrMutation: string,
	variables?: Record<string, any>
  ): Promise<AxiosResponse> => {
	const config = useRuntimeConfig();
	const GRAPHQL_API_URL = config.public.graphqlApiUrl;
  
	console.log('GRAPHQL_API_URL', GRAPHQL_API_URL);
	console.log('sendRequest()', queryOrMutation);
	// console.log('=== variables ===', JSON.stringify(variables));
  
	const authUser = getAuthUser();
  
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
	} catch (error: any) {
		const errors = error?.response?.data?.errors;
	
		if (Array.isArray(errors)) {
			handleSessionExpiration(errors); 
		}
	
		throw error;
	}
  };

// export const sendRequest = async (
//     queryOrMutation: string, 
//     variables?: Record<string, any>
//   ): Promise<AxiosResponse> => {
// 		const config = useRuntimeConfig();
// 		const GRAPHQL_API_URL = config.public.graphqlApiUrl;

// 		console.log('GRAPHQL_API_URL', GRAPHQL_API_URL);
// 		console.log('sendRequest()', queryOrMutation);
// 		console.log('=== variables ===', JSON.stringify(variables));

// 		// Try to retrieve authUser from localStorage
// 		const authUserJson = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_KEY);
// 		const authUser = authUserJson ? JSON.parse(authUserJson) as AuthUser : null;

// 		// Prepare headers conditionally, adding Authorization only if authUser is found
// 		const headers: Record<string, string> = {
// 			'Content-Type': 'application/json',
// 			...(authUser && { Authorization: `Bearer ${authUser.access_token}s` }),
// 		};

// 		try {
// 			const requestData = {
// 				query: queryOrMutation,
// 				variables,
// 			};

// 			return await axios.post(GRAPHQL_API_URL, requestData, { headers });
// 		} catch (error: any) {

// 			const errors = error.response.data.errors
			
// 			if(Array.isArray(errors)) {
// 				const hasInvalidToken = errors.find(i => i.message.includes("Invalid token"))

// 				if(hasInvalidToken) {
					
// 					Swal.fire({
// 						title: 'Session Expired',
// 						text: 'Your session has expired. Please log in again.',
// 						icon: 'warning',
// 						position: 'top',
// 					}).then(() => {
// 						localStorage.removeItem(LOCAL_STORAGE_AUTH_USER_KEY); 
// 						window.location.href = '/';
// 					});

// 				}
// 			}

// 			throw error;

// 		}
// };

