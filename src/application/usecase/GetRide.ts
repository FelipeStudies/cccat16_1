// use case

import { AccountRepository } from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

// DTO
type Input = {
  rideId: string
}

// DTO
type Output = {
  rideId: string
  passengerId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
  status: string,
  passengerName: string,
  passengerEmail: string,
  driverName?: string,
  driverEmail?: string,
}

// Facade
export default class GetRide {

  constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    const passenger = await this.accountRepository.getAccountById(ride.passengerId);
    let driver;
    if(ride.driverId) {
      driver = await this.accountRepository.getAccountById(ride.driverId);
    }
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      passengerName: passenger.getName(),
      passengerEmail: passenger.getEmail(),
      driverName: driver?.getName(),
      driverEmail: driver?.getEmail(),
    }
  }

}
