import { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Card, ListGroup } from 'react-bootstrap';
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
  const [search, setSearch] = useState<string>('');
  const [filteredReservations, setFilteredReservations] = useState<Array<Reservation>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 取得所有預約
  useEffect(() => {
    let ignore = false;

    const fetchReservations = async () => {
      try {
        console.log("發送 GET 請求至: ", apis.getReservations);
        const data = await asyncGet(apis.getReservations);
        console.log("取得的資料: ", data);
    
        if (!ignore && Array.isArray(data)) {
          setReservations(data);
          setFilteredReservations(data);
          setLoading(false);
        } else {
          console.error("資料格式不正確，期望 Array。");
        }
      } catch (error) {
        console.error("取得預約資料失敗: ", error);
        setLoading(false);
      }
    };

    fetchReservations();
    
    return () => {
      ignore = true;
    };
  }, []);
  
  // 搜尋過濾資料
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredReservations(reservations); // 沒有輸入則顯示全部
    } else {
      const filtered = reservations.filter(r =>
        r.student_id.includes(search)
      );
      setFilteredReservations(filtered);
    }
  }, [search, reservations]);

  //subTitle, search
  const subTitle = (
    <>
      <h2>Reservations ({filteredReservations.length})</h2>
      <InputGroup className="input mb-3">
        <Form.Control
          placeholder="Enter Student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary">搜尋</Button>
      </InputGroup>
    </>
  );

  const reservationsList = filteredReservations.length > 0
    ? filteredReservations.map((r: Reservation) => (
        <Card className="Card" style={{ width: '18rem', marginBottom: '1rem' }} key={r.reservation_id}>
          <Card.Img variant="top" src="images/card.jpg" />
          <Card.Body>
            <Card.Title>Reservation {r.reservation_id}</Card.Title>
            <hr />
            <Card.Text>
              <ListGroup variant='flush'>
                <ListGroup.Item>學號：{r.student_id}</ListGroup.Item>
                <ListGroup.Item>姓名：{r.student_name}</ListGroup.Item>
                <ListGroup.Item>座位：{r.seat_id}</ListGroup.Item>
                <ListGroup.Item>時段：{r.timeslot_id} ({r.start_time}~{r.end_time})</ListGroup.Item>
                <ListGroup.Item>創建時間：{time_transfrom(r.create_time || '')}</ListGroup.Item>
              </ListGroup>
            </Card.Text>
          </Card.Body>
        </Card>
      ))
    : loading ? "loading..." : "No Reservations Found.";

  return (
    <>
      <div className="title">
        <h1>Lab B310 Reservations List</h1>
      </div>
      <div className="sub-title">
        {subTitle}
      </div>
      <div className="main">
        {reservationsList}
      </div>
    </>
  );
}

export default App;
