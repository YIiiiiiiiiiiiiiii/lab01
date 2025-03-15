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
        const search_query = 
                `SELECT
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
            ;`
        await DB.connection?.query("USE lab_b310;");

        // 執行查詢
        const result = await DB.connection?.query(search_query);
        res.send(result);
    }
}