import { describe, it, expect, vi, beforeEach } from "vitest";
import * as transactionsServer from "@/app/admin/book-requests/server"; // <-- Update this to correct relative path
import * as transactionsCrud from "@/db/crud/transactions.crud";

vi.mock("@/db/crud/transactions.crud", () => ({
  updateTransactions: vi.fn(),
  readTransactions: vi.fn(),
}));

describe("Transaction server functions", () => {
  const mockUpdate = transactionsCrud.updateTransactions as unknown as ReturnType<typeof vi.fn>;
  const mockRead = transactionsCrud.readTransactions as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("acceptTransaction", () => {
    it('should call updateTransactions with "accepted" status', async () => {
      mockUpdate.mockResolvedValueOnce({});
      const result = await transactionsServer.acceptTransaction(1, "user123");

      expect(mockUpdate).toHaveBeenCalledWith(1, "accepted", "user123");
      expect(result).toEqual({
        success: true,
        message: "Transaction accepted successfully",
      });
    });

    it("should throw if userId is null or undefined", async () => {
      await expect(transactionsServer.acceptTransaction(1, null)).rejects.toThrow("Unauthorized");
      await expect(transactionsServer.acceptTransaction(1, undefined)).rejects.toThrow("Unauthorized");
    });
  });

  describe("rejectTransaction", () => {
    it('should call updateTransactions with "rejected" status', async () => {
      mockUpdate.mockResolvedValueOnce({});
      const result = await transactionsServer.rejectTransaction(2, "admin123");

      expect(mockUpdate).toHaveBeenCalledWith(2, "rejected", "admin123");
      expect(result).toEqual({
        success: true,
        message: "Transaction rejected successfully",
      });
    });

    it("should throw if userId is null or undefined", async () => {
      await expect(transactionsServer.rejectTransaction(2, null)).rejects.toThrow("Unauthorized");
      await expect(transactionsServer.rejectTransaction(2, undefined)).rejects.toThrow("Unauthorized");
    });
  });

  describe("fetchTransactions", () => {
    it("should return transactions from the database", async () => {
      const fakeData = [{ tid: 1, status: "pending" }];
      mockRead.mockResolvedValueOnce(fakeData);

      const result = await transactionsServer.fetchTransactions();
      expect(mockRead).toHaveBeenCalled();
      expect(result).toEqual(fakeData);
    });
  });
});
