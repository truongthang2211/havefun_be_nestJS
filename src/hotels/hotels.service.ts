import { Get, Injectable } from '@nestjs/common';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import db from 'src/db/db';
import {
  doc,
  Timestamp,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
  deleteDoc,
  DocumentData,
  QuerySnapshot,
  DocumentReference,
} from 'firebase/firestore';
import { IHotel } from 'src/interfaces/IHotel';
import IRoom from 'src/interfaces/IRoom';
import Hotel from 'src/dto/Hotel';
import Room from 'src/dto/Room';
@Injectable()
export class HotelsService {
  async GetRefDocInArray(RefArray, SubRef = null): Promise<any[]> {
    if (RefArray) {
      let TempArray = [];
      await Promise.all(
        RefArray.map(async (r) => {
          if (r) {
            const TempRef = await getDoc(SubRef ? r[SubRef] : r);
            const data: DocumentData = TempRef.data();
            TempArray.push(
              !SubRef ? { ...data, id: TempRef.id } : { ...r, [SubRef]: data },
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
      const hotelsSnapshot = (await getDocs(hotels)) as QuerySnapshot<Hotel>;
      const listHotel: Array<Hotel> = await Promise.all(
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

          return { ...originData, id: doc.id };
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
      const hotels = doc(db, 'hotels', id) as DocumentReference<Hotel>;
      const hotelsSnapshot = await getDoc<Hotel>(hotels);
      let HotelData: Hotel = null;
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
  async EditHotel(motel: IHotel, imgs: Array<Express.Multer.File>) {
    try {
      const HotelEdit = {
        ...motel,
        imgs: [],
      };
      if (!HotelEdit.id) return { status: 201, desc: 'id is required' };

      const hotelRef = doc(db, 'hotels', HotelEdit.id);
      if (!(await getDoc(hotelRef)).exists())
        return { status: 201, desc: 'Hotel not found' };
      const storage = getStorage();
      const metadata = {
        contentType: 'image/jpeg',
      };
      for (let i = 0; i < imgs.length; ++i) {
        const storageRef = ref(
          storage,
          `images/hotels/${Timestamp.now().toMillis()}`,
        );
        const snapshot = await uploadBytes(
          storageRef,
          imgs[i].buffer,
          metadata,
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        HotelEdit.imgs.push(downloadURL);
      }
      updateDoc(hotelRef, HotelEdit);
      return { status: 200, data: HotelEdit };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async CreateHotel(motel: IHotel, imgs: Array<Express.Multer.File>) {
    try {
      const HotelCreate = {
        ...motel,
        created_at: Timestamp.now(),
        rooms: [],
        imgs: [],
      };
      const storage = getStorage();
      const metadata = {
        contentType: 'image/jpeg',
      };
      for (let i = 0; i < imgs.length; ++i) {
        const storageRef = ref(
          storage,
          `images/hotels/${Timestamp.now().toMillis()}`,
        );
        const snapshot = await uploadBytes(
          storageRef,
          imgs[i].buffer,
          metadata,
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        HotelCreate.imgs.push(downloadURL);
      }

      const docRef = await addDoc(collection(db, 'hotels'), HotelCreate);
      return { status: 200, data: { ...HotelCreate, id: docRef.id } };
    } catch (error) {
      return { status: 500, error };
    }
  }
  async AddRoom(
    room: Room,
    HotelDocId: string,
    imgs: Array<Express.Multer.File>,
  ) {
    try {
      const storage = getStorage();
      const metadata = {
        contentType: 'image/jpeg',
      };
      const HotelRef = doc(db, 'hotels', HotelDocId);
      if (!(await getDoc(HotelRef)).exists())
        return { status: 201, desc: 'Hotel not found' };
      for (let i = 0; i < imgs.length; ++i) {
        const storageRef = ref(
          storage,
          `images/rooms/${Timestamp.now().toMillis()}`,
        );
        const snapshot = await uploadBytes(
          storageRef,
          imgs[i].buffer,
          metadata,
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        room.imgs.push(downloadURL);
      }
      room.created_at = Timestamp.now();
      const RoomRefAdd = await addDoc(collection(db, 'rooms'), room);
      const RoomAdded = doc(db, 'rooms', RoomRefAdd.id);
      await updateDoc(HotelRef, {
        rooms: arrayUnion(RoomAdded),
      });

      return { status: 200, data: { ...room, id: RoomRefAdd.id } };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async EditRoom(room: Room, imgs: Array<Express.Multer.File>) {
    try {
      const storage = getStorage();
      const metadata = {
        contentType: 'image/jpeg',
      };
      if (!room.id) return { status: 201, desc: 'room_id is required' };
      const RoomRef = doc(db, 'rooms', room.id);
      if (!(await getDoc(RoomRef)).exists())
        return { status: 201, desc: 'room not found' };
      for (let i = 0; i < imgs.length; ++i) {
        const storageRef = ref(
          storage,
          `images/rooms/${Timestamp.now().toMillis()}`,
        );
        const snapshot = await uploadBytes(
          storageRef,
          imgs[i].buffer,
          metadata,
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        room.imgs.push(downloadURL);
      }

      await updateDoc(RoomRef, { ...room });
      return { status: 200, data: room };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async DeleteRoom(RoomID: string, HotelID: string) {
    try {
      const HotelRef = doc(db, 'hotels', HotelID);
      const RoomRef = doc(db, 'rooms', RoomID);
      if (
        !(await getDoc(HotelRef)).exists() ||
        !(await getDoc(RoomRef)).exists()
      ) {
        return { status: 201, desc: 'Room or Hotel not found' };
      }
      await updateDoc(HotelRef, {
        rooms: arrayRemove(RoomRef),
      });
      await deleteDoc(RoomRef);
      return { status: 200, desc: 'Successful' };
    } catch (error) {
      return { status: 500, error };
    }
  }
}
