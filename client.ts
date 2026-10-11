/**
 * Tests our server with a real Redis client, over RESP.
 * Run the server first, then: bun client
 */
import { RedisClient } from "bun";

const client = new RedisClient("redis://127.0.0.1:7777");

console.log(await client.set("name", "João"));
console.log(await client.get("name"));

client.close();
