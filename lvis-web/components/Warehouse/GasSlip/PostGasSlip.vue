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
                        <input type="number" class="form-control" v-model="actual_liters">
                        <small class="text-danger fst-italic" v-if="errors.actual_liters"> {{ errorMsg }}
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">
                            Cost per Liter<span class="text-danger">*</span>
                        </label>
                        <div class="input-group">
                            <span class="input-group-text">₱</span>
                            <input type="number" class="form-control" v-model="cost_per_liter" placeholder="Enter cost">
                        </div>
                        <small class="text-danger fst-italic" v-if="errors.cost_per_liter"> {{ errorMsg }} </small>
                    </div>

                </div>

                <div class="modal-footer">
                    <button ref="close_post_gas_slip_btn" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button @click="handlePost" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Post
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

    const emits = defineEmits(['post-gas-slip'])

    const actual_liters = ref(0)
    const cost_per_liter = ref(0)
    const close_post_gas_slip_btn = ref<HTMLButtonElement>()

    const _errorsInitial = {
        actual_liters: false,
        cost_per_liter: false,
    }

    const errors = ref({..._errorsInitial})
    const errorMsg = 'This field is invalid'

    function handlePost() {

        if(!isValid()) return 

        emits('post-gas-slip', {
            actual_liters: actual_liters.value,
            cost_per_liter: cost_per_liter.value,
        }, close_post_gas_slip_btn.value)

    }

    function isValid() {

        errors.value = { ..._errorsInitial }

        if(actual_liters.value <= 0) {
            errors.value.actual_liters = true 
        }

        if(cost_per_liter.value <= 0) {
            errors.value.cost_per_liter = true 
        }

        const hasError = Object.values(errors.value).includes(true);

        if(hasError) {
            return false 
        }

        return true 

    }

</script>