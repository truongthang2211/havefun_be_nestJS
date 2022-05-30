import { Timestamp } from 'firebase/firestore';

export default interface IPromotion {
  name: string;
  description: string;
  img: string;
  time_start: Timestamp;
  time_end: Timestamp;
  created_at: Timestamp;
  discount_ratio: number;
  hotel_id: string;
  id: string;
  order_type: string[];
}
