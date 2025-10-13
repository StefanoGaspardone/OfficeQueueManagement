import {
  createTicket,
  getCounter,
  getNextCustomer,
  setTicketFinished,
  getTicketServedByCounter,
} from "../db/dao.mjs";

describe("nextCustomer Unit Tests", () => {
  test("getCounter() test", () => {
    return getCounter(1).then((result) => {
      expect(result).toBe(true);
    });
  });
  test("getCounter() test with non-existing counter", () => {
    return getCounter(999999).then((result) => {
      expect(result).toBe(false);
    });
  });
  test("getCounter() test with invalid id", async () => {
    const result = await getCounter("invalid");
    expect(result).toBe(false);
  });
  test("getTicketServedByCounter() test", async () => {
    await createTicket(1);
    await getNextCustomer(1);
    const result = await getTicketServedByCounter(1);
    expect(result).toBeDefined();
  });

  test("getTicketServedByCounter() test with no ticket being served", async () => {
    const result = await getTicketServedByCounter(2);
    expect(result).toBeNull();
  });

  test("getTicketServedByCounter() test with invalid id", async () => {
    const result = await getTicketServedByCounter("invalid");
    // dao implementation returns null for not found / invalid
    expect(result).toBeNull();
  });
  test("setTicketFinished() test", async () => {
    const ticket = await createTicket(1);
    await getNextCustomer(1);
    const result = await setTicketFinished(1, ticket.ticketId);
    expect(result).toBeDefined();
  });
});

describe("nextCustomer Integration Tests", () => {
  test("nextCustomer() test", async () => {
    const ticket = await createTicket(1);
    await getNextCustomer(1);
    const result = await getTicketServedByCounter(1);
    expect(result).toBeDefined();
  });
});
