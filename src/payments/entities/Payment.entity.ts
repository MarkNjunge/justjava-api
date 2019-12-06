import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "payments" })
export class PaymentEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "order_id" })
  orderId: number;

  @Column({ name: "initialized_by" })
  initializedBy: number;

  @Column()
  method: string;

  @Column()
  status: string;

  @Column({ type: "real" })
  amount: number;

  @Column({ name: "transaction_ref" })
  transactionRef: string;

  @Column({ name: "date_created" })
  dateCreated: number;

  @Column({ name: "payment_result", nullable: true })
  paymentResult: string;

  @Column({ name: "payment_ref", nullable: true })
  paymentRef: string;

  @Column({ name: "payer_ref", nullable: true })
  payerRef: string;

  @Column({ name: "date_updated", nullable: true })
  dateUpdated: number;

  @Column({ name: "raw_result", type: "text", nullable: true })
  rawResult: string;
}
