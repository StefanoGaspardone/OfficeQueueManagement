import { createTicket } from "../db/dao.mjs";

describe("getTicket Unit Tests", () => {
    test("createTicket() returns a ticket object for a valid service id", async () => {
        const result = await createTicket(1);
        expect(result).toBeDefined();
        expect(result).toHaveProperty("ticketId");
        expect(result).toHaveProperty("serviceId");
        expect(result).toHaveProperty("serviceType");
        expect(result.serviceId).toBe(1);
    });

    test("createTicket() rejects for non-existing service id", async () => {
        await expect(createTicket(999999)).rejects.toThrow();
    });

    test("createTicket() rejects for invalid service id (null)", async () => {
        await expect(createTicket(null)).rejects.toThrow();
    });
});