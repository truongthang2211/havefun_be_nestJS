import { Timestamp, DocumentReference } from 'firebase/firestore';
import { IHotel } from 'src/interfaces/IHotel';
import IPromotion from 'src/interfaces/IPromotions';
import IRoom from 'src/interfaces/IRoom';
import Promotion from './Promotion';
import Rating from './Rating';
import Room from './Room';

export default class Hotel implements IHotel {
  ratings: Rating[];
  rooms: Room[];
  promotions: Promotion[];
  id: string;
  name: string;
  description: string;
  created_at: Timestamp;
  location: {
    address: string;
    village: string;
    city: string;
    district: string;
  };
  imgs: string[];
}
