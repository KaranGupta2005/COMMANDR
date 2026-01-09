import { resolveChannels } from "./channelResolver.js";
import { resolveRecipients } from "./recipientResolver.js";
import { dispatch } from "./dispatcher.js";

export const decisionEngine = async ({ eventType, payload, context, io }) => {
  const recipients = await resolveRecipients(eventType, payload);
  const channels = resolveChannels(eventType, payload);

  for (const recipient of recipients) {
    await dispatch({ io, recipient, eventType, payload, channels });
  }
};
