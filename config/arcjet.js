import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_ENV, ARCJET_KEY } from "../config/config.js";

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 15,
    }),
  ],
});

export default aj;
