
import { findOne } from '~/composables/system/user/user.api'

export async function updateUserInLocalStorage(authUser: AuthUser) {
    console.log('updateUserInLocalStorage', authUser);

    if(!authUser.user.user_employee) return 
    
    try {
        const user = await findOne(authUser.user.id);

        if (!user) {
            console.error('User not found', authUser);
            return;
        }

        // Check if user_employee and employee exist before updating
        if (authUser.user.user_employee?.employee && user.user_employee?.employee) {

            // update total pendings
            authUser.user.user_employee.employee.total_pending_approvals = user.user_employee.employee.total_pending_approvals;

            // update other props
            authUser.user.user_employee.employee.is_budget_officer = user.user_employee.employee.is_budget_officer
            authUser.user.user_employee.employee.is_finance_manager = user.user_employee.employee.is_finance_manager
            authUser.user.permissions = user.permissions

        } else {
            console.warn('Employee data is missing in either authUser or user');
        }

        // Update the local storage with the new authUser
        const newAuthUser = JSON.stringify(authUser);
        localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, newAuthUser);
    } catch (error) {
        console.error('Error updating total pendings in local storage:', error);
    }
}