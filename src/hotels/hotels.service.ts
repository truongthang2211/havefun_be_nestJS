import { Get, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import db from 'src/db/db';
import {
  doc,
  setDoc,
  Timestamp,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { IHotel } from 'src/interfaces/IHotel';
import IRoom from 'src/interfaces/IRoom';
@Injectable()
export class HotelsService {
  async GetRefDocInArray(RefArray, SubRef = null) {
    if (RefArray) {
      let TempArray = [];
      await Promise.all(
        RefArray.map(async (r) => {
          if (r) {
            const TempRef = await getDoc(SubRef ? r[SubRef] : r);
            const data: {} = TempRef.data();
            TempArray.push(
              !SubRef ? { id: TempRef.id, ...data } : { ...r, [SubRef]: data },
            );
          }
        }),
      );
      return TempArray;
    }
  }
  async GetHotels() {
    try {
      const hotels = collection(db, 'hotels');
      const hotelsSnapshot = await getDocs(hotels);
      const listHotel = await Promise.all(
        hotelsSnapshot.docs.map(async (doc) => {
          const originData = doc.data();
          originData.rooms = await this.GetRefDocInArray(originData.rooms);
          originData.promotions = await this.GetRefDocInArray(
            originData.promotions,
          );
          originData.ratings = await this.GetRefDocInArray(
            originData.ratings,
            'user',
          );

          return { id: doc.id, ...originData };
        }),
      );
      return { status: 200, data: listHotel };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async GetHotelsById(id: string) {
    try {
      const hotels = doc(db, 'hotels', id);
      const hotelsSnapshot = await getDoc(hotels);
      let HotelData = null;
      if (hotelsSnapshot.exists()) {
        HotelData = hotelsSnapshot.data();
        HotelData.rooms = await this.GetRefDocInArray(HotelData.rooms);
        HotelData.promotions = await this.GetRefDocInArray(
          HotelData.promotions,
        );
        HotelData.ratings = await this.GetRefDocInArray(
          HotelData.ratings,
          'user',
        );
        HotelData.id = hotelsSnapshot.id;
      }
      return {
        status: 200,
        data: HotelData,
      };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async CreateHotel(motel: IHotel) {
    try {
      const HotelCreate = {
        ...motel,
        created_at: Timestamp.now(),
        rooms: [],
      };
      const docRef = await addDoc(collection(db, 'hotels'), HotelCreate);
      return { status: 200, data: { ...HotelCreate, hotel_id: docRef.id } };
    } catch (error) {
      return { status: 500, error };
    }
  }
  async AddRoom(Room: IRoom, HotelDocId: string) {
    try {
      const HotelRef = doc(db, 'hotels', HotelDocId);
      const RoomRefAdd = await addDoc(collection(db, 'rooms'), Room);
      const RoomAdded = doc(db, 'rooms', RoomRefAdd.id);
      await updateDoc(HotelRef, {
        rooms: arrayUnion(RoomAdded),
      });
      return { status: 200, data: RoomRefAdd.id };
    } catch (error) {
      return { status: 500, error };
    }
  }
  async DeleteRoom(RoomUuid: string, HotelDocId: string) {
    try {
      const HotelRef = doc(db, 'hotels', HotelDocId);
      const DocSnap = await getDoc(HotelRef);
      if (DocSnap.exists()) {
        const rooms = DocSnap.data();
      }
    } catch (error) {
      return { status: 500, error };
    }
  }
}
