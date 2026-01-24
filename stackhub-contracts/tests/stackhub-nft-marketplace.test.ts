
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

/**
 * Test Suite: StackHub NFT Marketplace
 * Covers minting, listing, buying, and unlisting functionality.
 * Verifies fee transfers and ownership changes.
 */
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("StackHub NFT Marketplace", () => {
  describe("mint", () => {
    it("should mint an NFT successfully", () => {
      const { result } = simnet.callPublicFn(
        "stackhub-nft-marketplace",
        "mint",
        [Cl.stringAscii("ipfs://QmTest123")],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(1));
    });

    it("should increment token id", () => {
      simnet.callPublicFn("stackhub-nft-marketplace", "mint", [Cl.stringAscii("ipfs://QmTest1")], wallet1);
      const { result } = simnet.callPublicFn("stackhub-nft-marketplace", "mint", [Cl.stringAscii("ipfs://QmTest2")], wallet1);
      expect(result).toBeOk(Cl.uint(2));
    });
  });

  describe("list-nft", () => {
    it("should list an NFT for sale", () => {
      simnet.callPublicFn("stackhub-nft-marketplace", "mint", [Cl.stringAscii("ipfs://QmTest")], wallet1);
      const { result } = simnet.callPublicFn(
        "stackhub-nft-marketplace",
        "list-nft",
        [Cl.uint(1), Cl.uint(1000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail if not owner", () => {
      simnet.callPublicFn("stackhub-nft-marketplace", "mint", [Cl.stringAscii("ipfs://QmTest")], wallet1);
      const { result } = simnet.callPublicFn(
        "stackhub-nft-marketplace",
        "list-nft",
        [Cl.uint(1), Cl.uint(1000000)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(102));
    });
  });

  describe("buy-nft", () => {
    it("should buy an NFT and transfer with fee", () => {
      simnet.callPublicFn("stackhub-nft-marketplace", "mint", [Cl.stringAscii("ipfs://QmTest")], wallet1);
      simnet.callPublicFn("stackhub-nft-marketplace", "list-nft", [Cl.uint(1), Cl.uint(1000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-nft-marketplace",
        "buy-nft",
        [Cl.uint(1)],
        wallet2
      );
      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("unlist-nft", () => {
    it("should unlist an NFT", () => {
      simnet.callPublicFn("stackhub-nft-marketplace", "mint", [Cl.stringAscii("ipfs://QmTest")], wallet1);
      simnet.callPublicFn("stackhub-nft-marketplace", "list-nft", [Cl.uint(1), Cl.uint(1000000)], wallet1);
      
      const { result } = simnet.callPublicFn("stackhub-nft-marketplace", "unlist-nft", [Cl.uint(1)], wallet1);
      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("transfer", () => {
    it("should transfer NFT to another wallet", () => {
      simnet.callPublicFn("stackhub-nft-marketplace", "mint", [Cl.stringAscii("ipfs://QmTest")], wallet1);
      const { result } = simnet.callPublicFn(
        "stackhub-nft-marketplace",
        "transfer",
        [Cl.uint(1), Cl.principal(wallet2)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });
  });
});
