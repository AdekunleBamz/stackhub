
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("StackHub Token Launchpad", () => {
  describe("create-token", () => {
    it("should create a token and pay fee", () => {
      const { result } = simnet.callPublicFn(
        "stackhub-token-launchpad",
        "create-token",
        [Cl.stringAscii("StackCoin"), Cl.stringAscii("STKC"), Cl.uint(6), Cl.uint(1000000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(1));
    });

    it("should increment token id for each creation", () => {
      simnet.callPublicFn("stackhub-token-launchpad", "create-token", 
        [Cl.stringAscii("Token1"), Cl.stringAscii("TK1"), Cl.uint(6), Cl.uint(1000000)], wallet1);
      const { result } = simnet.callPublicFn("stackhub-token-launchpad", "create-token", 
        [Cl.stringAscii("Token2"), Cl.stringAscii("TK2"), Cl.uint(6), Cl.uint(1000000)], wallet1);
      expect(result).toBeOk(Cl.uint(2));
    });
  });

  describe("get-balance", () => {
    it("should return initial supply for creator", () => {
      simnet.callPublicFn("stackhub-token-launchpad", "create-token", 
        [Cl.stringAscii("TestToken"), Cl.stringAscii("TST"), Cl.uint(6), Cl.uint(5000000)], wallet1);
      
      const { result } = simnet.callReadOnlyFn(
        "stackhub-token-launchpad",
        "get-balance",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeUint(5000000);
    });
  });

  describe("transfer-token", () => {
    it("should transfer tokens between wallets", () => {
      simnet.callPublicFn("stackhub-token-launchpad", "create-token", 
        [Cl.stringAscii("TestToken"), Cl.stringAscii("TST"), Cl.uint(6), Cl.uint(5000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-token-launchpad",
        "transfer-token",
        [Cl.uint(1), Cl.uint(1000000), Cl.principal(wallet2)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("mint-tokens", () => {
    it("should mint additional tokens as owner", () => {
      simnet.callPublicFn("stackhub-token-launchpad", "create-token", 
        [Cl.stringAscii("TestToken"), Cl.stringAscii("TST"), Cl.uint(6), Cl.uint(1000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-token-launchpad",
        "mint-tokens",
        [Cl.uint(1), Cl.uint(500000), Cl.principal(wallet2)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail if not token owner", () => {
      simnet.callPublicFn("stackhub-token-launchpad", "create-token", 
        [Cl.stringAscii("TestToken"), Cl.stringAscii("TST"), Cl.uint(6), Cl.uint(1000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-token-launchpad",
        "mint-tokens",
        [Cl.uint(1), Cl.uint(500000), Cl.principal(wallet2)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(102));
    });
  });

  describe("burn-tokens", () => {
    it("should burn tokens", () => {
      simnet.callPublicFn("stackhub-token-launchpad", "create-token", 
        [Cl.stringAscii("TestToken"), Cl.stringAscii("TST"), Cl.uint(6), Cl.uint(1000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-token-launchpad",
        "burn-tokens",
        [Cl.uint(1), Cl.uint(100000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });
  });
});
