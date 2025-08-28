const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para proteger rutas - requiere autenticación
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si hay token en headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si hay token en cookies (opcional)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para acceder a esta ruta',
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      const user = await User.findById(decoded.id).select('-password');

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

      req.user = user;
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

// Middleware para verificar rol de administrador
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requieren permisos de administrador',
    });
  }
};

// Middleware opcional - permite acceso si está autenticado pero no requiere
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token inválido, continuar sin usuario
        console.log('Token opcional inválido:', error.message);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar propiedad del recurso
const owner = (req, res, next) => {
  if (req.user && (req.user._id.toString() === req.params.id || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'No tienes permisos para acceder a este recurso',
    });
  }
};

module.exports = {
  protect,
  admin,
  optionalAuth,
  owner,
};