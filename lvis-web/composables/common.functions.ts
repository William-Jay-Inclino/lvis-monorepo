
import { findOne } from '~/composables/system/user/user.api'

export async function updateTotalPendingsInLocalStorage(authUser: AuthUser) {
    try {
        const user = await findOne(authUser.user.id);

        if (!user) {
            console.error('User not found', authUser);
            return;
        }

        // Check if user_employee and employee exist before updating
        if (authUser.user.user_employee?.employee && user.user_employee?.employee) {
            authUser.user.user_employee.employee.total_pending_approvals = user.user_employee.employee.total_pending_approvals;
        } else {
            console.warn('Employee data is missing in either authUser or user');
        }

        // Update the local storage with the new authUser
        const newAuthUser = JSON.stringify(authUser);
        localStorage.setItem('authUser', newAuthUser);
    } catch (error) {
        console.error('Error updating total pendings in local storage:', error);
    }
}