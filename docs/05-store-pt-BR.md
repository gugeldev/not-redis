[English](05-store.md) | **Português**

# Store

O store é onde os dados realmente ficam guardados. No not-redis, ele é só um `Map` do JavaScript, que fica na memória RAM (em `src/store`):

```ts
export const store = new Map<string, Entry>();
```

Como o módulo é carregado uma vez só, todas as conexões compartilham o mesmo `Map`. Ou seja, se um cliente faz `SET nome Joao`, outro cliente consegue ler com `GET nome`.

### Tipos de dados

No Redis, cada chave guarda um valor de um tipo específico. No not-redis, nós temos dois tipos: string e lista. Cada valor guardado no `Map` é uma `Entry`, que diz qual é o seu tipo:

```ts
type Entry =
	| { type: EntryType.STRING; value: string; expiresAt?: number }
	| { type: EntryType.LIST; value: string[]; expiresAt?: number };
```

Isso é uma union discriminada do TypeScript: quando checamos o `type`, o TypeScript já sabe se o `value` é uma `string` ou um `string[]`.

- `STRING`: usado por `SET`, `GET` e `INCR`. Até números são guardados como string, o `INCR` converte, soma 1 e guarda de volta;
- `LIST`: usado por `LPUSH`, `RPUSH`, `LRANGE`, `LINDEX`, `LLEN`, `LPOP` e `RPOP`. Quando uma lista fica vazia, a chave é apagada, igual ao Redis.

### WRONGTYPE

Como cada chave tem um tipo, um comando não pode ser usado em uma chave de outro tipo. Por exemplo, se `nome` é uma string, um `LPUSH nome x` não faz sentido. Nesse caso, o comando devolve o erro:

```
-WRONGTYPE Operation against a key holding the wrong kind of value
```

Todo comando segue o mesmo padrão: busca a chave, e se ela existir mas for do tipo errado, devolve `WRONGTYPE`:

```ts
const entry = getEntry(key);

if (entry === undefined) return NULL_BULK;

if (entry.type !== EntryType.STRING) return WRONGTYPE;

return bulkString(entry.value);
```
