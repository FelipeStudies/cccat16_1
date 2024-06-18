import Coord from "./Coord";

export default class Segment {

  private distance: number

  constructor(readonly from: Coord, readonly to: Coord) {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180;

    const toLat = this.to.getLat();
    const fromLat = this.from.getLat();

    const deltaLat = (toLat - fromLat) * degreesToRadians;
    const deltaLon = (this.to.getLong() - this.from.getLong()) * degreesToRadians;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(fromLat * degreesToRadians) *
      Math.cos(toLat * degreesToRadians) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    this.distance = Math.round(distance);
  }

  getDistance() {
    return this.distance;
  }

}
