import { DocumentReference, Timestamp } from 'firebase/firestore';
import Promotion from 'src/dto/Promotion';
import Rating from 'src/dto/Rating';
import Room from 'src/dto/Room';
import IPromotion from './IPromotions';
import IRoom from './IRoom';

export interface IHotel {
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
  rooms: Room[];
  promotions: Promotion[];
  ratings: Rating[];
  imgs: string[];
}
