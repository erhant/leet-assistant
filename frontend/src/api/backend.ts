import constants from "~/constants";
import { edenTreaty } from "@elysiajs/eden";
import type { ServerType } from "../../../backend/src";

/**
 * Backend wrapper via ElysiaJS Eden Treaty.
 */
const api = edenTreaty<ServerType>(constants.BASE_URL);

export default api;
