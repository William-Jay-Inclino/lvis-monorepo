<template>

    <div>

        <!-- Top bar -->
        <div v-if="SERVER !== 'production'" class="topbar bg-dark text-white py-1">
            <div class="container">
                <div>
                    Server: <span :class="SERVER_OBJECT[SERVER].color"> {{ SERVER_OBJECT[SERVER].label }} </span> 
                </div>
            </div>
        </div>

        <div class="login-page">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 offset-lg-2">
                        <div class="bg-white shadow rounded">
                            <div class="row d-flex align-items-stretch"> <!-- Flex container to align both sides -->
                                <!-- Left Form Section -->
                                <div class="col-md-5 pe-0">
                                    <div class="form-left h-100 py-4 px-4">
                                        <form action="" class="row g-4" @submit.prevent="login">
                                            <div class="col-12 text-center">
                                                <img src="/img/leyeco-logo2.png" alt="Logo" class="logo"> <!-- Replace with your logo URL -->
                                            </div>
                                            <div class="col-12 text-center fs-3 fw-bold mt-2">
                                                Welcome back!
                                            </div>
                                            <div class="col-12 text-center fw-bold mt-1">
                                                Please enter your credentials to login
                                            </div> 
                                            <div class="col-12 mt-3">
                                                <label>Username<span class="text-danger">*</span></label>
                                                <div class="input-group">
                                                        <div class="input-group-text">
                                                            <client-only>
                                                                <font-awesome-icon :icon="['fas', 'user']" />
                                                            </client-only>
                                                        </div>
                                                    <input v-model="username" data-testid="username" type="text" class="form-control form-control-sm" autocomplete="current-password">
                                                </div>
                                            </div>
            
                                            <div class="col-12 mt-3">
                                                <label>Password<span class="text-danger">*</span></label>
                                                <div class="input-group">
                                                        <div class="input-group-text">
                                                            <client-only>
                                                                <font-awesome-icon :icon="['fas', 'key']" />
                                                            </client-only>
                                                        </div>
                                                    <input v-model="password" data-testid="password" type="password" class="form-control form-control-sm" autocomplete="current-password">
                                                </div>
                                            </div>
            
                                            <div v-if="error.show" class="col-12 mt-3">
                                                <div class="alert alert-danger mb-3" role="alert">
                                                    {{ error.msg }}
                                                </div>
                                            </div>
            
                                            <div class="col-sm-12 mt-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="inlineFormCheck">
                                                    <label class="form-check-label" for="inlineFormCheck">Remember me</label>
                                                </div>
                                            </div>
            
                                            <div class="col-12 mt-3">
                                                <button :disabled="isLoggingIn" type="submit" data-testid="login" class="btn btn-primary px-4 mt-4 w-100">
                                                    {{ isLoggingIn ? 'Logging in...' : 'Login' }}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
            
                                <!-- Right Form Section (with background image) -->
                                <div class="col-md-7 d-none d-md-block column-right">
                                    <div class="form-right text-start p-5 bg-image m-3 rounded"> <!-- Added m-3 for margin, rounded, and inline border-radius -->
                                        <p class="fs-3 mb-0 fw-bold">
                                            <span class="brand-text" style="letter-spacing: 0.5rem;">PRISM</span>
                                        </p>
                                        <p class="fw-bold">Platform for Resource Integration and System Management</p>
                                        <p>PRISM empowers LEYECO V mission and vision through the following suite of powerful management tools:</p>
            
                                        <!-- First Row -->
                                        <div class="row fs-8">
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'money-bill-wave']" class="me-1"/>
                                                </client-only>
                                                    Purchasing
                                            </div>
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'warehouse']"  class="me-1"/>
                                                </client-only> Warehousing
                                            </div>
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'gear']"  class="me-1"/>
                                                </client-only> System
                                            </div>
                                        </div>
            
                                        <!-- Second Row -->
                                        <div class="row fs-8">
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'car']"  class="me-1"/>
                                                </client-only> Motorpool
                                            </div>
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'book']"  class="me-1"/>
                                                </client-only> Accounting
                                            </div>
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'users']"  class="me-1"/>
                                                </client-only> HR
                                            </div>
                                        </div>
            
                                        <!-- Third Row -->
                                        <div class="row fs-8">
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'bolt']"  class="me-1"/>
                                                </client-only> Powerserve
                                            </div>
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'house']"  class="me-1"/>
                                                </client-only> Housewiring
                                            </div>
                                            <div class="col btn-bg-warning fw-bold d-flex justify-content-center align-items-center m-1">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'coins']"  class="me-1"/>
                                                </client-only> Billing
                                            </div>
                                        </div>
                                    </div>
                                </div> <!-- End of Right Form Section -->
                            </div> <!-- End of row -->
                        </div> <!-- End of shadow rounded -->
                    </div> <!-- End of col-lg-8 -->
                </div> <!-- End of row -->
            </div> <!-- End of container -->
        </div> <!-- End of login-page -->
        
    </div>


</template>



<script setup lang="ts">
    import { ref } from 'vue'
    import axios from 'axios'
    import { AxiosError } from 'axios'
    import { LOCAL_STORAGE_AUTH_USER_KEY } from '~/utils/config';

    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl
    const APP_VERSION = config.public.appVersion
    const SERVER: ServerType = config.public.SERVER as ServerType


    const router = useRouter();
    const username = ref('');
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
                username: username.value,
                password: password.value
            });
            
            console.log('response.data', response.data);

            response.data.user.permissions = JSON.parse(response.data.user.permissions)

            const authUser = JSON.stringify(response.data)

            localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, authUser); 

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


</script>

<style scoped>

a {
  text-decoration: none;
}

.form-right {
height: 100%;
}

.column-right{
padding-bottom: 30px;
}

.login-page {
  width: 100%;
  height: 90vh;
  display: inline-block;
  display: flex;
  align-items: center;
  /* background: rgb(142,207,255);
  background: linear-gradient(141deg, rgba(142,207,255,1) 0%, rgba(255,255,255,1) 100%); */
}

.bg-image{
  background: rgb(142,207,255);
background: linear-gradient(141deg, rgba(142,207,255,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 0px 5px 5px 0px;
}

.logo {
  max-width: 130px; /* Adjust logo size */
  margin-bottom: 20px; /* Space below the logo */
}

.btn-bg-warning{
  background-color: #ecff70;
  border-color: #ecff70;
  height: 30px;
  border-radius: 5px;
}

.fs-8{
  font-size: 14px;
}
</style>
