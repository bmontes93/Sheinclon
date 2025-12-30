import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id!: string; // Using _id to keep compatibility with existing code

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column('simple-json', { nullable: true })
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };

  @Column('simple-json', { default: '[]' })
  wishlist!: string[]; // Array of Product IDs

  @Column('simple-json', { default: '[]' })
  cart!: {
    product: string; // Product ID
    quantity: number;
    size?: string;
    color?: string;
  }[];

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Methods
  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  getSignedJwtToken(): string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRE || '30d') as any,
    });
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2a$')) { // Basic check if already hashed
       // In TypeORM hooks, we need to be careful. Ideally we only hash if modified.
       // Since TypeORM doesn't have isModified('password'), we usually handle hashing in Service.
       // But to mimic Mongoose 'pre-save', we can try.
       // However, strictly speaking, it's safer to move hashing to AuthService to avoid re-hashing on updates.
       // For now, removing auto-hash here and expecting Service to handle it is better practice in SQL.
       // But I will keep the method for manual call if needed or move logic to Service.
    }
  }
}

export interface IUser extends User {}
