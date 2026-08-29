import { IPaymentRepository } from "../../domain/interfaces/payment-repository.interface";
import { PaymentInitiation } from "../../domain/entities/payment.entity";
import { InitiatePaymentDto } from "../dtos/initiate-payment.dto";

export class InitiatePaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(
    orderId: string,
    dto: InitiatePaymentDto
  ): Promise<PaymentInitiation> {
    return await this.paymentRepository.initiate(orderId, dto);
  }
}
