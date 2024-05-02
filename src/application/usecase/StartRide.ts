// use case

import RideRepository from "../../infra/repository/RideRepository";

type Input = {
  rideId: string
}

type Output = void

export default class StartRide {

  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.start();
    await this.rideRepository.updateRide(ride);
  }

}
