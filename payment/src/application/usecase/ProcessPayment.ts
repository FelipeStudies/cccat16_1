// use case

type Input = {
  rideId: string
  amount: number
}

type Output = void

export default class ProcessPayment {

  constructor() {}

  async execute(input: Input): Promise<Output> {
    console.log(input.rideId, input.amount);
  }

}
