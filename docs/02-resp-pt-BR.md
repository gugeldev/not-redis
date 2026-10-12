[English](02-resp.md) | **Português**

# RESP

O RESP é o protocolo que o Redis usa para a comunicação entre cliente e servidor. Ele é responsável por padronizar o que o cliente envia e o que o servidor devolve.

### O que o cliente manda

A regra que o Redis segue é que o cliente sempre manda um array de **bulk strings**. Para todo comando, o formato é sempre esse.

> Bulk string: é uma string que diz o seu tamanho na frente. Ex: `$4\r\nJoao\r\n`, o `4` diz que é uma string de 4 bytes: `Joao` -> 1 byte (8 bits) por letra, já que são letras sem acento.

Exemplo de comando que o cliente manda:

`*3\r\n$3\r\nSET\r\n$4\r\nnome\r\n$4\r\nJoao\r\n`

- `*3\r\n` -> O array tem 3 partes
- `$3\r\n` -> A próxima parte tem 3 bytes
- `SET\r\n` -> SET = 3 letras = 3 bytes
- `$4\r\n` -> A próxima parte tem 4 bytes
- `nome\r\n` -> nome = 4 letras = 4 bytes
- `$4\r\n` -> A próxima parte tem 4 bytes
- `Joao\r\n` -> Joao = 4 letras = 4 bytes

### O que o servidor devolve

O cliente sempre envia o mesmo formato (um array de **bulk strings**), porém a resposta do servidor muda conforme o comando. O primeiro caractere da resposta diz qual é o tipo:

| Tipo | Exemplo | Quem usa no not-redis |
|---|---|---|
| Simple string | `+OK\r\n` | `SET`, `PING` |
| Erro | `-ERR ...\r\n` | `WRONGTYPE`, aridade errada |
| Inteiro | `:3\r\n` | `INCR`, `LLEN`, `DEL`, `TTL` |
| Bulk string | `$4\r\nJoao\r\n` | `GET`, `LPOP`, `ECHO` |
| Nulo | `$-1\r\n` | `GET` de uma chave que não existe |
| Array | `*2\r\n$1\r\na\r\n$1\r\nb\r\n` | `LRANGE` |

No not-redis, cada tipo tem um helper em `src/resp` (`simpleString`, `error`, `integer`, `bulkString`, `NULL_BULK` e `array`), então os comandos não precisam montar essas strings na mão.
