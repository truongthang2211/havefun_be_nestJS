import { Timestamp } from 'firebase/firestore';

export default interface ICreateOrder {
  hotelID: string;
  roomID: string;
  promotionID: string;
  userID: string;
  order_start: Timestamp;
  order_end: Timestamp;
}
