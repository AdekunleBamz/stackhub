
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("StackHub Service Registry", () => {
  describe("register-service", () => {
    it("should register a service and pay fee", () => {
      const { result } = simnet.callPublicFn(
        "stackhub-service-registry",
        "register-service",
        [Cl.stringAscii("Web Development"), Cl.uint(50000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(1));
    });

    it("should fail with zero price", () => {
      const { result } = simnet.callPublicFn(
        "stackhub-service-registry",
        "register-service",
        [Cl.stringAscii("Free Service"), Cl.uint(0)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(103));
    });
  });

  describe("get-service", () => {
    it("should return service info", () => {
      simnet.callPublicFn("stackhub-service-registry", "register-service", 
        [Cl.stringAscii("Design"), Cl.uint(25000000)], wallet1);
      
      const { result } = simnet.callReadOnlyFn(
        "stackhub-service-registry",
        "get-service",
        [Cl.uint(1)],
        wallet1
      );
      expect(result).toBeSome(Cl.tuple({
        provider: Cl.principal(wallet1),
        title: Cl.stringAscii("Design"),
        price: Cl.uint(25000000),
        active: Cl.bool(true)
      }));
    });
  });

  describe("update-service", () => {
    it("should update service details", () => {
      simnet.callPublicFn("stackhub-service-registry", "register-service", 
        [Cl.stringAscii("Old Title"), Cl.uint(10000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-service-registry",
        "update-service",
        [Cl.uint(1), Cl.stringAscii("New Title"), Cl.uint(20000000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail if not provider", () => {
      simnet.callPublicFn("stackhub-service-registry", "register-service", 
        [Cl.stringAscii("My Service"), Cl.uint(10000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-service-registry",
        "update-service",
        [Cl.uint(1), Cl.stringAscii("Hacked"), Cl.uint(1)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(102));
    });
  });

  describe("toggle-service", () => {
    it("should toggle service active state", () => {
      simnet.callPublicFn("stackhub-service-registry", "register-service", 
        [Cl.stringAscii("My Service"), Cl.uint(10000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-service-registry",
        "toggle-service",
        [Cl.uint(1)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("pay-service", () => {
    it("should pay for service with fee", () => {
      simnet.callPublicFn("stackhub-service-registry", "register-service", 
        [Cl.stringAscii("Consulting"), Cl.uint(10000000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        "stackhub-service-registry",
        "pay-service",
        [Cl.uint(1)],
        wallet2
      );
      expect(result).toBeOk(Cl.tuple({
        paid: Cl.uint(10000000),
        fee: Cl.uint(150000)
      }));
    });
  });
});
