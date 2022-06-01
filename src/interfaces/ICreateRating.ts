import { Timestamp } from 'firebase/firestore';

export default interface ICreateRating {
  comment: string;
  start: number;
  user_id: string;
  hotel_id: string;
}
