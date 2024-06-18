// Aggregate, Aggregate Root <AR>, Entity

import crypto from "node:crypto";
import Coord from "../value-objects/Coord";

export default class Position {

  private constructor(
    readonly positionId: string,
    readonly rideId: string,
    readonly coord: Coord,
    readonly date: Date,
  ) {}

  static create(rideId: string, lat: number, long: number) {
    const positionId = crypto.randomUUID();
    const date = new Date();
    return new Position(positionId, rideId, new Coord(lat, long), date);
  }

  static restore(positionId: string, rideId: string, lat: number, long: number, date: Date) {
    return new Position(positionId, rideId, new Coord(lat, long), date);
  }

}
