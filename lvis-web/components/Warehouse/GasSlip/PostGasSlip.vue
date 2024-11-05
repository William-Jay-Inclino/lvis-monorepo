<template>
    <div class="modal fade" id="post_gas_slip_modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning">Post Gas Slip</h5>
                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="mb-3">
                        <label class="form-label">
                            Actual No. of Liters <span class="text-danger">*</span>
                        </label>
                        <input type="number" class="form-control" v-model="actual_liter">
                        <small class="text-danger fst-italic" v-if="errors.actual_liter"> {{ errorMsg }}
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">
                            Cost per Liter<span class="text-danger">*</span>
                        </label>
                        <div class="input-group">
                            <span class="input-group-text">₱</span>
                            <input type="number" class="form-control" v-model="price_per_liter" placeholder="Enter cost">
                        </div>
                        <small class="text-danger fst-italic" v-if="errors.price_per_liter"> {{ errorMsg }} </small>
                    </div>

                </div>

                <div class="modal-footer">
                    <button @click="onClickCloseBtn" ref="close_post_gas_slip_btn" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button @click="handlePost" class="btn btn-primary" :disabled="isPosting">
                        <i class="fas fa-paper-plane"></i> {{ isPosting ? 'Posting...' : 'Post' }}
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

    const emits = defineEmits(['post-gas-slip'])

    const props = defineProps({
        isPosting: {
            type: Boolean,
            required: true
        },
    })

    const actual_liter = ref(0)
    const price_per_liter = ref(0)
    const close_post_gas_slip_btn = ref<HTMLButtonElement>()

    const _errorsInitial = {
        actual_liter: false,
        price_per_liter: false,
    }

    const errors = ref({..._errorsInitial})
    const errorMsg = 'This field is invalid'

    function handlePost() {

        if(!isValid()) return 

        emits('post-gas-slip', {
            actual_liter: actual_liter.value,
            price_per_liter: price_per_liter.value,
        }, close_post_gas_slip_btn.value)

    }

    function isValid() {

        errors.value = { ..._errorsInitial }

        if(actual_liter.value <= 0) {
            errors.value.actual_liter = true 
        }

        if(price_per_liter.value <= 0) {
            errors.value.price_per_liter = true 
        }

        const hasError = Object.values(errors.value).includes(true);

        if(hasError) {
            return false 
        }

        return true 

    }

    function onClickCloseBtn() {
        actual_liter.value = 0
        price_per_liter.value = 0
    }

</script>