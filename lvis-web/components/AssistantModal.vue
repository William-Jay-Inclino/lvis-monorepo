<template>
    <div class="modal fade" id="assistantModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="sendMsg()">
                    <div class="modal-body">
                        <div class="header-content">
                            <img v-show="!isSending" :src="store.avatar.src" alt="Avatar" class="modal-image" />
                            <img v-show="isSending" src="/sending.gif" alt="Sending image" class="modal-image-circle" />
                            <h4 v-show="!isSending">
                                <span>Hi, I'm Jay! 🤙</span><br>
                                <span>Send me a message</span>
                            </h4>
                            <button ref="close_modal_btn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="mb-3 mt-5">
                            <label for="messageType" class="text-danger fw-bold">Enter your purpose here 👇</label>
                            <select class="form-select" @change="store.onChangePurpose" v-model="store.messageType" :disabled="isSending">
                                <option value="problem">Report a Problem</option>
                                <option value="feature">Request a Feature</option>
                                <option value="chat">Send anything</option>
                            </select>
                            <!-- <small class="fst-italic text-muted"> {{ store.messageHelper }} </small> -->
                        </div>
                        <small class="fst-italic text-muted"></small>
                        <div class="mb-3">
                            <label for="message">Message</label>
                            <textarea
                                class="form-control"
                                v-model="store.message"
                                rows="4"
                                required
                                :disabled="isSending"
                            ></textarea>
                            <small class="text-muted fst-italic"> You can message in English or Bisaya—up to you!</small>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="submit" 
                            :disabled="isSending" 
                            class="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2 position-relative"
                            :class="{'disabled': isSending}">
                            
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'paper-plane']" class="send-icon" />
                            </client-only>
                            
                            <span>{{ isSending ? 'Sending... Please wait!' : 'Send' }}</span>
                        </button>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

    import { useAssistantStore } from '#imports';
    import axios from 'axios';
    import { useToast } from "vue-toastification";

    const store = useAssistantStore()
    const authUser = ref<AuthUser>({} as AuthUser)
    const config = useRuntimeConfig()
    const SYSTEM_API_URL = config.public.systemApiUrl
    const DEFAULT_EMAIL = config.public.defaultEmail
    const isSending = ref(false)
    const toast = useToast();
    const close_modal_btn = ref<HTMLButtonElement>()


    onMounted(async () => {
        authUser.value = getAuthUser()
    })

    async function sendMsg() {
        isSending.value = true;

        try {
            const accessToken = authUser.value.access_token;

            console.log('Access Token:', accessToken);

            const response = await axios.post(
                SYSTEM_API_URL + '/messaging/email',
                {
                    to: DEFAULT_EMAIL,
                    subject: `${authUser.value.user.username} | ${store.messageType}`,
                    body: store.message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, 
                    },
                }
            );

            if(response.data && response.data.success) {
                toast.success(`Message sent!`)
                store.message = ''
            } else {
                toast.error(`Uh-oh, Something went wrong. Please try again!`)
        }

        } catch (error: any) {
            console.error('Error sending message:', error.response?.data || error.message);
            toast.error(`Uh-oh, Something went wrong. Please try again!`)
        } finally {
            isSending.value = false;
            close_modal_btn.value?.click()
        }
    }


</script>
  

<style scoped>

    .modal-content {
        position: relative;
    }

    .header-content {
        display: flex;
        justify-content: center;  /* Horizontally centers the content */
        align-items: center;      /* Vertically aligns the content */
        position: relative;
    }

    .modal-image {
        width: 200px; 
        height: 200px; 
        /* border-radius: 50%;  */
        object-fit: cover;
    }

    .modal-image-circle {
        width: 200px; 
        height: 200px; 
        border-radius: 50%; 
        object-fit: cover;
    }

    /* Close button at the top right */
    .btn-close {
        position: absolute;
        top: 10px;
        right: 10px;
    }


    .send-icon {
        transition: transform 0.3s ease-in-out;
    }

    button:hover .send-icon {
        transform: translateX(4px);
    }

    button:disabled .send-icon {
        opacity: 0.5;
    }

    h4 {
        font-size: 1.25rem; /* Adjust this size as needed */
        margin-left: 15px; /* Add margin to the left of the text */
    }

    /* Styles for smaller screens (mobile devices) */
    @media (max-width: 768px) {
        h4 {
            font-size: 1rem;  /* Smaller font size for mobile */
        }
    }

</style>