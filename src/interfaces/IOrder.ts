import { DocumentReference, Timestamp } from '@firebase/firestore';
import Hotel from 'src/dto/Hotel';
import Room from 'src/dto/Room';
import User from 'src/dto/User';
export default interface IOrder {
  id: string;
  order_type: 'daily' | 'overnight' | 'hour';
  payment_time: Timestamp;
  hotel: Hotel;
  room: Room;
  user: User;
  overnight_price: number;
  daily_price: number;
  hour_price_bonus: number;
  order_status: 'processing' | 'complete' | 'canceled';
  hour_price: number;
  order_start: Timestamp;
  order_end: Timestamp;
  created_at: Timestamp;
}
