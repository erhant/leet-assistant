import constants from "~/constants";
import { edenTreaty } from "@elysiajs/eden";
import type { ServerType } from "../../../backend/src";

const api = edenTreaty<ServerType>(constants.BASE_URL);

export default api;
