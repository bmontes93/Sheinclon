import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export interface ISizeVariant {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
  sku?: string;
}

export interface IColorVariant {
  name: string;
  hexCode?: string;
  stock: number;
}

export interface IReview {
  user: string; // User ID
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('decimal')
  price!: number;

  @Column('decimal', { nullable: true })
  originalPrice?: number;

  @Column()
  category!: string;

  @Column()
  imageUrl!: string;

  @Column('simple-json', { default: '[]' })
  images!: string[];

  @Column('int', { default: 0 })
  stock!: number;

  @Column('simple-json', { default: '[]' })
  sizes!: ISizeVariant[];

  @Column('simple-json', { default: '[]' })
  colors!: IColorVariant[];

  @Column('simple-json', { default: '[]' })
  reviews!: IReview[];

  @Column('float', { default: 0 })
  rating!: number;

  @Column('int', { default: 0 })
  numReviews!: number;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column('simple-json', { default: '[]' })
  tags!: string[];

  @Column({ default: 'SHEIN' })
  brand!: string;

  @Column({ nullable: true })
  sku?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Virtuals replacement
  get isOnSale(): boolean {
    return !!(this.originalPrice && this.originalPrice > this.price);
  }

  get discountPercentage(): number {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
  }

  // Methods
  async reduceStock(quantity: number, size: string | null = null, color: string | null = null) {
      if (size && this.sizes && this.sizes.length > 0) {
        const sizeVariant = this.sizes.find((s) => s.size === size);
        if (!sizeVariant) throw new Error(`Talla ${size} no disponible`);
        if (sizeVariant.stock < quantity) throw new Error(`Stock insuficiente para talla ${size}`);
        sizeVariant.stock -= quantity;
        // Need to re-assign to trigger update in TypeORM with simple-json
        this.sizes = [...this.sizes]; 
      } else if (color && this.colors && this.colors.length > 0) {
        const colorVariant = this.colors.find((c) => c.name === color);
        if (!colorVariant) throw new Error(`Color ${color} no disponible`);
        if (colorVariant.stock < quantity) throw new Error(`Stock insuficiente para color ${color}`);
        colorVariant.stock -= quantity;
        this.colors = [...this.colors];
      } else {
        if (this.stock < quantity) throw new Error('Stock insuficiente');
        this.stock -= quantity;
      }
      return this.save();
  }

  async increaseStock(quantity: number, size: string | null = null, color: string | null = null) {
      if (size && this.sizes && this.sizes.length > 0) {
        const sizeVariant = this.sizes.find((s) => s.size === size);
        if (sizeVariant) {
             sizeVariant.stock += quantity;
             this.sizes = [...this.sizes];
        }
      } else if (color && this.colors && this.colors.length > 0) {
        const colorVariant = this.colors.find((c) => c.name === color);
        if (colorVariant) {
            colorVariant.stock += quantity;
            this.colors = [...this.colors];
        }
      } else {
        this.stock += quantity;
      }
      return this.save();
  }

  getAvailableStock(size: string | null = null, color: string | null = null): number {
    if (size && this.sizes && this.sizes.length > 0) {
      const sizeVariant = this.sizes.find((s) => s.size === size);
      return sizeVariant ? sizeVariant.stock : 0;
    } else if (color && this.colors && this.colors.length > 0) {
      const colorVariant = this.colors.find((c) => c.name === color);
      return colorVariant ? colorVariant.stock : 0;
    }
    return this.stock;
  }
}

export interface IProduct extends Product {}
