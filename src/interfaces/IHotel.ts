import { Timestamp } from 'firebase/firestore';
import IPromotion from './IPromotions';
import IRoom from './IRoom';

export interface IHotel {
  hotel_doc_id: string;
  name: string;
  description: string;
  created_at: Timestamp;
  location: {
    address: string;
    village: string;
    city: string;
    district: string;
  };
  rooms: IRoom[];
  imgs: string[];
  promotions: IPromotion[];
}
