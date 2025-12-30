import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}



export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para acceder a esta ruta',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      const user = await User.findOneBy({ _id: decoded.id });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado',
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Cuenta desactivada',
        });
      }

      // @ts-ignore
      delete user.password;


      (req as any).user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token no válido',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requieren permisos de administrador',
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        const user = await User.findOneBy({ _id: decoded.id });

        if (user && user.isActive) {
           // @ts-ignore
           delete user.password;
          (req as any).user = user;
        }
      } catch (error) {
        // Token inválido, continuar sin usuario
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const owner = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user && (user._id.toString() === req.params.id || user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'No tienes permisos para acceder a este recurso',
    });
  }
};
