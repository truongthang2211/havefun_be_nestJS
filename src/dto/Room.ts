import { Timestamp } from 'firebase/firestore';
import IRoom from 'src/interfaces/IRoom';

export default class Room implements IRoom {
  id: string;
  overnight_price: number;
  daily_price: number;
  hour_price_bonus: number;
  description: string;
  imgs: string[];
  facilities: {
    wifi: boolean;
    wood_floor: boolean;
    tv: boolean;
    reception24: boolean;
    elevator: boolean;
    cable_tv: boolean;
    air_conditioning: boolean;
  };
  hour_price: number;
  created_at: Timestamp;
  room_conditions: [
    { area_20m2: boolean; double_bed: boolean; window: boolean },
  ];
  name: string;
  room_type: string;
}
