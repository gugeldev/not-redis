[English](03-parser.md) | **Português**

# Parser

Finalmente, chegamos ao parser, o "motor" principal, responsável por entender os bytes que chegam em formato RESP e transformá-los em um comando de verdade.

### O problema

Sempre que um novo evento (um novo envio de dados) chega no `data`, ele traz consigo os bytes daquele evento, mas nem sempre eles formam um comando completo: um comando de um cliente pode chegar quebrado no meio, em vários eventos. Aqui entra a parte importante do nosso parser: ele deve suportar comandos inteiros, identificar comandos incompletos e também lidar com vários comandos de uma vez.

### Buffer

Como as mensagens podem chegar incompletas/separadas, nós criamos um buffer para cada conexão TCP. Assim, sempre que novos bytes chegam, nós vamos armazenando eles no buffer. A cada dado novo, nosso parser analisa se existem comandos completos que podem ser executados. Caso existam, o servidor os executa e limpa a parte já executada do buffer, deixando apenas os comandos ainda incompletos, que precisam aguardar a chegada de novos dados.

### O loop

### O loop

No `main.ts`, sempre que um novo `data` chega, nós juntamos os bytes no buffer e rodamos esse loop:

```ts
while (true) {
  const parsed = parse(socket.data.buffer);
  if (parsed === null) break;
  socket.write(execute(parsed.command));
  socket.data.buffer = socket.data.buffer.subarray(parsed.bytesRead);
}
```

O `parse` tenta ler um comando do começo do buffer e pode devolver duas coisas:

- `null`: o comando ainda está incompleto, então saímos do loop e esperamos o próximo `data`;
- `{ command, bytesRead }`: um comando completo (ex: `["GET", "nome"]`) e quantos bytes ele ocupava no buffer.

Quando o comando está completo, o servidor executa, responde o cliente e corta do buffer os `bytesRead` bytes daquele comando. Depois disso o loop roda de novo, porque pode ter mais um comando logo atrás.

Por exemplo, imagina que chega um `data` com um `PING` inteiro e metade de um `GET`:

```
buffer: [PING completo][GET pela met...]
```

1. Na primeira volta, o `parse` lê o `PING` e devolve `{ command: ["PING"], bytesRead: 14 }`. O servidor responde `+PONG` e corta os 14 bytes, então o buffer fica só com `[GET pela met...]`;
2. Na segunda volta, o `parse` tenta ler o `GET`, mas faltam bytes, então devolve `null` e saímos do loop;
3. Quando chega um novo `data` com o resto do `GET`, ele é juntado no buffer e o loop roda de novo: agora o `GET` está completo, é executado e cortado, e o buffer fica vazio.

Resumindo: o `while` existe porque pode ter mais de um comando no buffer, o `null` quer dizer "espera mais bytes" e o `bytesRead` diz quanto cortar. Esse caso de vários comandos chegando juntos tem até nome: **pipelining**, quando o cliente manda vários comandos sem esperar as respostas.
