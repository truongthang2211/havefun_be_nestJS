import { Timestamp } from 'firebase/firestore';
import IPromotion from 'src/interfaces/IPromotions';

export default class Promotion implements IPromotion {
  constructor() {
    this.discount_ratio = 0;
  }
  order_type: string[];
  time_start: Timestamp;
  time_end: Timestamp;
  name: string;
  description: string;
  img: string;
  created_at: Timestamp;
  discount_ratio: number;
  hotel_id: string;
  id: string;
}
