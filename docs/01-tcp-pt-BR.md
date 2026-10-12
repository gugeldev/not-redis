[English](01-tcp.md) | **Português**

# Servidor TCP

Os clientes Redis se conectam ao servidor do Redis através de uma conexão TCP. O TCP cria uma conexão confiável entre o cliente e o servidor, permitindo que ambos os lados enviem dados um para o outro.

O protocolo TCP apenas recebe e envia **bytes**; ele não sabe o que esses bytes significam. É diferente de protocolos como o HTTP, que trazem um monte de estrutura: o HTTP sabe o que é um header, o que é um body, etc.

O Redis usa o TCP como o "cano" que mantém a conexão, e tem seu próprio protocolo, o RESP.

### Como o not-redis lida com eventos

Para aceitar conexões TCP, usamos o próprio servidor do Bun, com o `Bun.listen`, que cria um servidor TCP e nos permite lidar com as conexões de forma fácil.

Lidamos com três eventos diferentes (que podem ser encontrados no `main.ts`):

- `open`: Ocorre quando um novo cliente estabelece uma conexão com o servidor. Traz informações como o IP daquela conexão e também permite que a gente salve dados específicos dela;
- `data`: Ocorre quando um cliente já conectado envia alguma cadeia de **bytes** para o servidor. Através desse evento, conseguimos ler quais bytes foram enviados e também acessar os dados daquela conexão. Importante: um evento `data` não é necessariamente um comando inteiro. Como o TCP entrega apenas um fluxo de bytes, um comando pode chegar dividido em dois eventos, ou dois comandos podem chegar juntos em um só. Por isso, cada conexão guarda um buffer no `socket.data`;
- `close`: Ocorre quando uma conexão é finalizada. Podemos limpar os dados que pertenciam a ela e liberar memória / processamento.

### Loop de eventos

Para que o `not-redis` consiga lidar com múltiplas conexões pedindo e enviando dados rapidamente, ele não fica travado esperando uma conexão terminar o pedido dela: ele reveza entre os clientes enquanto eles fazem as requisições, sem esperar pelo fim delas. Isso funciona porque cada pedido é muito rápido: o `not-redis` guarda os valores na memória RAM, o que torna a busca extremamente rápida.

Enquanto um cliente não termina o pedido, o servidor vai adicionando as informações do pedido, conforme elas chegam, em um **buffer** reservado para aquela conexão. Sempre que um pedido chega por completo, ele o executa e o remove do buffer.
