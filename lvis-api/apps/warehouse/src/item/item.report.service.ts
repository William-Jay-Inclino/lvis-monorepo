import { Injectable } from "@nestjs/common";
import { PrismaService } from "../__prisma__/prisma.service";
import { WarehouseAuditService } from "../warehouse_audit/warehouse_audit.service";
import { HttpService } from "@nestjs/axios";



@Injectable()
export class ItemReportService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async generateItemTransactionsSummary(payload: { startDate: string, endDate: string }) {

        console.log('generateItemTransactionsSummary', payload);
    
        const { startDate, endDate } = payload;
    
        const result = await this.prisma.$queryRaw`
          WITH starting_balance_cte AS (
              SELECT 
                  it.item_id, 
                  COALESCE(SUM(CASE WHEN it.type = 1 THEN it.quantity ELSE -it.quantity END), 0) AS starting_balance
              FROM item_transaction it
              WHERE it.created_at < ${startDate}::date
              GROUP BY it.item_id
          ),
      
          ending_balance_cte AS (
              SELECT 
                  it.item_id, 
                  COALESCE(SUM(CASE WHEN it.type = 1 THEN it.quantity ELSE -it.quantity END), 0) AS ending_balance
              FROM item_transaction it
              WHERE it.created_at <= ${endDate}::date
              GROUP BY it.item_id
          )
      
          SELECT
              TO_CHAR(it.created_at, 'DD Mon YYYY') AS date,
              i.code AS item_code, 
              i.description, 
              itype.name AS item_type, 
              unit.name AS unit,
              it.quantity,
              it.price AS unit_price,
              it.price * it.quantity AS total_price,
              (CASE WHEN it.type = 1 THEN 'Stock In' ELSE 'Stock Out' END) AS "type",
              CASE 
                  WHEN it.rr_item_id IS NOT NULL THEN CONCAT('RR#', rr.rr_number)
                  WHEN it.osriv_item_id IS NOT NULL THEN CONCAT('OSRIV#', osriv.osriv_number)
                  WHEN it.seriv_item_id IS NOT NULL THEN CONCAT('SERIV#', seriv.seriv_number)
                  WHEN it.mrv_item_id IS NOT NULL THEN CONCAT('MCT#', mct.mct_number)
                  WHEN it.mcrt_item_id IS NOT NULL THEN CONCAT('MCRT#', mcrt.mcrt_number)
                  WHEN it.mst_item_id IS NOT NULL THEN CONCAT('MST#', mst.mst_number)
                  ELSE 'N/A'  
              END AS reference_number,
              COALESCE(sb.starting_balance, 0) AS starting_balance,
              COALESCE(eb.ending_balance, 0) AS ending_balance,
              it.remarks
          FROM item_transaction it
          INNER JOIN item i ON i.id = it.item_id
          LEFT JOIN starting_balance_cte sb ON sb.item_id = it.item_id
          LEFT JOIN ending_balance_cte eb ON eb.item_id = it.item_id
          LEFT JOIN item_type itype ON itype.id = i.item_type_id  
          LEFT JOIN unit unit ON unit.id = i.unit_id            
          LEFT JOIN rr_item ON rr_item.id = it.rr_item_id             
          LEFT JOIN osriv_item ON osriv_item.id = it.osriv_item_id 
          LEFT JOIN seriv_item ON seriv_item.id = it.seriv_item_id  
          LEFT JOIN mrv_item ON mrv_item.id = it.mrv_item_id          
          LEFT JOIN mcrt_item ON mcrt_item.id = it.mcrt_item_id      
          LEFT JOIN mst_item ON mst_item.id = it.mst_item_id     
          LEFT JOIN receiving_report rr ON rr.id = rr_item.rr_id
          LEFT JOIN osriv ON osriv.id = osriv_item.osriv_id
          LEFT JOIN seriv ON seriv.id = seriv_item.seriv_id
          LEFT JOIN mrv ON mrv.id = mrv_item.mrv_id
          LEFT JOIN mct ON mct.mrv_id = mrv.id
          LEFT JOIN mcrt ON mcrt.id = mcrt_item.mcrt_id
          LEFT JOIN mst ON mst.id = mst_item.mst_id
          WHERE it.created_at BETWEEN ${startDate}::date AND ${endDate}::date
          ORDER BY date DESC;
        `;
        
        return result;
    }

}