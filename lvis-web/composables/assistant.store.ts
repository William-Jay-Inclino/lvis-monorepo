import { defineStore } from 'pinia';

export const useAssistantStore = defineStore('assistant', {

    state: () => ({
        messageType: 'chat' as 'chat' | 'feature' | 'problem' | 'chat',
        messageHelper: `This message will be sent to the developer's email`,
        message: '',
        avatar: { type: 'chat', src: '/avatar-chuy.webp' },
        avatars: [
            { type: 'feature', src: '/avatar-seriously.webp' },
            { type: 'problem', src: '/avatar-disappointed.webp' },
            { type: 'chat', src: '/avatar-chuy.webp' },
        ]
    }),

    actions: {

        onChangePurpose() {
            console.log('onChangePurpose');

            if(this.messageType === 'feature') {
                this.avatar = this.avatars[0]
                return
            }

            if(this.messageType === 'problem') {
                this.avatar = this.avatars[1]
                return
            }
    
            if(this.messageType === 'chat') {
                this.avatar = this.avatars[2]
                return
            }

        }

    },

});