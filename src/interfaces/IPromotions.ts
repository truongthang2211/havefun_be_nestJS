import { Timestamp } from 'firebase/firestore';

export default interface IPromotion {
  name: string;
  description: string;
  img: string;
  promotion_start: Timestamp;
  promotion_end: Timestamp;
  created_at: Timestamp;
  discount_ratio: number;
}
