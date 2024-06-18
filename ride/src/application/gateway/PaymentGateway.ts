type InputProcessPayment = {
  rideId: string;
  amount: number;
}

export default interface PaymentGateway {
  processPayment(input: InputProcessPayment): Promise<void>;
}
