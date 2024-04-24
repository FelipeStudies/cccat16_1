// framework & driver, interface adapter

import pgp from "pg-promise";
import Ride from "../../domain/Ride";

// Driven/Resource Port
export default interface RideRepository{
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;

  getRideById(rideId: string): Promise<Ride>;

  saveRide(ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const connection = pgp()("postgres://root:root@localhost:5432/cccat16_1");
    const [rideData] = await connection.query("select * from cccat16.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
    await connection.$pool.end();
    return !!rideData;
  }

  async getRideById(rideId: string): Promise<any> {
    const connection = pgp()("postgres://root:root@localhost:5432/cccat16_1");
    const [rideData] = await connection.query("select * from cccat16.ride where ride_id = $1", [rideId]);
    await connection.$pool.end();
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.status,
      rideData.date,
    );
  }

  async saveRide(ride: any): Promise<void> {
    const connection = pgp()("postgres://root:root@localhost:5432/cccat16_1");
    await connection.query("insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date]);
    await connection.$pool.end();
  }
}
