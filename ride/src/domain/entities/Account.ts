// Aggregate, Aggregate Root <AR>, Entity

/**
 * Por que Aggregate?
 * Account:
 *  - Account
 *  - Name
 *  - Email
 *  - Cpf
 *  - Car Plate
 */

import crypto from 'crypto';
import Name from '../value-objects/Name';
import Email from '../value-objects/Email';
import Cpf from '../value-objects/Cpf';
import CarPlate from '../value-objects/CarPlate';

export default class Account {

  private constructor(
    readonly accountId: string,
    private name: Name,
    private email: Email,
    private cpf: Cpf,
    private carPlate: CarPlate,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
  ) {}

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), new CarPlate(carPlate), isPassenger, isDriver);
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), new CarPlate(carPlate), isPassenger, isDriver);
  }

  setName (name: string) {
    this.name = new Name(name);
  }

  getName () {
    return this.name.getValue();
  }

  getEmail () {
    return this.email.getValue();
  }

  getCpf () {
    return this.cpf.getValue();
  }

  getCarPlate () {
    return this.carPlate.getValue();
  }

}
