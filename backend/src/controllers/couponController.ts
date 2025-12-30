import { Request, Response, NextFunction } from 'express';
import * as couponService from '../services/couponService';

export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const result = await couponService.getCoupons(page, pageSize);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404);
      throw new Error('Cupón no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.createCoupon((req as any).user?._id as string, req.body);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404);
      throw new Error('Cupón no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await couponService.deleteCoupon(req.params.id);
    if (success) {
      res.json({ message: 'Cupón eliminado' });
    } else {
      res.status(404);
      throw new Error('Cupón no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, items, subtotal } = req.body;
    if (!code) throw new Error('Por favor ingresa un código de cupón');

    const result = await couponService.validateCoupon(
      code,
      (req as any).user?._id as string,
      subtotal,
      items
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message.includes('Cupón') || error.message.includes('código')) {
      res.status(400);
    }
    next(error);
  }
};

export const getAvailableCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await couponService.getAvailableCoupons();
    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};
