import Sub from "../models/Sub.js";
import ExpressError from "../middlewares/expressError.js";
import webpush from "web-push";

export const saveSubs = async (req, res, next) => {
  try {
    const subscription = req.body;

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.auth ||
      !subscription?.keys?.p256dh
    ) {
      throw new ExpressError(400, "Invalid subscription format");
    }

    const found = await Sub.findOne({ endpoint: subscription.endpoint });
    if (found) {
      return res.status(409).json({
        success: false,
        message: "Subscription already exists",
      });
    }

    const testPayload = JSON.stringify({
      title: "COMMANDR",
      message: "Notifications enabled successfully!",
      icon: "/logo.png",
    });

    try {
      await webpush.sendNotification(subscription, testPayload);
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        throw new ExpressError(400, "Subscription is expired or invalid");
      }
      throw err;
    }

    await Sub.create(subscription);

    res.status(201).json({
      success: true,
      message: "Subscription saved and verified",
    });
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      throw new ExpressError(400, "Title and message are required");
    }

    const payload = JSON.stringify({
      title,
      message,
      icon: "/logo.png",
    });

    const allSubs = await Sub.find({});
    if (!allSubs.length) {
      return res
        .status(404)
        .json({ success: false, message: "No subscriptions found" });
    }

    let successfulSends = 0;
    let failedSends = 0;

    await Promise.allSettled(
      allSubs.map(async (sub) => {
        try {
          await webpush.sendNotification(sub.toJSON(), payload);
          successfulSends++;
        } catch (err) {
          failedSends++;
          if (err.statusCode === 404 || err.statusCode === 410) {
            await Sub.deleteOne({ endpoint: sub.endpoint });
          }
        }
      })
    );

    res.status(200).json({
      success: true,
      message: `Notifications sent (successful: ${successfulSends}, failed: ${failedSends})`,
    });
  } catch (error) {
    next(error);
  }
};
