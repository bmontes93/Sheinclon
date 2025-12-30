import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart((req as any).user?._id as string);
    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const cart = await cartService.addToCart(
      (req as any).user?._id as string,
      productId,
      Number(quantity) || 1,
      size,
      color
    );
    res.json({
      success: true,
      data: cart,
      message: 'Producto agregado al carrito',
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.itemId; // Changed from productId to itemId for precision
    const cart = await cartService.updateCartItem(
      (req as any).user?._id as string,
      cartItemId,
      Number(quantity)
    );
    res.json({
      success: true,
      data: cart,
      message: 'Carrito actualizado',
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartItemId = req.params.itemId;
    const cart = await cartService.removeFromCart((req as any).user?._id as string, cartItemId);
    res.json({
      success: true,
      data: cart,
      message: 'Ítem eliminado del carrito',
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.clearCart((req as any).user?._id as string);
    res.json({
      success: true,
      message: 'Carrito limpiado',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
