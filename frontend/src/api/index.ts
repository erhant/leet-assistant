import constants from "~/constants";
import { edenTreaty } from "@elysiajs/eden";
import type { ServerType } from "../../../backend/src/index";

// TODO: how to import this from backend?
export const backend = edenTreaty<ServerType>(constants.BASE_URL);
