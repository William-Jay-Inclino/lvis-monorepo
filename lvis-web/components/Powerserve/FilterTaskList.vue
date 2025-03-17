<template>
    <div class="row g-2">
        <div class="col-6">
            <label class="form-label small fw-semibold">Task</label>
            <select class="form-select form-select-sm">
                <option>All</option>
                <option>New Connection</option>
                <option>Low Voltage</option>
                <option>DT Replacement</option>
                <option>Power Outage</option>
            </select>
        </div>

        <div class="col-6">
            <label class="form-label small fw-semibold">Status</label>
            <select class="form-select form-select-sm">
                <option>Pending</option>
                <option>Assigned</option>
                <option>Ongoing</option>
            </select>
        </div>

    </div>
</template>