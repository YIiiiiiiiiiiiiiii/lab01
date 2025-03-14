import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { logger } from "../middlewares/log";
import { Service } from "../abstract/Service";
import { PageService } from "../Service/PageService";
import { DB } from "../app";
require('dotenv').config();

export class ReservationsController extends Contorller {
    protected service: Service;

    constructor() {
        super();
        this.service = new PageService();
    }

    public async test(req: Request, res: Response) {
        try {
            if (!DB.connection) {
                throw new Error("Database connection is not established.");
            }
    
            const testConnection = await DB.connection.query("SELECT 1;");
            if (!testConnection) {
                throw new Error("Failed to execute a simple test query.");
            }
    
            const search_query = `
                SELECT
                    r.reservation_id,
                    r.student_id,
                    (SELECT s.student_name FROM lab_b310.Students s WHERE r.student_id=s.student_id) AS student_name,
                    r.seat_id,
                    r.timeslot_id,
                    (SELECT t.start_time FROM lab_b310.Timeslots t WHERE r.timeslot_id=t.timeslot_id) AS start_time,
                    (SELECT t.end_time FROM lab_b310.Timeslots t WHERE r.timeslot_id=t.timeslot_id) AS end_time,
                    r.create_time 
                FROM 
                    lab_b310.Reservations r;
            `;
            await DB.connection.query("USE lab_b310;");
            
            // 執行查詢
            const result = await DB.connection.query(search_query);
    
            // 查看 result 本身、類型、以及內部結構
            console.log("Query Result (raw):", result);
            console.log("Type of Result:", typeof result);
            console.log("Is Array:", Array.isArray(result));
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ result });  
        } catch (error: unknown) {
            logger.error("Database query error: ", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred." });
     
            }
        }    
    }
}