
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("StackHub Staking Vault", () => {
  describe("stake", () => {
    it("should stake STX successfully", () => {
      const { result } = simnet.callPublicFn(
        "stackhub-staking-vault",
        "stake",
        [Cl.uint(5000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail with zero amount", () => {
      const { result } = simnet.callPublicFn(
        "stackhub-staking-vault",
        "stake",
        [Cl.uint(0)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(103));
    });
  });

  describe("get-stake", () => {
    it("should return stake info after staking", () => {
      simnet.callPublicFn("stackhub-staking-vault", "stake", [Cl.uint(5000000)], wallet1);
      
      const { result } = simnet.callReadOnlyFn(
        "stackhub-staking-vault",
        "get-stake",
        [Cl.principal(wallet1)],
        wallet1
      );
      // Verify result is Some (not None) - stake exists
      expect(result.type).toBe("some");
    });

    it("should return none for non-staker", () => {
      const { result } = simnet.callReadOnlyFn(
        "stackhub-staking-vault",
        "get-stake",
        [Cl.principal(wallet2)],
        wallet1
      );
      expect(result).toBeNone();
    });
  });

  describe("request-unstake", () => {
    it("should request unstake successfully", () => {
      simnet.callPublicFn("stackhub-staking-vault", "stake", [Cl.uint(5000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-staking-vault",
        "request-unstake",
        [Cl.uint(3000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail if no stake", () => {
      const { result } = simnet.callPublicFn(
        "stackhub-staking-vault",
        "request-unstake",
        [Cl.uint(1000000)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(101));
    });
  });

  describe("get-total-staked", () => {
    it("should track total staked", () => {
      simnet.callPublicFn("stackhub-staking-vault", "stake", [Cl.uint(5000000)], wallet1);
      simnet.callPublicFn("stackhub-staking-vault", "stake", [Cl.uint(3000000)], wallet2);
      
      const { result } = simnet.callReadOnlyFn(
        "stackhub-staking-vault",
        "get-total-staked",
        [],
        wallet1
      );
      expect(result).toBeUint(8000000);
    });
  });
});
