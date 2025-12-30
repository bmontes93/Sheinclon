import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        },
        token: userData.token,
      },
    });
  } catch (error: any) {
    if (error.message === 'El email ya está registrado') {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Por favor ingresa email y contraseña');
    }

    const userData = await authService.loginUser({ email, password });

    res.json({
      success: true,
      data: {
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        },
        token: userData.token,
      },
    });
  } catch (error: any) {
    if (error.message === 'Credenciales inválidas' || error.message.includes('desactivada')) {
      res.status(401);
    }
    next(error);
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserProfile((req as any).user?._id as string);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await authService.updateUserProfile((req as any).user?._id as string, req.body);

    res.json({
      success: true,
      data: {
        user: {
          _id: updatedUser?._id,
          name: updatedUser?.name,
          email: updatedUser?.email,
          role: updatedUser?.role,
          address: updatedUser?.address,
        },
      },
    });
  } catch (error: any) {
    if (error.message === 'El email ya está en uso') {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Por favor ingresa la contraseña actual y la nueva');
    }

    await authService.changePassword((req as any).user?._id as string, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error: any) {
    if (error.message === 'La contraseña actual es incorrecta') {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Cerrar sesión (cliente-side)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Agregar/quitar producto de wishlist
// @route   PUT /api/auth/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const result = await authService.toggleWishlist((req as any).user?._id as string, productId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener wishlist del usuario
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlist = await authService.getWishlist((req as any).user?._id as string);

    res.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};
