import { KwhMeterLineman } from "../../td_kwh_meter_lineman/entities/kwh_meter_lineman.entity";
import { PowerInterruptionLineman } from "../../td_power_interruption_lineman/entities/power_interruption_lineman.entity";
import { DlesLineman } from "../../td_dles_lineman/entities/dles_lineman.entity";
import { LmdgaLineman } from "../../td_lmdga_lineman/entities/lmdga_lineman.entity";
import { LineServicesLineman } from "../../td_line_services_lineman/entities/line_services_lineman.entity";


export type LinemanTask = PowerInterruptionLineman | KwhMeterLineman | LineServicesLineman | DlesLineman | LmdgaLineman