<template>
    <div class="row g-2">
        <div class="col-4">
            <label class="form-label small fw-semibold">Task</label>
            <select class="form-select form-select-sm">
                <option>All</option>
                <option>New Connection</option>
                <option>Low Voltage</option>
                <option>DT Replacement</option>
                <option>Power Outage</option>
            </select>
        </div>

        <div class="col-4">
            <label class="form-label small fw-semibold">Start Date</label>
            <input type="date" class="form-control form-control-sm">
        </div>

        <div class="col-4">
            <label class="form-label small fw-semibold">End Date</label>
            <input type="date" class="form-control form-control-sm">
        </div>

    </div>
</template>