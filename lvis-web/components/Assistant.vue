<template>
    <div class="floating-button-container">
        <!-- Floating Button with Image -->
        <button class="floating-button" @click="store.toggleModal">
            <img src="/assistant-avatar.webp" alt="Chat Icon" class="button-image" />
        </button>
    
        <!-- Modal for Message Input -->
        <div v-if="store.isModalOpen" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="header-content">
                        <img v-show="!isSending" :src="store.avatar.src" alt="Avatar" class="modal-image" />
                        <img v-show="isSending" src="/sending.gif" alt="Avatar" class="modal-image" />
                        <h5 v-show="!isSending">Hi, I'm Jay! Send me a message</h5>
                        <h5 v-show="isSending">Sending...</h5>
                    </div>
                    <button class="close-button" @click="store.toggleModal">×</button>
                </div>
                <div class="modal-body">

                    <form @submit.prevent="sendMsg()">
                        <div class="form-group">
                            <label for="messageType">Purpose</label>
                            <select @change="store.onChangePurpose" v-model="store.messageType" :disabled="isSending">
                                <option value="feature">Request a Feature</option>
                                <option value="bug">Report a Bug</option>
                                <option value="chat">Send anything</option>
                            </select>
                            <small class="fst-italic text-muted"> {{ store.messageHelper }} </small>
                        </div>
                        <small class="fst-italic text-muted"></small>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea
                                v-model="store.message"
                                rows="4"
                                required
                                :disabled="isSending"
                            ></textarea>
                            <small class="text-warning fw-bold"> Heyyy! Okay rajud bisaya/cebuano 🤙 </small>
                        </div>
                        <button type="submit" :disabled="isSending" class="submit-button" :class="{'disabled': isSending}">
                            {{ isSending ? 'Sending... Please wait!' : 'Send' }}
                        </button>
                    </form>
                </div>
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
            store.toggleModal();
        }
    }


</script>
  
<style scoped>
    /* Floating Button Styles */
    .floating-button-container {
    position: fixed;
    bottom: 20px;
    left: -14px;
    z-index: 1000;
    }

    .floating-button {
    background-color: #007bff;
    border: none;
    border-radius: 50%;
    width: 110px;
    height: 110px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    }

    .floating-button:hover {
    background-color: white;
    }

    .button-image {
    width: 80px; /* Adjust the size of the image */
    height: 80px; /* Adjust the size of the image */
    object-fit: contain; /* Ensures the image fits well */
    }

    /* Modal Styles */
    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    }

    .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    position: relative; /* Required for absolute positioning of the close button */
    }

    .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start; /* Align items to the top */
    margin-bottom: 16px;
    }

    .header-content {
    display: flex;
    align-items: center;
    gap: 10px; /* Space between image and text */
    }

    .modal-image {
    width: 200px; /* Adjust the size of the image */
    height: 200px; /* Adjust the size of the image */
    border-radius: 50%; /* Makes the image circular */
    object-fit: cover; /* Ensures the image fits well */
    }

    .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    position: absolute; /* Position the close button absolutely */
    top: 10px; /* Adjust distance from the top */
    right: 10px; /* Adjust distance from the right */
    }

    .close-button:hover {
    color: #000;
    }

    .modal-body {
    margin-bottom: 16px;
    }

    .form-group {
    margin-bottom: 16px;
    }

    .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    }

    .form-group select,
    .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    }

    .submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    }

    .submit-button:hover {
    background-color: #0056b3;
    }

    .submit-button.disabled {
        background-color: #ccc; /* Change color or apply other styles */
        cursor: not-allowed; /* Makes the button unclickable */
    }

</style>