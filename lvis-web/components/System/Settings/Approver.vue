<template>
    <div>


        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="bg-secondary text-white">Order</th>
                        <th class="bg-secondary text-white">Label</th>
                        <th class="bg-secondary text-white">Approver</th>
                        <th class="bg-secondary text-white text-center">
                            <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, i in approvers">
                        <td class="text-muted align-middle">
                            {{ item.order }}
                        </td>
                        <td class="text-muted align-middle">
                            {{ item.label }}
                        </td>
                        <td class="text-muted align-middle">
                            {{ getFullname(item.approver!.firstname, item.approver!.middlename,
                        item.approver!.lastname) }}
                        </td>
                        <td class="text-center align-middle">
                            <button @click="removeApprover(item.id)" class="btn btn-sm btn-light w-50">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'trash']" class="text-danger"/>
                            </client-only>
                            </button>
                            <button @click="onClickEditApprover(i)" class="btn btn-sm btn-light w-50"
                                data-bs-toggle="modal" data-bs-target="#editApproverModal">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']" class="text-primary"/>
                            </client-only>
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="7">
                            <div class="text-center">
                                <button @click="onClickAddApprover" class="btn btn-primary btn-sm me-2"
                                    data-bs-toggle="modal" data-bs-target="#addApproverModal">
                                    <client-only>
                                    <font-awesome-icon :icon="['fas', 'plus-circle']"/>
                                </client-only> Add Approver
                                </button>
                                <button :disabled="approvers.length === 0" @click="onClickChangeApprover"
                                    class="btn btn-sm btn-dark" data-bs-toggle="modal"
                                    data-bs-target="#changeApproverOrderModal">
                                    <i class="fas fa-sort"></i> Change Order
                                </button>
                            </div>
                        </td>
                    </tr>

                </tfoot>
            </table>
        </div>



        <!-- Change approver order modal-->
        <div v-if="approvers.length > 0" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false"
            id="changeApproverOrderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">Change Order</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">Drag items to reorder</small>
                        </div>

                        <div class="pt-4">
                            <draggable v-model="changeOrderApprovers" item-key="id" tag="div" :component-data="{
                        tag: 'ul',
                        type: 'transition-group',
                        name: !drag ? 'flip-list' : null
                    }" v-bind="_dragOptions" @start="drag = true" @end="drag = false">
                                <template #item="{ element, index }">
                                    <div class="draggable-item position-relative">

                                        <span
                                            class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-primary">
                                            <!-- add counter here -->
                                            {{ getCounter(index) }}
                                        </span>

                                        <div class="row">
                                            <div class="col">
                                                <span> {{ element.label }} </span>
                                            </div>
                                            <div class="col">
                                                <span class="text-muted fst-italic">
                                                    {{ element.approver.fullname }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                        </div>


                    </div>
                    <div class="modal-footer">
                        <button @click="onCloseChangeOrderModal" ref="closeChangeOrderModal" type="button"
                            class="btn btn-secondary" data-bs-dismiss="modal">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                        </button>
                        <button @click="updateApproverOrder" type="button" class="btn btn-primary"
                            :disabled="isUpdatingApproverOrder">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'save']"/>
                            </client-only> {{ isUpdatingApproverOrder ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <!-- Add approver modal-->
        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="addApproverModal" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">
                            Add Approver
                        </h5>
                        <button @click="onCloseAddApproverModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="mb-3">
                            <label class="form-label">
                                Approver <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname"
                                    v-model="addApproverData.approver"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="addApproverErrors.approver">
                                This field is required
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Label <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="addApproverData.label">
                            <small class="text-danger fst-italic" v-show="addApproverErrors.label">
                                This field is required
                            </small>
                        </div>

                        <!-- <div class="mb-3">
                            <label class="form-label">
                                Order
                            </label>
                            <input type="number" class="form-control" :value="addApproverData.order" disabled>
                        </div> -->

                    </div>
                    <div class="modal-footer">
                        <button @click="onCloseAddApproverModal" ref="closeAddApproverModal" class="btn btn-secondary"
                            data-bs-dismiss="modal">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                        </button>
                        <button @click="addApprover" class="btn btn-primary" :disabled="isAddingApprover">
                            <i class="fas fa-user-plus"></i> {{ isAddingApprover ? 'Adding...' : 'Add' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <!-- Edit approver modal-->
        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="editApproverModal" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">
                            Edit Approver
                        </h5>
                        <button @click="onCloseEditApproverModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-if="editApproverData.id">

                        <div class="mb-3">
                            <label class="form-label">
                                Approver <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname"
                                    v-model="editApproverData.approver" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Label <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="editApproverData.label">
                            <small class="text-danger fst-italic" v-show="editApproverErrors.label">
                                This field is required
                            </small>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button @click="onCloseEditApproverModal" ref="closeEditApproverModal" class="btn btn-secondary"
                            data-bs-dismiss="modal">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                        </button>
                        <button @click="editApprover" class="btn btn-primary" :disabled="isEditingApprover">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> {{ isEditingApprover ? 'Editing...' : 'Edit' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>



<script setup lang="ts">
import type { Employee } from '~/composables/hr/employee/employee.types';
import type { ApproverSetting, CreateApproverSetting, UpdateApproverSetting } from '~/composables/system/settings/warehouse.types';



const emits = defineEmits(['changeApproverOrder', 'addApprover', 'editApprover', 'removeApprover']);

const props = defineProps({
    approvers: {
        type: Array as () => ApproverSetting[],
        default: () => [],
    },
    employees: {
        type: Array as () => Employee[],
        default: () => [],
    },
    isUpdatingApproverOrder: {
        type: Boolean,
        default: false
    },
    isAddingApprover: {
        type: Boolean,
        default: false
    },
    isEditingApprover: {
        type: Boolean,
        default: false
    }
});

// CONSTANTS 
const _dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
};

// FLAGS
const isApproverModalAdd = ref(false)
const drag = ref(false)

// HTML ELEMENTS
const closeChangeOrderModal = ref<HTMLButtonElement>()
const closeAddApproverModal = ref<HTMLButtonElement>()
const closeEditApproverModal = ref<HTMLButtonElement>()

// INITIAL DATA
const _addApproverInitial: CreateApproverInput = {
    approver: null,
    label: '',
    order: 0
}
const _addApproverErrorsInitial = {
    approver: false,
    label: false
}
const _editApproverErrorsInitial = {
    date_approval: false,
    label: false
}

// CHANGE APPROVER ORDER STATE
const changeOrderApprovers = ref<ApproverSetting[]>([])

// ADD APPROVER STATE
const addApproverData = ref<CreateApproverSetting>({ ..._addApproverInitial })
const addApproverErrors = ref({ ..._addApproverErrorsInitial })

// EDIT APPROVER STATE
const editApproverData = ref<UpdateApproverSetting>({} as UpdateApproverSetting)
const editApproverErrors = ref({ ..._editApproverErrorsInitial })


// ======================== LIFECYCLE HOOKS ========================  



// ======================== COMPUTED ========================  

// const uniqueEmployees = computed(() => {
//     return props.employees.filter(employee => !props.approvers.some(approver => employee.id === approver.approver?.id));

// })




// ======================== FUNCTIONS ========================  

function onClickAddApprover() {
    isApproverModalAdd.value = true

    let highestOrder = 0

    if (props.approvers.length > 0) {
        highestOrder = props.approvers.reduce((max, obj) => obj.order > max ? obj.order : max, props.approvers[0].order)
    }

    addApproverData.value.order = highestOrder + 1
}

function onClickEditApprover(indx: number) {
    isApproverModalAdd.value = false

    const item = props.approvers[indx]

    const currentData = { ...item }

    editApproverData.value = {
        id: item.id,
        approver: item.approver,
        label: currentData.label,
    }
}

function onClickChangeApprover() {
    changeOrderApprovers.value = [...props.approvers]
}

function onCloseChangeOrderModal() {
    changeOrderApprovers.value = []
}

function onCloseAddApproverModal() {
    addApproverData.value = { ..._addApproverInitial }
    addApproverErrors.value = { ..._addApproverErrorsInitial }
}

function onCloseEditApproverModal() {
    editApproverData.value = {} as UpdateApproverInput
    editApproverErrors.value = { ..._editApproverErrorsInitial }
}



// ======================== EMIT TO PARENT ========================  

async function removeApprover(id: string) {

    emits('removeApprover', id)

}

async function updateApproverOrder() {

    // Create a shallow copy of the array
    const _approvers = changeOrderApprovers.value.map(approver => ({ ...approver }))

    let ctr = 1
    for (let approver of _approvers) {
        approver.order = ctr
        ctr++
    }

    const data = _approvers.map(i => {
        return {
            id: i.id,
            order: i.order
        }
    })

    console.log('data', data)

    emits("changeApproverOrder", data, closeChangeOrderModal.value)

}

async function addApprover() {

    if (!isValidAddApprover()) {
        return
    }

    emits('addApprover', addApproverData.value, closeAddApproverModal.value)

}

async function editApprover() {
    console.log('editApprover()')

    if (!isValidEditApprover()) {
        return
    }

    emits('editApprover', editApproverData.value, closeEditApproverModal.value)

}



// ======================== UTILS ========================  

function getCounter(index: number) {
    return index + 1;
}


function isValidAddApprover(): boolean {

    addApproverErrors.value = { ..._addApproverErrorsInitial }

    if (!addApproverData.value.approver) {
        addApproverErrors.value.approver = true
    }

    if (addApproverData.value.label.trim() === '') {
        addApproverErrors.value.label = true
    }

    const hasError = Object.values(addApproverErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

function isValidEditApprover(): boolean {

    editApproverErrors.value = { ..._editApproverErrorsInitial }

    if (editApproverData.value.label.trim() === '') {
        editApproverErrors.value.label = true
    }

    const hasError = Object.values(editApproverErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}



</script>




<style scoped>
.draggable-item {
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05);
    /* Increased elevation and shadow */
}

.draggable-item:hover {
    background-color: #f0f0f0;
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.list-group {
    min-height: 20px;
}

.list-group-item {
    cursor: move;
}

.list-group-item i {
    cursor: pointer;
}
</style>