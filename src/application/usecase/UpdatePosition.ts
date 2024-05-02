// use case

import Position from "../../domain/entities/Position";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

type Input = {
  rideId: string
  lat: number,
  long: number,
}

type Output = void

export default class UpdatePosition {

  constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {}

  async execute(input: Input): Promise<Output> {
    const position = Position.create(input.rideId, input.lat, input.long);
    await this.positionRepository.savePosition(position);
  }

}
