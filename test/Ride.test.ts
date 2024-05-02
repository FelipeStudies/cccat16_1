import Position from "../src/domain/entities/Position";
import Ride from "../src/domain/entities/Ride";
import DistanceCalculator from "../src/domain/services/DistanceCalculator";

test("Deve atualizar a posição da corrida", () => {
  const ride = Ride.create("", 0, 0, 0, 0);
  const positions = [
    Position.create(ride.rideId, -27.584905257808835, -48.545022195325124),
    Position.create(ride.rideId, -27.496887588317275, -48.522234807851476),
  ];
  expect(DistanceCalculator.calculate(positions)).toBe(10);
});
