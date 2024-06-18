// use case

import Registry from "../../infra/dependency-injection/Registry";
import RideRepository from "../../infra/repository/RideRepository";
import PaymentGateway from "../gateway/PaymentGateway";

type Input = {
  rideId: string
}

type Output = void

export default class FinishRide {

  readonly rideRepository: RideRepository;
  readonly paymentGateway: PaymentGateway;

  constructor() {
    this.rideRepository = Registry.getInstance().inject("rideRepository");
    this.paymentGateway = Registry.getInstance().inject("paymentGateway");
  }

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.finish();
    await this.rideRepository.connection.commit();
    // const processPayment = new ProcessPayment();
    // await processPayment.execute({ rideId: ride.rideId, amount: ride.fare })
    await this.paymentGateway.processPayment({ rideId: ride.rideId, amount: ride.fare });
  }

}
