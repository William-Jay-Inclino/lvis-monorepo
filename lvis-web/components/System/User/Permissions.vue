<template>
    <div>

        <div class="table-responsive">
            <table class="table table-hover">
                <tbody>
                    <tr>
                        <th colspan="2" class="fst-italic text-warning">
                            <h5> HOMEPAGE </h5>
                        </th>
                    </tr>
                    <tr>
                        <td class="text-muted">View System</td>
                        <td>
                            <div class="form-check form-switch">
                                <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.canViewSystem">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-muted">View Warehouse</td>
                        <td>
                            <div class="form-check form-switch">
                                <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.canViewWarehouse">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fst-italic text-warning">
                            <h5> SYSTEM </h5>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-muted">Users</td>
                        <td class="text-muted"> Only admin </td>
                    </tr>
                    <tr>
                        <td class="text-muted">Settings</td>
                        <td class="text-muted"> Only admin </td>
                    </tr>
                    <tr v-if="permissions.system.canManageEmployee">
                        <td class="text-muted align-middle">Employee Mgmt.</td>
                        <td class="text-muted">
                            <div>
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
                        <td class="text-muted align-middle">Department Mgmt.</td>
                        <td class="text-muted">
                            <div>
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
                        <td class="text-muted align-middle">Division Mgmt.</td>
                        <td class="text-muted">
                            <div>
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
                    <tr v-if="permissions.system.canManageAccount">
                        <td class="text-muted align-middle">Account Mgmt.</td>
                        <td class="text-muted">
                            <div>
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
                        <td class="text-muted align-middle">Classification Mgmt.</td>
                        <td class="text-muted">
                            <div>
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
                    <tr>
                        <th colspan="2" class="fst-italic text-warning">
                            <h5> WAREHOUSE </h5>
                        </th>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageCanvass">
                        <td class="text-muted align-middle">Canvass</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageRV">
                        <td class="text-muted align-middle">RV</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageSPR">
                        <td class="text-muted align-middle">SPR</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageJO">
                        <td class="text-muted align-middle">JO</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMEQS">
                        <td class="text-muted align-middle">MEQS</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManagePO">
                        <td class="text-muted align-middle">PO</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageRR">
                        <td class="text-muted align-middle">RR</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageOSRIV">
                        <td class="text-muted align-middle">OSRIV</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageSERIV">
                        <td class="text-muted align-middle">SERIV</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMRV">
                        <td class="text-muted align-middle">MRV</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMCT">
                        <td class="text-muted align-middle">MCT</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMCRT">
                        <td class="text-muted align-middle">MCRT</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageMST">
                        <td class="text-muted align-middle">MST</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageItem">
                        <td class="text-muted align-middle">Item Mgmt</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <!-- <tr v-if="permissions.warehouse.canManageItemType">
                        <td class="text-muted align-middle">Item Type Mgmt</td>
                        <td class="text-muted">
                            <div class="form-check form-switch">
                                <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.warehouse.canManageItemType.create">
                                <label class="form-check-label">
                                    Create
                                </label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.warehouse.canManageItemType.read">
                                <label class="form-check-label">
                                    Read
                                </label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.warehouse.canManageItemType.update">
                                <label class="form-check-label">
                                    Update
                                </label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" :class="{ 'non-clickable': isViewOnly }" type="checkbox"
                                    v-model="permissions.warehouse.canManageItemType.delete">
                                <label class="form-check-label">
                                    Delete
                                </label>
                            </div>
                        </td>
                    </tr> -->
                    <!-- <tr v-if="permissions.warehouse.canManageUnit">
                        <td class="text-muted align-middle">Unit Mgmt</td>
                        <td class="text-muted">
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
                        </td>
                    </tr> -->
                    <tr v-if="permissions.warehouse.canManageSupplier">
                        <td class="text-muted align-middle">Supplier Mgmt</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr>
                        <th colspan="2" class="fst-italic text-warning">
                            <h5> MOTORPOOL </h5>
                        </th>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageTripTicket">
                        <td class="text-muted align-middle">Trip Ticket</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageGasSlip">
                        <td class="text-muted align-middle">Gas Slip</td>
                        <td class="text-muted">
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
                        </td>
                    </tr>
                    <tr v-if="permissions.warehouse.canManageVehicle">
                        <td class="text-muted align-middle">Vehicle Mgmt</td>
                        <td class="text-muted">
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

</script>


<style scoped>
.non-clickable {
    pointer-events: none;
}
</style>