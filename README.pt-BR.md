[English](README.md) | **Português**

## not-redis

`not-redis` é um clone simples do Redis, feito com TypeScript + Bun, que fala o mesmo protocolo do Redis (RESP). Isso significa que você pode trocar o Redis original pelo not-redis em qualquer cliente Redis e tudo vai funcionar igual (apenas para os comandos suportados).

> Essa é uma cópia simples, criada para entender os principais conceitos por trás do Redis, não uma versão completa.

### Comandos suportados
`PING`, `ECHO`, `HELLO`, `SET` (com `EX`), `GET`, `DEL`, `EXISTS`, `INCR`, `EXPIRE`, `TTL`, `RPUSH`, `LPUSH`, `LRANGE`, `LINDEX`, `LLEN`, `LPOP`, `RPOP`.

Comandos disponíveis:
- `PING`: Verifica se o not-redis está saudável;
- `ECHO`: Testa o not-redis devolvendo a mensagem enviada;
- `HELLO`: Handshake enviado pelos clientes Redis ao se conectar;
- `SET`: Cria (ou sobrescreve) um registro, opcionalmente com expiração (`EX`);
- `GET`: Retorna o valor de um registro;
- `DEL`: Apaga um ou mais registros;
- `EXISTS`: Conta quantas das chaves informadas existem;
- `INCR`: Incrementa um valor numérico em 1;
- `EXPIRE`: Define um tempo de expiração (em segundos) para um registro;
- `TTL`: Retorna quantos segundos faltam para um registro expirar;
- `RPUSH`: Adiciona valores no fim de uma lista;
- `LPUSH`: Adiciona valores no começo de uma lista;
- `LRANGE`: Retorna um intervalo de itens de uma lista;
- `LINDEX`: Retorna o item em uma determinada posição de uma lista;
- `LLEN`: Retorna o tamanho de uma lista;
- `LPOP`: Remove e retorna o primeiro item de uma lista;
- `RPOP`: Remove e retorna o último item de uma lista.

### Como rodar

1. Clone o repositório do `not-redis`:

```bash
git clone git@github.com:gugeldev/not-redis.git
```
2. Entre na pasta e instale as dependências:
```bash
cd not-redis
bun install
```

3. Rode o not-redis (a porta padrão é 7777):
```bash
PORT=6379 bun run main.ts # se PORT não for definida, o padrão é 7777
```

4. Teste o not-redis com um cliente Redis (exemplo com Bun):
```typescript
import { RedisClient } from "bun";

const client = new RedisClient("redis://127.0.0.1:6379");

console.log(await client.set("name", "John")); // Retorna 'OK'
console.log(await client.get("name")); // Retorna 'John'

client.close();
```

### Como funciona

Um comando percorre: socket -> parser -> dispatcher -> comando -> store -> resposta.

1. [Servidor TCP](docs/01-tcp-pt-BR.md): por que TCP e como as conexões são tratadas
2. [RESP](docs/02-resp-pt-BR.md): o protocolo que os clientes Redis falam
3. [Parser](docs/03-parser-pt-BR.md): bufferização e framing dos bytes recebidos
4. [Dispatcher](docs/04-dispatcher-pt-BR.md): tabela de comandos e aridade
5. [Store](docs/05-store-pt-BR.md): tipos de dados e WRONGTYPE
6. [Expiração](docs/06-expiration-pt-BR.md): expiração lazy vs ativa
