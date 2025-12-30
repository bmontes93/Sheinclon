import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ default: 'percentage' })
  type!: 'percentage' | 'fixed';

  @Column('decimal')
  value!: number;

  @Column({ nullable: true })
  minPurchase?: number;

  @Column({ nullable: true })
  maxDiscount?: number;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 0 })
  usageLimit!: number; // 0 = unlimited

  @Column({ default: 0 })
  usageCount!: number;

  @Column('simple-json', { default: '[]' })
  applicableProducts!: string[];

  @Column('simple-json', { default: '[]' })
  excludedProducts!: string[];

  @Column('simple-json', { default: '[]' })
  applicableCategories!: string[];
  
  @Column()
  createdBy!: string; // User ID
  
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Methods
  isValid(userId?: string | null, purchaseAmount?: number): boolean {
    if (!this.isActive) return false;
    if (this.startDate && new Date() < this.startDate) return false;
    if (this.endDate && new Date() > this.endDate) return false;
    if (this.usageLimit > 0 && this.usageCount >= this.usageLimit) return false;
    if (this.minPurchase && (purchaseAmount || 0) < this.minPurchase) return false;
    
    // User validation would require checking usage history which we might not have linked yet directly
    return true;
  }

  calculateDiscount(subtotal: number, items: any[] = []): number {
      let discount = 0;
      if (this.type === 'percentage') {
        discount = (subtotal * this.value) / 100;
        if (this.maxDiscount && discount > this.maxDiscount) {
          discount = this.maxDiscount;
        }
      } else if (this.type === 'fixed') {
        discount = this.value;
      }
      return discount;
  }

  appliesToProducts(items: any[]): boolean {
    if (!this.applicableProducts.length && !this.applicableCategories.length) {
        return true;
      }
    
      return items.some((item) => {
        if (this.excludedProducts.some((excludedId) => excludedId.toString() === item.productId?.toString())) {
          return false;
        }
    
        if (this.applicableProducts.length > 0) {
          if (this.applicableProducts.some((productId) => productId.toString() === item.productId?.toString())) {
            return true;
          }
        }
    
        if (this.applicableCategories.length > 0) {
          if (this.applicableCategories.includes(item.category)) {
            return true;
          }
        }
    
        return false;
      });
  }

  async incrementUsage() {
      this.usageCount += 1;
      return this.save();
  }
}

export interface ICoupon extends Coupon {}
