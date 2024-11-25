<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-body">
                <h2 class="card-title text-center text-warning">Update Password</h2>

                <hr>

                <form @submit.prevent="handlePasswordUpdate" class="mt-4">
                    <!-- Current Password -->
                    <div class="mb-3">
                        <label for="currentPassword" class="form-label">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            v-model="currentPassword"
                            class="form-control"
                            required
                        />
                    </div>

                    <!-- New Password -->
                    <div class="mb-3">
                        <label for="newPassword" class="form-label">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            v-model="newPassword"
                            class="form-control"
                            required
                        />
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            v-model="confirmPassword"
                            class="form-control"
                            required
                        />
                    </div>

                    <!-- Buttons -->
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-secondary w-100" @click="handleCancel">Cancel</button>
                        <button type="submit" class="btn btn-primary w-100" :disabled="isUpdatingPassword"> {{ isUpdatingPassword ? 'Updating...' : 'Update' }} </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import Swal from 'sweetalert2'
    import { changeOwnPassword } from '~/composables/system/user/user.api'

    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const isUpdatingPassword = ref(false)

    const router = useRouter();

    async function handlePasswordUpdate() {
        if (newPassword.value !== confirmPassword.value) {
            Swal.fire({
                title: 'Error!',
                text: 'New Password and Confirm Password did not match',
                icon: 'error',
                position: 'top',
            })
            return 
        }

        isUpdatingPassword.value = true
        const response = await changeOwnPassword(currentPassword.value, newPassword.value)
        isUpdatingPassword.value = false

        if (response.success) {

            Swal.fire({
                title: 'Success!',
                text: 'Password updated successfully',
                icon: 'success',
                position: 'top',
            })

            router.back()

        } else {

            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })

        }

    };

    // Function to handle cancel action
    const handleCancel = () => {

        router.back()

    };

</script>

<style scoped>
.container {
    max-width: 500px;
    margin: auto;
}

.card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-title {
    margin-bottom: 20px;
}

.d-flex {
    display: flex;
    justify-content: space-between;
}
</style>
