[English](06-expiration.md) | **Português**

# Expiração

O Redis permite que uma chave tenha um prazo de validade, depois dele a chave deixa de existir. É muito usado para cache e dados temporários. No not-redis, dá para definir esse prazo com `SET chave valor EX segundos` ou com `EXPIRE chave segundos`, e consultar quanto falta com `TTL chave`.

### Como guardamos o prazo

Cada `Entry` do store tem um campo opcional `expiresAt`, que é o momento exato (em milissegundos, igual ao `Date.now()`) em que a chave expira:

```ts
entry.expiresAt = Date.now() + seconds * 1000;
```

Guardar o momento exato, e não "faltam 10 segundos", facilita tudo: para saber se expirou, basta comparar com o `Date.now()`.

O `TTL` usa esse mesmo campo e devolve:

- `-2`: a chave não existe (ou já expirou);
- `-1`: a chave existe, mas não tem prazo;
- Qualquer outro número: quantos segundos faltam.

### Expiração lazy

Mas quem apaga a chave quando o prazo acaba? No not-redis, ninguém apaga na hora. A chave só é apagada quando alguém tenta acessar ela, isso se chama **expiração lazy** (preguiçosa). Todo comando busca as chaves pelo `getEntry`, que faz essa checagem:

```ts
if (entry.expiresAt !== undefined && Date.now() >= entry.expiresAt) {
	store.delete(key);
	return undefined;
}
```

Assim, para quem está usando, a chave expirada se comporta exatamente como uma chave que não existe.

### O problema e a expiração ativa

A expiração lazy tem um problema: se ninguém nunca mais acessar uma chave expirada, ela fica ocupando memória para sempre.

Por isso, o Redis usa as duas coisas juntas. Além da lazy, ele tem a **expiração ativa**: algumas vezes por segundo, ele pega uma amostra aleatória de chaves com prazo e apaga as que já expiraram. Se muitas da amostra estavam expiradas, ele repete, porque provavelmente tem mais.
