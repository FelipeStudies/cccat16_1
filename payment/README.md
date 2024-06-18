UC3 - Solicitar corrida (Request Ride)

Ator: Passageiro
Input: passenger_id (account_id), from (lat, long), to (lat, long)
Output: ride_id

Regras:

* deve verificar se o account_id tem is_passenger true
* deve verificar se já não existe uma corrida do passageiro em status diferente de "completed", se existir lançar um erro
* deve deve gerar o ride_id (uuid)
* deve definir o status como "requested"
* deve definir date com a data atual

fromLat: -27.584905257808835
fromLong: -48.545022195325124
toLat: -27.496887588317275
toLong: -48.522234807851476

UTC4 - Obter Corrida (Ride)

Input: ride_id
Output: todas as informações da ride juntamente com os dados do passageiro e do motorista (inicialmente null, definido após o use case de AcceptRide)

Considere o modelo de dados:

create table cccat16.ride (
  ride_id uuid,
  passenger_id uuid,
  driver_id uuid,
  status text,
  fare numeric,
  distance numeric,
  from_lat numeric,
  from_long numeric,
  to_lat numeric,
  to_long numeric,
  date timestamp
);
