import { DocumentReference, getDoc, Timestamp } from 'firebase/firestore';
import IOrder from 'src/interfaces/IOrder';
import { PromotionsService } from 'src/promotions/promotions.service';
import Hotel from './Hotel';
import Promotion from './Promotion';
import Room from './Room';
import User from './User';

export default class Order implements IOrder {
  constructor(room: Room, hotel: Hotel) {
    this.room = room;
    this.hotel = hotel;
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
  order_status: 'processing' | 'complete' | 'canceled';
  payment_time: Timestamp;
  room: Room;
  user: User;
  order_start: Timestamp;
  order_end: Timestamp;
  created_at: Timestamp;

  promotion: Promotion;
  get total_hour_spend_real(): number {
    return (this.payment_time.seconds - this.order_start.seconds) / 3600;
  }
  get total_hour_spend_estimate(): number {
    return (this.order_end.seconds - this.order_start.seconds) / 3600;
  }
  get total_price_real(): number {
    return this.getTotalPrice('real');
  }
  get total_price_estimate(): number {
    return this.getTotalPrice('estimate');
  }
  getTotalPrice(type: 'real' | 'estimate'): number {
    let total = 0;
    const num_order_type =
      this.order_type == 'daily' ? 24 : this.order_type == 'overnight' ? 12 : 1;
    total =
      num_order_type == 24
        ? this.daily_price
        : num_order_type == 12
        ? this.overnight_price
        : this.hour_price;
    let waste_time =
      type === 'real'
        ? this.total_hour_spend_real
        : this.total_hour_spend_estimate - num_order_type;
    total +=
      waste_time > 0
        ? (~~waste_time + (waste_time - ~waste_time > 0 ? 1 : 0)) *
          this.hour_price_bonus
        : 0;
    return total * (1 - (this.promotion?.discount_ratio ?? 0));
  }
  async getDiscount(): Promise<void> {
    const promotionService = new PromotionsService();
    const listPro = (await promotionService.GetPromotionByHotel(this.hotel.id))
      .data;
    const currentTime = Timestamp.now();
    console.log(listPro);
    const listfiltered = listPro.filter((v) => {
      return v.order_type.includes(this.order_type) && v.time_end > currentTime;
    });
    let DisCountChosen = listfiltered[0];
    listfiltered.map((e) => {
      if (DisCountChosen.discount_ratio > e.discount_ratio) DisCountChosen = e;
    });
    this.promotion = DisCountChosen ?? null;
  }
}
