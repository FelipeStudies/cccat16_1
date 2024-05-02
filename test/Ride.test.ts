import Ride from "../src/domain/entities/Ride";

test("Deve atualizar a posição da corrida", () => {
  const ride = Ride.create("", 0, 0, 0, 0);
  ride.updatePosition(-27.584905257808835, -48.545022195325124);
  ride.updatePosition(-27.496887588317275, -48.522234807851476);
  expect(ride.getDistance()).toBe(10);
});
