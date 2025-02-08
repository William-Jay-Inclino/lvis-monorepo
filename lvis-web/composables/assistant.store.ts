import { defineStore } from 'pinia';

export const useAssistantStore = defineStore('assistant', {

    state: () => ({
        messageType: 'feature' as 'feature' | 'feature' | 'bug' | 'chat',
        messageHelper: `This message will be sent to the developer's email`,
        message: '',
        avatar: { type: 'feature', src: '/avatar-nice.webp' },
        avatars: [
            { type: 'chat', src: '/avatar-heart.webp' },
            { type: 'feature', src: '/avatar-nice.webp' },
            { type: 'bug', src: '/avatar-disappointed.webp' },
        ]
    }),

    actions: {

        onChangePurpose() {
            console.log('onChangePurpose');

            if(this.messageType === 'feature') {
                this.messageHelper = `This message will be sent to the developer's email`
                this.avatar = this.avatars[1]
                return
            }

            if(this.messageType === 'bug') {
                this.messageHelper = `This message will be sent to the developer's email`
                this.avatar = this.avatars[2]
                return
            }
    
            if(this.messageType === 'chat') {
                this.messageHelper = `This message will be sent to the developer's private chat`
                this.avatar = this.avatars[0]
                return
            }

        }

    },

});