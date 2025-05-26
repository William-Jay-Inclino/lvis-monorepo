import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

export function useLogout() {
    
    const router = useRouter(); 
    
    const handleLogOut = async (payload: { authUser?: AuthUser, apiUrl: string }) => {
        console.log('handleLogOut', payload);
        const { authUser, apiUrl } = payload;

        if (!authUser) {
            console.error('authUser is not defined in local storage');
            return;
        }

        Swal.fire({
            title: 'Logging out...',
            text: 'Please wait while we log you out.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                Swal.hideLoading();
            }
        });

        try {
            await logout({ ...authUser }, apiUrl);
            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: 'An error occurred while logging you out. Please contact the system administrator.'
            });
        } finally {
            Swal.close();
        }
    };

    return {
        handleLogOut
    };
}
