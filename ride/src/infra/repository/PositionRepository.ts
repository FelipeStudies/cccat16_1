// framework & driver, interface adapter

import pgp from "pg-promise";
import Position from "../../domain/entities/Position";
import DatabaseConnection from "../database/DatabaseConnection";

// Driven/Resource Port
export default interface PositionRepository{
  savePosition(position: Position): Promise<void>;
  listPositionByRideId(rideId: string): Promise<Position[]>;
}

export class PositionRepositoryDatabase implements PositionRepository {

  constructor(private readonly connection: DatabaseConnection) {}

  async savePosition(position: Position): Promise<void> {
    await this.connection.query("insert into cccat16.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.coord.getLat(), position.coord.getLong(), position.date], true);
  }

  async listPositionByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query("select * from cccat16.position where ride_id = $1", [rideId]);
    const positions = [];
    for(const positionData of positionsData) {
      positions.push(Position.restore(positionData.position_id, positionData.ride_id, parseFloat(positionData.lat), parseFloat(positionData.long), positionData.date));
    }
    return positions;
}
}
