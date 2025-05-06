import { getCookie, getEvent } from "@tanstack/react-start/server";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { TRPCError } from "@trpc/server";
import { jwtVerify } from "jose";

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const authMiddleware = middleware(async ({ ctx, next }) => {
  const event = getEvent();
  const authToken = getCookie(event, "auth");

  if (!authToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No JWT token found",
    });
  }

  const { payload } = await jwtVerify(authToken, JWT_SECRET);

  if (!payload) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid JWT token",
    });
  }

  if (!payload.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid JWT token",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: payload.userId as number,
    },
  });
});

export const procedure = t.procedure.use(authMiddleware);
