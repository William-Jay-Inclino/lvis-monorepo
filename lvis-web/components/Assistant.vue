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
                        <img :src="store.avatar.src" alt="Avatar" class="modal-image" />
                        <h5>Hi, I'm Jay! Send me a message</h5>
                    </div>
                    <button class="close-button" @click="store.toggleModal">×</button>
                </div>
                <div class="modal-body">

                    <form @submit.prevent="sendMsg()">
                        <div class="form-group">
                            <label for="messageType">Purpose</label>
                            <select @change="store.onChangePurpose" v-model="store.messageType">
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
                            id="message"
                            rows="4"
                            required
                            ></textarea>
                            <small class="text-warning fw-bold"> Heyyy! Okay rajud bisaya/cebuano 🤙 </small>
                        </div>
                        <button type="submit" class="submit-button">
                            {{ store.isSending ? 'Sending please wait...' : 'Send' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

    import { useAssistantStore } from '#imports';

    const store = useAssistantStore()

    async function sendMsg() {

        await store.submitMessage()

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
  </style>