// framework & driver, interface adapter

import pgp from "pg-promise";
import Position from "../../domain/entities/Position";

// Driven/Resource Port
export default interface PositionRepository{
  savePosition(position: Position): Promise<void>;
}

export class PositionRepositoryDatabase implements PositionRepository {

  async savePosition(position: Position): Promise<void> {
    const connection = pgp()("postgres://root:root@localhost:5432/cccat16_1");
    await connection.query("insert into cccat16.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.coord.getLat(), position.coord.getLong(), position.date]);
    await connection.$pool.end();
  }

}
