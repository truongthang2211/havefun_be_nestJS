import { Injectable } from '@nestjs/common';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import db from 'src/db/db';
import { HotelsService } from 'src/hotels/hotels.service';

@Injectable()
export class PromotionsService {
  async GetPromotions() {
    try {
      const hotels = await getDocs(collection(db, 'hotels'));
      let promotionList = [];
      await Promise.all(
        hotels.docs.map(async (d: any) => {
          const data = d.data();
          await Promise.all(
            data.promotions.map(async (p) => {
              const prmotionRef = await getDoc(p);
              const promotion: {} = prmotionRef.data();
              promotionList.push({ hotel_id: d.id, ...promotion });
            }),
          );
        }),
      );
      return { status: 200, promotionList };
    } catch (error) {
      return { status: 200, error };
    }
  }
}
