<template>

    <div>

        <div class="alert alert-info" role="alert">
            <div>
                <small class="fst-italic">
                    - Minimum of {{ min_no_of_supplier }} and Maximum of {{ max_no_of_supplier }} suppliers
                </small>
            </div>
            <div v-if="!isPageCreate">
                <small class="fst-italic">
                    - Click filename under attachments column to view attachment
                </small>
            </div>
        </div>

        <div class="table-responsive mt-2">
            <table class="table">
                <thead>
                    <tr>
                        <th width="25%" class="bg-secondary text-white"> Supplier </th>
                        <th width="25%" class="bg-secondary text-white"> Payment Terms </th>
                        <th class="bg-secondary text-white"> Attachments </th>
                        <th width="15%" class="bg-secondary text-white text-center">
                            <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, i in meqs_suppliers">
                        <td class="text-muted align-middle"> {{ item.supplier?.name }} </td>
                        <td class="text-muted align-middle"> {{ item.payment_terms }} </td>
                        <td class="text-muted align-middle">
                            <div v-if="item.attachments.length > 0">
                                <div v-for="attachment, j in item.attachments">
                                    <a v-if="!isPageCreate" class="me-2" @click="onClickViewAttachment(attachment.src)"
                                        href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#imageModal"
                                        style="text-decoration: none">
                                        {{ attachment.filename }}
                                    </a>
                                    <span v-else class="me-2">
                                        {{ attachment.filename }}
                                    </span>
                                    <button @click="onClickRemoveAttachment(i, j)"
                                        class="btn btn-sm btn-light text-danger">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'times']" />
                            </client-only>
                                    </button>
                                </div>
                            </div>
                            <div v-else>
                                <small class="text-muted fst-italic">---No attachments---</small>
                            </div>
                        </td>
                        <td class="align-middle text-center">
                            <div class="row">
                                <div class="col">
                                    <button @click="removeSupplier(i)" class="btn btn-sm btn-light w-100">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'trash']" class="text-danger"/>
                            </client-only>
                                    </button>
                                </div>
                                <div class="col">
                                    <button @click="onClickEdit(i)" class="btn btn-sm btn-light w-100"
                                        data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']" class="text-primary"/>
                            </client-only>
                                    </button>
                                </div>
                                <div class="col">
                                    <button @click="onClickAddAttachment(i)" class="btn btn-sm btn-light w-100"
                                        data-bs-toggle="modal" data-bs-target="#addAttachmentModal">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'paperclip']" class="text-primary"/>
                            </client-only>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="5" class="text-center">
                            <button @click="onClickAdd()" type="button" class="btn btn-primary btn-sm"
                                data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'plus-circle']"/>
                                </client-only> Add Supplier
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>


        <!-- Supplier Modal -->
        <div class="modal fade" id="addSupplierModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">{{ formIsAdd ? 'Add' : 'Edit' }}
                            Supplier</h5>
                        <button @click="onCloseModal" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="row">
                            <div class="col">

                                <div class="alert alert-info" role="alert">
                                    <small class="fst-italic">
                                        Fields with * are required
                                    </small>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label"> Supplier </label> <span class="text-danger"
                                        v-if="formIsAdd">*</span>
                                    <div v-if="formIsAdd">
                                        <client-only>
                                            <v-select @search="handleSearchSuppliers" @option:selected="onChangeSupplier" :options="availableSuppliers"
                                                v-model="formData.supplier" label="name_with_address"></v-select>
                                        </client-only>
                                    </div>
                                    <div v-else>
                                        <input type="text" class="form-control" :value="formData.supplier?.name + ' - ' + formData.supplier?.address"
                                            disabled>
                                    </div>
                                    <small class="fst-italic text-muted" v-if="formData.supplier"> {{ formData.supplier.is_vat_registered ? 'VAT Registered' : 'Non-VAT Registered' }} </small>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"> Vat </label>
                                    <input type="text" class="form-control" :value="vat" disabled>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        Payment Terms <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.payment_terms">
                                </div>
                            </div>
                        </div>

                        <div class="h5wrapper mb-3 mt-3" v-show="formData.supplier">
                            <hr class="result">
                            <h6 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Items
                            </h6>
                            <hr class="result">
                        </div>

                        <div class="row" v-if="formData.supplier">
                            <div class="col">

                                <div class="alert alert-info" role="alert">
                                    <small v-if="!isRrCompleted" class="fst-italic">
                                        If the item is unavailable set the price to -1
                                    </small>
                                    <small v-else class="fst-italic">
                                        Unable to update the price as the receiving report has already been approved.
                                    </small>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-hover table-sm">
                                        <thead>
                                            <tr>
                                                <th width="40%" class="bg-secondary text-white">Item</th>
                                                <th width="30%" class="bg-secondary text-white">
                                                    Price <span class="text-danger"> * </span>
                                                </th>
                                                <th width="30%" class="bg-secondary text-white">Vat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in formData.meqs_supplier_items">
                                                <td class="text-muted"> {{ item.canvass_item.description }} </td>
                                                <td class="text-muted">
                                                    <input v-if="!isRrCompleted" type="number"
                                                        class="form-control border border-2"
                                                        @input="onUpdatePrice(item)"
                                                        :class="{ 'border-danger': item.invalidPrice, 'border-success': !item.invalidPrice }"
                                                        v-model="item.price">
                                                    <input v-else type="number" class="form-control" :value="item.price"
                                                        disabled>
                                                </td>
                                                <td class="text-muted">
                                                    <select class="form-select" v-model="item.vat" :disabled="!formData.supplier.is_vat_registered">
                                                        <option :value="item" :key="item.value"
                                                            v-for="item in vatTypes">
                                                            {{ item.label }}
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button @click="onCloseModal()" ref="closeSupplierModal" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                        </button>
                        <button v-if="formIsAdd" @click="addSupplier()" type="button" class="btn btn-primary"
                            :disabled="!canAddSupplier || isAddingSupplier">
                            <client-only>
                                    <font-awesome-icon :icon="['fas', 'plus-circle']"/>
                                </client-only> {{ isAddingSupplier ? 'Adding' : 'Add' }} Supplier
                        </button>
                        <button v-else @click="editSupplier()" type="button" class="btn btn-primary"
                            :disabled="!canAddSupplier || isEditingSupplier">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> {{ isEditingSupplier ? 'Editing' : 'Edit' }} Supplier
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <!-- Attachment Modal -->
        <div class="modal fade" id="addAttachmentModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">Add Attachment</h5>
                        <button @click="onCloseAttachmentModal" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="mb-3" v-if="formAttachment.supplierIndx !== -1">

                            <small class="text-muted fst-italic">(Max size: 5mb)</small>

                            <client-only>
                                <file-pond name="test" ref="filepond" label-idle="Drop file here..."
                                    :allow-multiple="false" accepted-file-types="image/jpeg, image/png"
                                    :max-files="maxFileLimit" @updatefiles="handleFileProcessing" fileSizeBase="1000" />
                            </client-only>
                        </div>


                    </div>
                    <div class="modal-footer">
                        <button @click="onCloseAttachmentModal" ref="closeAttachmentModal" class="btn btn-secondary"
                            data-bs-dismiss="modal">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                        </button>
                        <button @click="addAttachment" class="btn btn-primary"
                            :disabled="!formAttachment.file || isAddingAttachment">
                            <client-only>
                                    <font-awesome-icon :icon="['fas', 'plus-circle']"/>
                                </client-only> {{ isAddingAttachment ? 'Adding...' : 'Add' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>



        <!-- Image Modal -->

        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">

                    <div class="modal-header">
                        <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body d-flex justify-content-center">
                        <img :src="selectedAttachment" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>

    </div>


</template>


<script setup lang="ts">
import vueFilePond from "vue-filepond"
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import type { CanvassItem } from '~/composables/purchase/canvass/canvass-item.types';
import type { MeqsSupplier } from '~/composables/purchase/meqs/meqs-supplier';
import { VAT } from '~/utils/constants'
import type { MeqsSupplierItem } from '~/composables/purchase/meqs/meqs-supplier-item';
import type { Supplier } from '~/composables/warehouse/supplier/supplier'
import { fetchSuppliers } from "~/composables/warehouse/supplier/supplier.api";

const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);

const emits = defineEmits(['addSupplier', 'editSupplier', 'removeSupplier', 'addAttachment', 'removeAttachment', 'search-suppliers']);

const props = defineProps({
    // suppliers in the form
    meqs_suppliers: {
        type: Array as () => MeqsSupplier[],
        default: () => [],
    },
    // supplier options
    suppliers: {
        type: Array as () => Supplier[],
        default: () => [],
    },
    canvass_items: {
        type: Array as () => CanvassItem[],
        default: () => [],
    },
    isAddingSupplier: {
        type: Boolean,
        default: false
    },
    isEditingSupplier: {
        type: Boolean,
        default: false
    },
    isAddingAttachment: {
        type: Boolean,
        default: false
    },
    isPageCreate: {
        type: Boolean,
        default: true
    },
    isRrCompleted: {
        type: Boolean,
        default: false
    },
    min_no_of_supplier: {
        type: Number,
        default: 1,
    },
    max_no_of_supplier: {
        type: Number,
        default: 2,
    }
});

const config = useRuntimeConfig()
const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'

const formIsAdd = ref(true)
const editingIndx = ref()

const closeSupplierModal = ref<HTMLButtonElement>()
const closeAttachmentModal = ref<HTMLButtonElement>()

const selectedAttachment = ref('')

const _formDataErrorsInitial = {
    supplier: false,
    paymentTerms: false,
    // attachments: false,
    vat: false
}

const _formDataInitial: MeqsSupplier = {
    id: '',
    supplier: null,
    payment_terms: '',
    attachments: [],
    meqs_supplier_items: [],
}

const formData = ref({ ..._formDataInitial })
const formDataErrors = ref({ ..._formDataErrorsInitial })
const formAttachment = ref({
    supplierIndx: -1,
    file: null
})

const filepond = ref()


const vatTypes = computed( () => {

    if(!formData.value.supplier) return []

    if(!formData.value.supplier.is_vat_registered) {
        return [{ value: VAT_TYPE.NONE, label: VAT[VAT_TYPE.NONE].label }]
    }

    return [
        {
            value: VAT_TYPE.INC,
            label: VAT[VAT_TYPE.INC].label
        },
        {
            value: VAT_TYPE.EXC,
            label: VAT[VAT_TYPE.EXC].label
        },
        {
            value: VAT_TYPE.EXEMPT,
            label: VAT[VAT_TYPE.EXEMPT].label
        }
    ]

})

const meqs_supplier_items = computed((): MeqsSupplierItem[] => {

    const clonedCanvassItems = props.canvass_items.map(i => ({ ...i }))

    const items: MeqsSupplierItem[] = []

    const vat = {
        value: VAT_TYPE.NONE,
        label: VAT[VAT_TYPE.NONE].label
    }

    for (let item of clonedCanvassItems) {


        items.push({
            id: '',
            canvass_item: item,
            price: 0.00,
            notes: '',
            is_awarded: false,
            invalidPrice: true, // default is 2 since default price is 0.00
            vat_type: VAT_TYPE.NONE,
            vat
        })
    }

    return items

})

const availableSuppliers = computed(() => {

    const uniqueSuppliers = props.suppliers.filter(supplier1 => !props.meqs_suppliers.some(supplier2 => supplier1.id === supplier2.supplier?.id));

    return uniqueSuppliers.map(i => {
        i.name_with_address = i.name + ' - ' + i.address
        return i
    })

})

const canAddSupplier = computed(() => {

    if (!isValidForm()) return false

    return true

})

const vat = computed(() => {

    if (!formData.value.supplier) return ''

    return VAT[formData.value.supplier.vat_type].label

})

const maxFileLimit = computed(() => props.canvass_items.length)


function addSupplier() {

    console.log('formData', formData.value)

    emits("addSupplier", formData.value)

    closeSupplierModal.value?.click()

}

function editSupplier() {

    if (!isValidForm()) {
        return
    }

    console.log('formData', formData.value)

    emits("editSupplier", formData.value, editingIndx.value)

    closeSupplierModal.value?.click()

}

function removeSupplier(indx: number) {

    emits('removeSupplier', indx)

}

function addAttachment() {

    emits("addAttachment", { ...formAttachment.value }, closeAttachmentModal.value)
}

function onClickEdit(indx: number) {
    formIsAdd.value = false
    editingIndx.value = indx

    const item = props.meqs_suppliers[indx]

    formData.value = {
        id: item.id,
        supplier: item.supplier,
        payment_terms: item.payment_terms,
        attachments: item.attachments,
        meqs_supplier_items: item.meqs_supplier_items,
    }

    console.log('formData.value', formData.value)

}

function onClickAdd() {
    formIsAdd.value = true
    formData.value.meqs_supplier_items = meqs_supplier_items.value.map(i => ({ ...i }))
}

function onCloseModal() {
    formData.value = { ..._formDataInitial }
    formDataErrors.value = { ..._formDataErrorsInitial }
}

function onClickAddAttachment(supplierIndx: number) {

    console.log('onClickAddAttachment')

    formAttachment.value = {
        supplierIndx,
        file: null
    }

}

function onClickRemoveAttachment(supplierIndx: number, attachmentIndx: number) {

    emits('removeAttachment', supplierIndx, attachmentIndx)

}

function onCloseAttachmentModal() {
    console.log('onCloseAttachmentModal')
    formAttachment.value = {
        supplierIndx: -1,
        file: null
    }
}

function onUpdatePrice(item: MeqsSupplierItem) {

    if (isInvalidPrice(item.price)) {
        item.invalidPrice = true
    } else {
        item.invalidPrice = false
    }

}

function onChangeSupplier() {
    console.log('onChangeSupplier')

    const supplier = formData.value.supplier

    if(!supplier) return 

    let vatType = supplier.is_vat_registered ? supplier.vat_type : VAT_TYPE.NONE

    for (let item of formData.value.meqs_supplier_items) {
        item.vat_type = vatType
        item.vat = {
            value: vatType,
            label: VAT[vatType].label
        }
    }

}

function handleFileProcessing(_files: any[]) {

    console.log('_files', _files)

    formAttachment.value.file = _files[0]

}

function onClickViewAttachment(src: string) {
    selectedAttachment.value = getUploadsPath(src)
}

function getUploadsPath(src: string) {

    const path = src.replace(UPLOADS_PATH, '')
    console.log('PATH', path)

    const uploadsPath = API_FILE_ENDPOINT + path
    return uploadsPath

}

async function handleSearchSuppliers(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        emits('search-suppliers', [])
        return 
    } 

    debouncedSearchSuppliers(input, loading)

}

async function searchSuppliers(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchSuppliers(input);
        emits('search-suppliers', response)
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}

// utils 

const debouncedSearchSuppliers = debounce((input: string, loading: (status: boolean) => void) => {
  searchSuppliers(input, loading);
}, 500);

function isInvalidPrice(price: number) {
    if (!price) return true
    if (price < -1 || price === 0) {
        return true
    } else {
        return false
    }
}

function isValidForm(): boolean {

    formDataErrors.value = { ..._formDataErrorsInitial }

    if (!formData.value.supplier) {
        formDataErrors.value.supplier = true
    }

    if (formData.value.payment_terms.trim() === '') {
        formDataErrors.value.paymentTerms = true
    }

    const hasErrorForm = Object.values(formDataErrors.value).includes(true);

    const hasInvalidPrice = formData.value.meqs_supplier_items.find(i => i.invalidPrice)

    if (hasErrorForm || hasInvalidPrice) {
        return false
    }

    return true
}

</script>