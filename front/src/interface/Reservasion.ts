export interface Reservation {
    reservation_id: number; // 預約編號（INT，自動遞增）
    student_id: string;     // 學生編號（外鍵，對應 Students.student_id)
    student_name: string;   // 學生姓名（VARCHAR(50) NOT NULL）
    seat_id: number;        // 座位編號（外鍵，對應 Seats.seat_id）
    timeslot_id: number;    // 時段編號（外鍵，對應 Timeslots.timeslot_id）
    start_time: string;     // 開始時間（Time NOT NULL）
    end_time: string;       // 結束時間（Time NOT NULL）
    create_time: string;   // 創建時間（DATETIME），預設為 CURRENT_TIMESTAMP，選用可選屬性
}