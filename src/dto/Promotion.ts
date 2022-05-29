import { Timestamp } from 'firebase/firestore';
import IPromotion from 'src/interfaces/IPromotions';

export default class Promotion implements IPromotion {
  name: string;
  description: string;
  img: string;
  promotion_start: Timestamp;
  promotion_end: Timestamp;
  created_at: Timestamp;
  discount_ratio: number;
  hotel_id: string;
  id: string;
  order_type: 'overnight' | 'hour' | 'daily' | 'all';
}
