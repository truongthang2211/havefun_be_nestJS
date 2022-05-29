import { DocumentReference, getDoc, Timestamp } from 'firebase/firestore';
import IOrder from 'src/interfaces/IOrder';
import { PromotionsService } from 'src/promotions/promotions.service';
import Hotel from './Hotel';
import Room from './Room';
import User from './User';

export default class Order implements IOrder {
  constructor(room: Room) {
    this.daily_price = room.daily_price;
    this.hour_price = room.hour_price;
    this.overnight_price = room.overnight_price;
    this.hour_price_bonus = room.hour_price_bonus;
  }
  overnight_price: number;
  daily_price: number;
  hour_price_bonus: number;
  hour_price: number;
  hotel: Hotel;
  id: string;
  order_type: 'daily' | 'overnight' | 'hour';
  order_status: 'processing' | 'paid';
  payment_time: Timestamp;
  room: Room;
  user: User;
  order_start: Timestamp;
  order_end: Timestamp;
  created_at: Timestamp;
  get total_hour_spend_real(): number {
    return (this.payment_time.seconds - this.order_start.seconds) / 3600;
  }
  get total_hour_spend_estimate(): number {
    return (this.payment_time.seconds - this.order_start.seconds) / 3600;
  }
  get total_price_real(): Promise<number> {
    return (async () => {
      return this.total_price_estimate * (1 - (await this.getDiscount()));
    })();
  }
  get total_price_estimate(): number {
    let total = 0;
    const num_order_type =
      this.order_type == 'daily' ? 24 : this.order_type == 'overnight' ? 12 : 1;
    total =
      num_order_type == 24
        ? this.daily_price
        : num_order_type == 12
        ? this.overnight_price
        : this.hour_price;
    let waste_time = this.total_hour_spend_estimate;

    total +=
      waste_time > 0
        ? (~~waste_time + (waste_time - ~~waste_time > 0 ? 1 : 0)) *
          this.hour_price_bonus
        : 0;
    return total;
  }

  async getDiscount(): Promise<number> {
    const promotionService = new PromotionsService();
    const listPro = (await promotionService.GetPromotions()).data;
    const HotelID = this.hotel.id;
    const listfiltered = listPro.filter((v) => {
      const check1 = v.order_type === this.order_type || v.order_type === 'all';
      const check2 =
        v.hotel_id === HotelID && v.promotion_end > Timestamp.now();
      return check1 && check2;
    });
    return Math.max(...listfiltered.map((i) => i.discount_ratio));
  }
}
