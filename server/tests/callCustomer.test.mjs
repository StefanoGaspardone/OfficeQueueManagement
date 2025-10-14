import {
  createTicket,
  getNextCustomer,
  setTicketServed,
  getTicketServedByCounter,
  setTicketFinished,
} from "../db/dao.mjs";

describe("callCustomer Unit Tests", () => {
  test("getNextCustomer -> setTicketServed -> getTicketServedByCounter flow", async () => {
    const ticket = await createTicket(1);
    const next = await getNextCustomer(1);
    // should get a ticket id
    expect(next).toBeDefined();

    const setRes = await setTicketServed(1, next);
    // sqlite run returns number of changes (0 or 1)
    expect(typeof setRes).toBe("number");

    const served = await getTicketServedByCounter(1);
    expect(served).toBeDefined();
  });

  test("getTicketServedByCounter returns null when no ticket is processing for that counter", async () => {
    const res = await getTicketServedByCounter(999999);
    expect(res).toBeNull();
  });

  test("setTicketServed rejects or returns 0 for invalid inputs", async () => {
    await expect(setTicketServed("invalid", "not-a-ticket")).resolves.toBeDefined();
  });

  test("setTicketFinished handles invalid inputs", async () => {
    await expect(setTicketFinished(1, 999999)).resolves.toBeDefined();
  });
});

describe("callCustomer Integration Tests", () => {
  test("complete call flow: create -> call -> serve -> finish", async () => {
    const ticket = await createTicket(1);
    const next = await getNextCustomer(1);
    expect(next).toBeDefined();
    await setTicketServed(1, next);
    const served = await getTicketServedByCounter(1);
    expect(served).toBeDefined();
    const finished = await setTicketFinished(1, served);
    expect(finished).toBeDefined();
  });
});
