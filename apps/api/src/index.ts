import { app } from "./app";

export default {
  fetch(request: Request, env: unknown, ctx: unknown) {
    //@ts-ignore
    return app.fetch(request, env, ctx);
  },
};
