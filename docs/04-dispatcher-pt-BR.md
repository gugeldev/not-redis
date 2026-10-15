[English](04-dispatcher.md) | **Português**

# Dispatcher

Depois que o parser transforma os bytes em um comando (ex: `["GET", "nome"]`), alguém precisa decidir qual código vai rodar para aquele comando. Esse é o papel do dispatcher, que fica em `src/execute`.

### Tabela de comandos

Em vez de um `if`/`switch` gigante com todos os comandos, nós usamos uma tabela: um objeto onde a chave é o nome do comando e o valor é a função que executa ele (em `src/commands/index.ts`):

```ts
export const commands: Record<string, CommandSpec> = {
	GET: { run: executeGet, arity: 2 },
	SET: { run: executeSet, arity: -3 },
	DEL: { run: executeDel, arity: -2 },
	// ...
};
```

Assim, o dispatcher só precisa pegar o nome do comando, colocar em maiúsculo (o Redis aceita `get`, `GET` ou `Get`) e procurar na tabela. Se não encontrar, devolve um erro `ERR unknown command`. Para adicionar um comando novo, basta criar a função e registrar ela na tabela, sem mexer no dispatcher.

### Aridade

Aridade é a quantidade de argumentos que um comando aceita, contando o próprio nome do comando (igual ao Redis). Ela pode ser:

- Positiva: o comando precisa de **exatamente** essa quantidade. Ex: `GET: 2` aceita apenas `GET chave`;
- Negativa: o comando precisa de **pelo menos** essa quantidade. Ex: `DEL: -2` aceita `DEL a`, `DEL a b c`, etc.

O sinal é só um jeito de guardar duas informações em um número: o valor diz o mínimo e o sinal diz se pode ter mais.

O dispatcher valida a aridade antes de rodar o comando:

```ts
const argsTotal = args.length + 1;
const ok = arity >= 0 ? argsTotal === arity : argsTotal >= -arity;
```

O `-arity` só tira o sinal do número negativo: para o `DEL`, `-(-2)` vira `2`, então a conta fica "pelo menos 2".

Como essa validação fica em um lugar só, os comandos não precisam checar se os argumentos existem, eles já recebem tudo no formato certo. O Redis faz igual: a aridade é checada antes de chamar o comando.
