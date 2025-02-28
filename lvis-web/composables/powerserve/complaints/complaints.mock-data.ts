import type { Area, Barangay, Consumer, Department, Division, Municipality, Sitio } from "../common";
import type { ComplaintAssignment, ComplaintCategory, ComplaintDetail, ComplaintReportType, Complaint, ComplaintStatus, NatureOfComplaint } from "./complaints.types";

// Mock Consumers
export const consumers: Consumer[] = Array.from({ length: 10 }, (_, i) => ({
    _id: `C${i + 1}`,
    name: `Consumer ${i + 1}`,
}));

// Mock Areas
export const areas: Area[] = Array.from({ length: 4 }, (_, i) => ({
    _id: `A${i + 1}`,
    name: `Area ${i + 1}`,
}));

// Mock Departments
export const departments: Department[] = Array.from({ length: 3 }, (_, i) => ({
    _id: `D${i + 1}`,
    name: `Department ${i + 1}`,
}));

// Mock Divisions
export const divisions: Division[] = Array.from({ length: 6 }, (_, i) => ({
    _id: `Div${i + 1}`,
    department_id: `D${(i % 3) + 1}`,
    name: `Division ${i + 1}`,
}));

// Mock Municipalities
export const municipalities: Municipality[] = Array.from({ length: 4 }, (_, i) => ({
    _id: `M${i + 1}`,
    area_id: `A${(i % 5) + 1}`,
    name: `Municipality ${i + 1}`,
}));

// Mock Barangays
export const barangays: Barangay[] = Array.from({ length: 10 }, (_, i) => ({
    _id: `B${i + 1}`,
    municipality_id: `M${(i % 4) + 1}`,
    name: `Barangay ${i + 1}`,
}));

// Mock Sitios
export const sitios: Sitio[] = Array.from({ length: 10 }, (_, i) => ({
    _id: `S${i + 1}`,
    barangay_id: `B${(i % 10) + 1}`,
    name: `Sitio ${i + 1}`,
}));

// Mock Nature of Complaints
export const natureOfComplaints: NatureOfComplaint[] = [
    { _id: 1, category_id: "1", name: "New Connection", unit: 1, quantity: 1, number_of_personnel_required: 2 },
    { _id: 2, category_id: "1", name: "Reconnection/Disconnection", unit: 1, quantity: 1, number_of_personnel_required: 2 },
    { _id: 3, category_id: "2", name: "Fix Loose Connection", unit: 1, quantity: 1, number_of_personnel_required: 1 },
    { _id: 4, category_id: "2", name: "Low Voltage", unit: 1, quantity: 1, number_of_personnel_required: 1 },
    { _id: 5, category_id: "3", name: "Power Outage Restoration (Feeder Line)", unit: 1, quantity: 1, number_of_personnel_required: 3 },
    { _id: 6, category_id: "3", name: "Power Outage Restoration (Backbone Line)", unit: 1, quantity: 1, number_of_personnel_required: 3 },
    { _id: 7, category_id: "4", name: "DT Replacement", unit: 1, quantity: 1, number_of_personnel_required: 4 },
    { _id: 8, category_id: "4", name: "DT Installation", unit: 1, quantity: 1, number_of_personnel_required: 4 },
    { _id: 9, category_id: "5", name: "Service Pole Installation", unit: 1, quantity: 1, number_of_personnel_required: 3 },
    { _id: 10, category_id: "5", name: "System Grounding Installation", unit: 1, quantity: 1, number_of_personnel_required: 3 },
    { _id: 11, category_id: "6", name: "Line/Load Balancing", unit: 1, quantity: 1, number_of_personnel_required: 2 },
    { _id: 12, category_id: "6", name: "Transformer Load Management (Data Gathering Only)", unit: 1, quantity: 1, number_of_personnel_required: 2 },
    { _id: 13, category_id: "7", name: "High Bill Complaint", unit: 1, quantity: 1, number_of_personnel_required: 1 },
    { _id: 14, category_id: "8", name: "Line Construction Complaint", unit: 1, quantity: 1, number_of_personnel_required: 4 },
];


// Mock Complaints
export const complaints: Complaint[] = Array.from({ length: 20 }, (_, i) => ({
    _id: i + 1,
    report_type_id: (i % 4) + 1, // Cycles through 1-4
    nature_of_complaint_id: natureOfComplaints[i % natureOfComplaints.length]._id.toString(), // Uses ID instead of full object
    complaint_status_id: (i % 3) + 1, // Cycles through 1-3
    ref_number: `25-${(i + 1).toString().padStart(5, '0')}`,
    complainant_name: `Complainant ${i + 1}`,
    complainant_contact_no: i % 2 === 0 ? `0917${Math.floor(1000000 + Math.random() * 9000000)}` : null,
    remarks: `Remark for complaint ${i + 1}`,
    created_at: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
}));

// Mock Complaint Details
export const complaintDetails: ComplaintDetail[] = complaints.map((complaint, i) => ({
    _id: i + 1,
    complaint_id: complaint._id,
    account_number: i % 3 === 0 ? `ACC${1000 + i}` : null,
    meter_number: i % 4 === 0 ? `MTR${2000 + i}` : null,
    consumer_id: i % 2 === 0 ? `C${(i % 10) + 1}` : null,
    barangay_id: `B${(i % 10) + 1}`,
    sitio_id: i % 2 === 0 ? `S${(i % 10) + 1}` : null,
    landmark: i % 2 === 0 ? `Landmark ${i + 1}` : null,
}));

// Mock Complaint Assignments - Only one of area_id, department_id, or division_id is defined
export const complaintAssignments: ComplaintAssignment[] = complaints.map((complaint, i) => {
    const assignmentType = i % 3;
    return {
        _id: i + 1,
        complaint_id: complaint._id,
        area_id: assignmentType === 0 ? `A${(i % 5) + 1}` : null,
        department_id: assignmentType === 1 ? `D${(i % 3) + 1}` : null,
        division_id: assignmentType === 2 ? `Div${(i % 6) + 1}` : null,
        assigned_at: new Date(2025, i % 12, (i % 28) + 1, 9, 30, 0).toISOString(),
    };
});

// Mock Complaint Statuses
export const complaintStatuses: ComplaintStatus[] = [
    { _id: 1, name: "Pending", color_class: "warning" },
    { _id: 2, name: "Ongoing", color_class: "primary" },
    { _id: 3, name: "Acted", color_class: "success" },
];

// Mock Complaint Report Types
export const complaintReportTypes: ComplaintReportType[] = [
    { _id: 1, name: "Phone Call" },
    { _id: 2, name: "Walk In" },
    { _id: 3, name: "SMS" },
    { _id: 4, name: "Thru LEYECO V Employee" },
];

// Mock Complaint Categories
export const complaintCategories: ComplaintCategory[] = [
    { _id: 1, name: "KWH" },
    { _id: 2, name: "Individual" },
    { _id: 3, name: "Power Interruption" },
    { _id: 4, name: "Distribution Line Equipment Services" },
    { _id: 5, name: "Line Services" },
    { _id: 6, name: "Load Management and Data Gathering Activities" },
    { _id: 7, name: "Billing" },
    { _id: 8, name: "Line Construction" },
];
