import { test, expect } from "bun:test";
import { parse } from "./";

test("parses SET command", () => {
  const input = "*3\r\n$3\r\nSET\r\n$4\r\nnome\r\n$4\r\nJoao\r\n";

  expect(parse(input)).toEqual(["SET", "nome", "Joao"]);
});
