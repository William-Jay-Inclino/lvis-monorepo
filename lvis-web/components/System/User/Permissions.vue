<template>
    <div>

        <div class="table-responsive">
            <table class="table table-bordered">
                <tbody>
                    <tr class="text-center table-warning">
                        <td colspan="3" class="fst-italic text-danger">
                            <h3> 
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'users']"  class="me-1"/>
                                </client-only> 
                                HR
                            </h3>
                        </td>
                    </tr>
                    <tr v-if="permissions.system.canManageEmployee">
                        <td width="30%" class="text-muted align-middle text-center">Employee Mgmt.</td>
                        <td width="30%" class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.employee" @click="grant_or_revoke_all_module_access('employee', permissions.system.canManageEmployee)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td width="40%" class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageEmployee.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageEmployee.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageEmployee.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageEmployee.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.system.canManageDepartment">
                        <td class="text-muted align-middle text-center">Department Mgmt.</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.department" @click="grant_or_revoke_all_module_access('department', permissions.system.canManageDepartment)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDepartment.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDepartment.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDepartment.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDepartment.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.system.canManageDivision">
                        <td class="text-muted align-middle text-center">Division Mgmt.</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.division" @click="grant_or_revoke_all_module_access('division', permissions.system.canManageDivision)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDivision.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDivision.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDivision.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageDivision.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="text-center table-warning">
                        <td colspan="3" class="fst-italic text-danger">
                            <h3>
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'book']"  class="me-1"/>
                                </client-only> Accounting
                            </h3>
                        </td>
                    </tr>
                    <tr v-if="permissions.system.canManageAccount">
                        <td class="text-muted align-middle text-center">Account Mgmt.</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.account" @click="grant_or_revoke_all_module_access('account', permissions.system.canManageAccount)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageAccount.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageAccount.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageAccount.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageAccount.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.system.canManageClassification">
                        <td class="text-muted align-middle text-center">Classification Mgmt.</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.classification" @click="grant_or_revoke_all_module_access('classification', permissions.system.canManageClassification)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageClassification.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageClassification.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageClassification.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.system.canManageClassification.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="text-center table-warning">
                        <th colspan="3" class="fst-italic text-danger">
                            <h3>
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'money-bill-wave']" class="me-1"/>
                                </client-only>
                                    Purchasing
                            </h3>
                        </th>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageCanvass">
                        <td class="text-muted align-middle text-center">Canvass</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.canvass" @click="grant_or_revoke_all_module_access('canvass', permissions.warehouse.canManageCanvass)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageCanvass.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageCanvass.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageCanvass.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageCanvass.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageRV">
                        <td class="text-muted align-middle text-center">RV</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.rv" @click="grant_or_revoke_all_module_access('rv', permissions.warehouse.canManageRV)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRV.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRV.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRV.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRV.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageSPR">
                        <td class="text-muted align-middle text-center">SPR</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.spr" @click="grant_or_revoke_all_module_access('spr', permissions.warehouse.canManageSPR)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSPR.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSPR.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSPR.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSPR.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageJO">
                        <td class="text-muted align-middle text-center">JO</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.jo" @click="grant_or_revoke_all_module_access('jo', permissions.warehouse.canManageJO)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageJO.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageJO.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageJO.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageJO.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMEQS">
                        <td class="text-muted align-middle text-center">MEQS</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.meqs" @click="grant_or_revoke_all_module_access('meqs', permissions.warehouse.canManageMEQS)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMEQS.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMEQS.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMEQS.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMEQS.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManagePO">
                        <td class="text-muted align-middle text-center">PO</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.po" @click="grant_or_revoke_all_module_access('po', permissions.warehouse.canManagePO)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManagePO.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManagePO.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManagePO.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManagePO.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="text-center table-warning">
                        <th colspan="3" class="fst-italic text-danger">
                            <h3>
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'warehouse']"  class="me-1"/>
                                </client-only> Warehouse
                            </h3>
                        </th>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageRR">
                        <td class="text-muted align-middle text-center">RR</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.rr" @click="grant_or_revoke_all_module_access('rr', permissions.warehouse.canManageRR)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRR.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRR.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRR.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageRR.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageOSRIV">
                        <td class="text-muted align-middle text-center">OSRIV</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.osriv" @click="grant_or_revoke_all_module_access('osriv', permissions.warehouse.canManageOSRIV)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageOSRIV.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageOSRIV.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageOSRIV.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageOSRIV.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageSERIV">
                        <td class="text-muted align-middle text-center">SERIV</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.seriv" @click="grant_or_revoke_all_module_access('seriv', permissions.warehouse.canManageSERIV)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSERIV.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSERIV.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSERIV.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSERIV.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMRV">
                        <td class="text-muted align-middle text-center">MRV</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.mrv" @click="grant_or_revoke_all_module_access('mrv', permissions.warehouse.canManageMRV)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMRV.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMRV.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMRV.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMRV.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMCT">
                        <td class="text-muted align-middle text-center">MCT</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.mct" @click="grant_or_revoke_all_module_access('mct', permissions.warehouse.canManageMCT)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCT.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCT.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCT.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCT.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMCRT">
                        <td class="text-muted align-middle text-center">MCRT</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.mcrt" @click="grant_or_revoke_all_module_access('mcrt', permissions.warehouse.canManageMCRT)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCRT.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCRT.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCRT.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMCRT.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMST">
                        <td class="text-muted align-middle text-center">MST</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.mst" @click="grant_or_revoke_all_module_access('mst', permissions.warehouse.canManageMST)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMST.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMST.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMST.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMST.print">
                                    <label class="form-check-label">
                                        Print
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageItem">
                        <td class="text-muted align-middle text-center">Item Mgmt</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.item" @click="grant_or_revoke_all_module_access('item', permissions.warehouse.canManageItem)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageItem.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageItem.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageItem.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageItem.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageItem.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageSupplier">
                        <td class="text-muted align-middle text-center">Supplier Mgmt</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.supplier" @click="grant_or_revoke_all_module_access('supplier', permissions.warehouse.canManageSupplier)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.warehouse.canManageSupplier.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSupplier.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSupplier.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageSupplier.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageProject">
                        <td class="text-muted align-middle text-center">Project Mgmt</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.project" @click="grant_or_revoke_all_module_access('project', permissions.warehouse.canManageProject)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.warehouse.canManageProject.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageProject.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageProject.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageProject.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageUnit">
                        <td class="text-muted align-middle text-center">Unit Mgmt</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.unit" @click="grant_or_revoke_all_module_access('unit', permissions.warehouse.canManageUnit)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.warehouse.canManageUnit.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageUnit.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageUnit.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageUnit.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="text-center table-warning">
                        <th colspan="3" class="fst-italic text-danger">
                            <h3>
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'car']"  class="me-1"/>
                                </client-only> Motorpool
                            </h3>
                        </th>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMotorpoolDashboard">
                        <td class="text-muted align-middle text-center">Dashboard</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.motorpoolDashboard" @click="grant_or_revoke_all_module_access('motorpoolDashboard', permissions.warehouse.canManageMotorpoolDashboard)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMotorpoolDashboard.viewPMS">
                                    <label class="form-check-label">
                                        View PMS
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageMotorpoolDashboard.viewTrips">
                                    <label class="form-check-label">
                                        View Trip Schedules
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageTripTicket">
                        <td class="text-muted align-middle text-center">Trip Ticket</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.tripTicket" @click="grant_or_revoke_all_module_access('tripTicket', permissions.warehouse.canManageTripTicket)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageTripTicket.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageTripTicket.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageTripTicket.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageGasSlip">
                        <td class="text-muted align-middle text-center">Gas Slip</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.gasSlip" @click="grant_or_revoke_all_module_access('gasSlip', permissions.warehouse.canManageGasSlip)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageGasSlip.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageGasSlip.search">
                                    <label class="form-check-label">
                                        Search
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageGasSlip.viewDetails">
                                    <label class="form-check-label">
                                        View Details
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageVehicle">
                        <td class="text-muted align-middle text-center">Vehicle Mgmt</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.vehicle" @click="grant_or_revoke_all_module_access('vehicle', permissions.warehouse.canManageVehicle)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicle.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicle.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicle.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicle.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageVehicleMaintenance">
                        <td class="text-muted align-middle text-center">Vehicle PMS</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.vehicleMaintenance" @click="grant_or_revoke_all_module_access('vehicleMaintenance', permissions.warehouse.canManageVehicleMaintenance)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleMaintenance.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleMaintenance.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleMaintenance.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleMaintenance.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageVehicleService">
                        <td class="text-muted align-middle text-center">PMS Services</td>
                        <td class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.vehicleServices" @click="grant_or_revoke_all_module_access('vehicleServices', permissions.warehouse.canManageVehicleService)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleService.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleService.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleService.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                        v-model="permissions.warehouse.canManageVehicleService.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="text-center table-warning">
                        <td colspan="3" class="fst-italic text-danger">
                            <h3> 
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'users']"  class="me-1"/>
                                </client-only> 
                                POWERSERVE
                            </h3>
                        </td>
                    </tr>
                    <tr v-if="permissions.powerserve?.canManageComplaint">
                        <td width="30%" class="text-muted align-middle text-center">Complaint</td>
                        <td width="30%" class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.complaint" @click="grant_or_revoke_all_module_access('complaint', permissions.powerserve.canManageComplaint)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td width="40%" class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageComplaint.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageComplaint.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageComplaint.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageComplaint.viewDetails">
                                    <label class="form-check-label">
                                        View
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.powerserve?.canManageTask">
                        <td width="30%" class="text-muted align-middle text-center">Task</td>
                        <td width="30%" class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.task" @click="grant_or_revoke_all_module_access('task', permissions.powerserve.canManageTask)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td width="40%" class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageTask.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageTask.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageTask.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageTask.view">
                                    <label class="form-check-label">
                                        View
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.powerserve?.canManageMyTask">
                        <td width="30%" class="text-muted align-middle text-center">My Task</td>
                        <td width="30%" class="text-muted align-middle text-center">
                            -------
                        </td>
                        <td width="40%" class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageMyTask.manage">
                                    <label class="form-check-label">
                                        Manage
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.powerserve?.canManageArea">
                        <td width="30%" class="text-muted align-middle text-center">Area</td>
                        <td width="30%" class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.area" @click="grant_or_revoke_all_module_access('area', permissions.powerserve.canManageArea)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td width="40%" class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageArea.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageArea.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageArea.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageArea.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="permissions.powerserve?.canManageSitio">
                        <td width="30%" class="text-muted align-middle text-center">Sitio</td>
                        <td width="30%" class="text-muted align-middle text-center">
                            <div class="form-check form-switch d-inline-block">
                                <input v-model="module_access.sitio" @click="grant_or_revoke_all_module_access('sitio', permissions.powerserve.canManageSitio)" class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                    type="checkbox">
                                <label class="form-check-label">
                                    Grant All Access
                                </label>
                            </div>
                        </td>
                        <td width="40%" class="text-muted text-center">
                            <div class="d-inline-block">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageSitio.create">
                                    <label class="form-check-label">
                                        Create
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageSitio.read">
                                    <label class="form-check-label">
                                        Read
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageSitio.update">
                                    <label class="form-check-label">
                                        Update
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }"
                                        type="checkbox" v-model="permissions.powerserve.canManageSitio.delete">
                                    <label class="form-check-label">
                                        Delete
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>


<script setup lang="ts">

import type { UserPermissions } from '~/composables/system/user/user.types'


const props = defineProps({
    permissions: {
        type: Object as () => UserPermissions,
        default: () => { },
    },
    isViewOnly: {
        type: Boolean,
        default: false,
    },
});

type ModuleAccess = {
    [key: string]: boolean; 
};

const module_access = ref<ModuleAccess>({
    employee: false,
    department: false,
    division: false,
    account: false,
    classification: false,
    canvass: false,
    rv: false,
    spr: false,
    jo: false,
    meqs: false,
    po: false,
    rr: false,
    osriv: false,
    seriv: false,
    mrv: false,
    mct: false,
    mcrt: false,
    mst: false,
    item: false,
    supplier: false,
    project: false,
    unit: false,
    tripTicket: false,
    gasSlip: false,
    vehicle: false,
    motorpoolDashboard: false,
    vehicleMaintenance: false,
    vehicleServices: false,
    complaint: false,
    task: false,
    area: false,
    sitio: false,
})

function grant_or_revoke_all_module_access(module: string, permission: any) {
    if (module_access.value[module] === true) {
        module_access.value[module] = false
        revoke_all_access(permission);
    } else {
        module_access.value[module] = true
        grant_all_access(permission);
    }
}


function set_permissions(modulePermissions: any, value: boolean) {
     // Iterate through each permission field (create, read, update, delete, etc.)
    for (let permission in modulePermissions) {
        modulePermissions[permission] = value
    }
}

function grant_all_access(modulePermissions: Record<string, any>) {
    set_permissions(modulePermissions, true);
}

function revoke_all_access(modulePermissions: Record<string, any>) {
    set_permissions(modulePermissions, false);
}

</script>


<style scoped>
.non-clickable {
    pointer-events: none;
}
</style>