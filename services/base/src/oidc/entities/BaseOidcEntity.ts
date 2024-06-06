import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

export class BaseOidcEntity {
  @PrimaryColumn()
  id: string

  @Column({ type: 'json', nullable: true })
  data?: Record<string, any>

  @Column({ nullable: true })
  expiresAt?: Date

  @Column({ nullable: true })
  consumedAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

      @DeleteDateColumn()
  deleted: Date
}
