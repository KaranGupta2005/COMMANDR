import Emergency from "../models/Emergency.js";
import {decisionEngine} from "./decisionEngine.js";
import {EVENTS} from "../constants/events.js";

export const escalateEmergency=async(emergencyId,io)=>{
    const emergency=await Emergency.findById(emergencyId);

    emergency.severity="critical";
    await emergency.save();

    await decisionEngine({
        eventType:EVENTS.EMERGENCY_ESCALATED,
        payload:{
            emergencyId:emergency._id,
            location:emergency.location,
            severity:emergency.severity,
            message:"Emergency Escalated"
        },
        io
    });
};