import React, { useState } from 'react';

interface VariantSelection {
  size: string | null;
  color: string | null;
}

interface ProductVariantsProps {
  product: {
    sizes?: { size: string; stock: number }[];
    colors?: { name: string; hexCode?: string; stock: number }[];
    stock?: number;
  };
  onVariantChange: (selection: VariantSelection) => void;
  selectedSize: string;
  selectedColor: string;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ product, onVariantChange, selectedSize, selectedColor }) => {
  const [showAllColors, setShowAllColors] = useState(false);

  const handleSizeSelect = (size: string) => {
    onVariantChange({
      size: selectedSize === size ? null : size,
      color: selectedColor
    });
  };

  const handleColorSelect = (colorName: string) => {
    onVariantChange({
      size: selectedSize,
      color: selectedColor === colorName ? null : colorName
    });
  };

  const getAvailableColors = () => {
    if (!product.colors) return [];
    return showAllColors ? product.colors : product.colors.slice(0, 6);
  };

  const getSizeStock = (size: string) => {
    if (!product.sizes) return product.stock || 0;
    const sizeVariant = product.sizes.find(s => s.size === size);
    return sizeVariant ? sizeVariant.stock : 0;
  };

  const isSizeAvailable = (size: string) => {
    return getSizeStock(size) > 0;
  };

  const isColorAvailable = (colorName: string) => {
    if (!product.colors) return true;
    const colorVariant = product.colors.find(c => c.name === colorName);
    return colorVariant ? colorVariant.stock > 0 : true;
  };

  if (!product.sizes && !product.colors) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Selector de Tallas */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Talla
              {selectedSize && (
                <span className="ml-2 text-sm text-gray-600">
                  ({getSizeStock(selectedSize)} disponibles)
                </span>
              )}
            </h3>
            <button
              onClick={() => onVariantChange({ size: null, color: selectedColor })}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {product.sizes.map((size) => {
              const isAvailable = isSizeAvailable(size.size);
              const isSelected = selectedSize === size.size;

              return (
                <button
                  key={size.size}
                  onClick={() => isAvailable && handleSizeSelect(size.size)}
                  disabled={!isAvailable}
                  className={`
                    relative px-3 py-2 text-sm font-medium rounded-lg border transition-all
                    ${isSelected
                      ? 'bg-black text-white border-black'
                      : isAvailable
                      ? 'border-gray-300 hover:border-gray-400 text-gray-900'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    }
                  `}
                >
                  {size.size}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Guía de tallas */}
          <div className="mt-3 text-xs text-gray-600">
            <button className="underline hover:text-gray-800">
              Guía de tallas
            </button>
          </div>
        </div>
      )}

      {/* Selector de Colores */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Color
              {selectedColor && (
                <span className="ml-2 text-sm text-gray-600">
                  {selectedColor}
                </span>
              )}
            </h3>
            <button
              onClick={() => onVariantChange({ size: selectedSize, color: null })}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {getAvailableColors().map((color) => {
              const isAvailable = isColorAvailable(color.name);
              const isSelected = selectedColor === color.name;

              return (
                <button
                  key={color.name}
                  onClick={() => isAvailable && handleColorSelect(color.name)}
                  disabled={!isAvailable}
                  className={`
                    relative group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                    ${isSelected
                      ? 'bg-black text-white border-black'
                      : isAvailable
                      ? 'border-gray-300 hover:border-gray-400 text-gray-900'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    }
                  `}
                >
                  {/* Círculo de color */}
                  <div
                    className={`
                      w-4 h-4 rounded-full border-2 border-white shadow-sm
                      ${isAvailable ? '' : 'opacity-50'}
                    `}
                    style={{ backgroundColor: color.hexCode }}
                  />

                  {/* Nombre del color */}
                  <span className="text-sm font-medium">{color.name}</span>

                  {/* Indicador de no disponible */}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Botón para mostrar más colores */}
            {product.colors.length > 6 && !showAllColors && (
              <button
                onClick={() => setShowAllColors(true)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                +{product.colors.length - 6} más
              </button>
            )}
          </div>
        </div>
      )}

      {/* Información de variantes seleccionadas */}
      {(selectedSize || selectedColor) && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selección actual:</h4>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {selectedSize && (
              <div>
                <span className="font-medium">Talla:</span> {selectedSize}
                <span className="ml-2 text-gray-600">
                  ({getSizeStock(selectedSize)} disponibles)
                </span>
              </div>
            )}
            {selectedColor && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Color:</span>
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{
                    backgroundColor: product.colors?.find(c => c.name === selectedColor)?.hexCode
                  }}
                />
                {selectedColor}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;