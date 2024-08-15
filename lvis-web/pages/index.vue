<template>
  <div class="bg-container position-relative d-flex align-items-center">
    <div class="bg-overlay position-absolute top-0 start-0 end-0 bottom-0"></div>
    <div class="container">
      <div class="row justify-content-start">
        <div class="col-md-5 col">
          <div class="card border-0 border-3 border-dark shadow p-4">
            <div class="card-body">
              <h3 class="card-title text-center">
                <img src="~/assets/img/leyeco-logo2.png" alt="Logo" class="logo mb-4">
              </h3>
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Username</label>
                  <input v-model="email" type="text" class="form-control">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input v-model="password" type="password" class="form-control">
                </div>
                <div style="margin-top: 10px;" v-if="error.show" class="alert alert-danger mb-3" role="alert">
                    {{ error.msg }}
                </div>
                <div class="d-grid">
                  <button :disabled="isLoggingIn" type="submit" class="btn btn-primary btn-block">
                    {{ isLoggingIn ? 'Logging in...' : 'Login' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
    import { ref } from 'vue'
    import axios from 'axios'
    import { AxiosError } from 'axios'

    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl

    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref({
        show: false,
        msg: ''
    })

    const isLoggingIn = ref(false)

    async function login() {
        console.log('login()');

        isLoggingIn.value = true
        
        try {
            const response = await axios.post(API_URL + '/auth/login', {
                username: email.value,
                password: password.value
            });
            
            console.log('response.data', response.data);

            response.data.user.permissions = JSON.parse(response.data.user.permissions)

            const authUser = JSON.stringify(response.data)

            localStorage.setItem('authUser', authUser);

            router.push('/home');

        } catch (err) {
            if (err && axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;
                console.log('Error:', axiosError.response);

                if (axiosError.response && (axiosError.response.status === 401 || axiosError.response.status === 404)) {
                    error.value.show = true;
                    error.value.msg = "Invalid username or password. Please try again."
                } else {
                    error.value.show = true;
                    error.value.msg = "An error occurred. Please try again later.";
                }
            } else {
                console.log('Error:', err);
            }
        }

        isLoggingIn.value = false

    }

    const addFocusClass = (event: any) => {
        event.target.parentElement.classList.add('focused');
    };

    const removeFocusClass = (event: any) => {
        if (event.target.value === '') {
            event.target.parentElement.classList.remove('focused');
        }
    };


</script>

<style scoped>
.bg-container {
  background-image: url('~/assets/img/loginbg9.png');
  background-size: cover;
  background-position: center;
  height: 100vh;
}

.bg-overlay {
  background-color: rgba(0, 0, 0, 0.2); /* Adjust the opacity as needed */
}

.card {
  border-radius: 1rem;
}

.card-title {
  font-weight: bold;
}

/* .btn-warning {
  background-color: #ffeb3b;
  border: none;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.btn-warning:hover {
  background-color: #fdd835;
} */

.logo {
  max-width: 250px; /* Adjust the logo size as needed */
  height: auto;
}
</style>
