import axios from "axios";

test("Deve criar uma conta para o passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `jon.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };

  const { status } = await axios.post("http://localhost:3000/signup", input);

  expect(status).toBe(200);
})
