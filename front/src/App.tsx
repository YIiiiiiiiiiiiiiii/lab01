import { useState, useEffect } from 'react';
import { apis } from './enum/api';
import { Reservation } from './interface/Reservasion';
import './App.css';
import { asyncGet } from './utils/fetch';

// 轉換 create_time 格式
function time_transfrom(time: string) {
  const date = new Date(time);
  return date.toLocaleString();
}

// main
function App() {

  const [reservations, setReservations] = useState<Array<Reservation>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    asyncGet(apis.getReservations).then((data: Array<Reservation>) => {
      setReservations(data);
      console.log(data);
    });

  }, []);

  const reservationsList = reservations
    ? reservations.map((r: Reservation) => {
      return (
        <div className="Card" key={r.reservation_id}>
          <p>學號: {r.student_id}</p>
          <p>姓名: {r.student_name}</p>
          <p>座位: {r.seat_id}</p>
          <p>時段: {r.start_time} ~ {r.end_time}</p>
          <p>創建時間: {time_transfrom(r.create_time)}</p>
        </div>
      );
    })
    : loading ? "loading" : "No data";

  return (
    <>
      <h1>Lab B310 預約清單</h1>
      <div className="main">
        {reservationsList}
      </div>
    </>
  );
}

export default App;