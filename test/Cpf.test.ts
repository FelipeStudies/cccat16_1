import Cpf from "../src/domain/value-objects/Cpf";

test.each([
  "97456321558",
  "71428793860",
  "87748248800",
])("Deve testar um cpf válido: %s", function (cpf: any) {
  expect(new Cpf(cpf)).toBeDefined()
});

test.each([
  undefined,
  null,
  "11111111111",
  "123",
  "12342378439247328432",
])("Deve testar um cpf inválido: %s", function (cpf: any) {
  expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"))
});
