// use case

import Registry, { inject } from "../../infra/dependency-injection/Registry";
import RideRepository from "../../infra/repository/RideRepository";
import PaymentGateway from "../gateway/PaymentGateway";

type Input = {
  rideId: string
}

type Output = void

export default class FinishRide {

  @inject("rideRepository")
  readonly rideRepository!: RideRepository;
  @inject("paymentGateway")
  readonly paymentGateway!: PaymentGateway;

  constructor() {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.finish();
    await this.rideRepository.connection.commit();
    // const processPayment = new ProcessPayment();
    // await processPayment.execute({ rideId: ride.rideId, amount: ride.fare })
    await this.paymentGateway.processPayment({ rideId: ride.rideId, amount: ride.fare });
  }

}
