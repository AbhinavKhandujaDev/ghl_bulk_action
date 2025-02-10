import { type Router } from "express";
import recordRoutes from "./record.routes";
import fieldsRoutes from "./field.routes";
import actionRoutes from "./action.routes";
import actionTypeRoutes from "./action-type.routes";

export function setRoutes(app: Router) {
  app.use("/records", recordRoutes);
  app.use("/fields", fieldsRoutes);
  app.use("/action-types", actionTypeRoutes);
  app.use("/bulk-actions", actionRoutes);
}
