import Coupon, { ICoupon } from '../models/Coupon';
import User from '../models/User';

export const getCoupons = async (page: number, pageSize: number) => {
  const [coupons, total] = await Coupon.findAndCount({
    order: { createdAt: 'DESC' },
    take: pageSize,
    skip: (pageSize * (page - 1)),
  });

  // We need to fetch 'createdBy' user names manually if needed, or if we stored ID.
  // Coupon model store createdBy as string.
  // We can populate manually.
  
  // Not strictly necessary for basic listing.

  return {
    coupons,
    page,
    pages: Math.ceil(total / pageSize),
    total,
  };
};

export const getCouponById = async (id: string) => {
  return await Coupon.findOneBy({ _id: id });
};

export const createCoupon = async (userId: string, data: Partial<ICoupon>) => {
  const coupon = Coupon.create({
    ...(data as any),
    createdBy: userId,
  });
  return await coupon.save();
};

export const updateCoupon = async (id: string, data: Partial<ICoupon>) => {
  const coupon = await Coupon.findOneBy({ _id: id });
  if (!coupon) return null;

  Coupon.merge(coupon, data);
  return await coupon.save();
};

export const deleteCoupon = async (id: string) => {
  const result = await Coupon.delete({ _id: id });
  return result.affected ? result.affected > 0 : false;
};

export const validateCoupon = async (
  code: string,
  userId: string,
  subtotal: number,
  items: any[]
) => {
  const coupon = await Coupon.findOneBy({ code });

  if (!coupon) {
    throw new Error('Cupón no encontrado o inválido');
  }

  if (!coupon.isValid(userId, subtotal)) {
      // Logic duplicated for error message granularity if desired
      throw new Error('Cupón no válido para esta compra');
  }

  if (!coupon.appliesToProducts(items)) {
     throw new Error('Este cupón no aplica a los productos en tu carrito');
  }

  const discount = coupon.calculateDiscount(subtotal, items);
  
  return {
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
    },
    discount,
    finalTotal: Math.max(0, subtotal - discount),
  };
};

export const getAvailableCoupons = async () => {
    // Queries are more complex in TypeORM for "Active AND (EndDate > Now OR EndDate is Null)"
    // We use QueryBuilder for "OR IS NULL" usually
    return await Coupon.createQueryBuilder("coupon")
        .where("coupon.isActive = :isActive", { isActive: true })
        .andWhere("(coupon.endDate >= :now OR coupon.endDate IS NULL)", { now: new Date() })
        .getMany();
};
