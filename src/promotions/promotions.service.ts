import { Injectable } from '@nestjs/common';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import db from 'src/db/db';
import Promotion from 'src/dto/Promotion';
import { HotelsService } from 'src/hotels/hotels.service';
import IPromotion from 'src/interfaces/IPromotions';

@Injectable()
export class PromotionsService {
  async GetPromotions() {
    try {
      const hotels = await getDocs(collection(db, 'hotels'));
      let promotionList = Array<Promotion>();
      await Promise.all(
        hotels.docs.map(async (d: any) => {
          const data = d.data();
          if (data.promotions)
            await Promise.all(
              data.promotions.map(async (p) => {
                const prmotionRef = await getDoc<Promotion>(p);
                const promotion: Promotion = prmotionRef.data();
                promotionList.push({
                  hotel_id: d.id,
                  ...promotion,
                  id: prmotionRef.id,
                });
              }),
            );
        }),
      );
      return { status: 200, data: promotionList };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async CreatePromotion(promotion: IPromotion, img: Express.Multer.File) {
    try {
      const HotelRef = doc(db, 'hotels', promotion.hotel_id);
      if (!(await getDoc(HotelRef)).exists())
        return { status: 201, desc: 'Hotel not found' };

      const storage = getStorage();
      const metadata = {
        contentType: 'image/jpeg',
      };
      const storageRef = ref(
        storage,
        `images/rooms/${Timestamp.now().toMillis()}`,
      );
      const snapshot = await uploadBytes(storageRef, img.buffer, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      promotion.img = downloadURL;
      promotion.created_at = Timestamp.now();
      const ProRef = await addDoc(collection(db, 'promotions'), promotion);
      await updateDoc(HotelRef, {
        promotions: arrayUnion(ProRef),
      });
      return { status: 200, data: { ...promotion, id: ProRef.id } };
    } catch (error) {
      return { status: 500, error };
    }
  }
  async EditPromotion(promotion: IPromotion, img: Express.Multer.File) {
    try {
      const ProRef = doc(db, 'promotions', promotion.id);
      if (!(await getDoc(ProRef)).exists())
        return { status: 201, desc: 'Hotel not found' };
      if (img) {
        const storage = getStorage();
        const metadata = {
          contentType: 'image/jpeg',
        };
        const storageRef = ref(
          storage,
          `images/rooms/${Timestamp.now().toMillis()}`,
        );
        const snapshot = await uploadBytes(storageRef, img.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        promotion.img = downloadURL;
      }

      await setDoc(ProRef, promotion);
      return { status: 200, data: promotion };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async DeletePromotion(HotelID: string, PromotionID: string) {
    try {
      const HotelRef = doc(db, 'hotels', HotelID);
      const ProRef = doc(db, 'promotions', PromotionID);
      if (
        !(await getDoc(HotelRef)).exists() ||
        !(await getDoc(ProRef)).exists()
      )
        return { status: 201, desc: "Hotel or promotion dosen't exist" };
      await updateDoc(HotelRef, {
        promotions: arrayRemove(ProRef),
      });
      await deleteDoc(ProRef);
      return { status: 200, desc: 'Successful' };
    } catch (error) {
      return { status: 500, error };
    }
  }
}
