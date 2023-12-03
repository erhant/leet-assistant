import constants from "~/constants";
import { edenTreaty } from "@elysiajs/eden";
import type { ServerType } from "../../../backend/src";

export default edenTreaty<ServerType>(constants.BASE_URL);
