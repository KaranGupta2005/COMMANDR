import Joi from "joi";

export const userSignUpSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).trim().required().messages({
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must be at most 100 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  role: Joi.string()
    .valid("victim", "rescue", "logistics")
    .lowercase()
    .default("victim")
    .messages({
      "any.only": "Role must be victim, rescue, or logistics",
    }),
}).options({ abortEarly: false });

export const userLoginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
}).options({ abortEarly: false }); // users gets all the validation errors at once

export const createEmergencySchema = Joi.object({
  type: Joi.string().trim().lowercase().required(),

  severity: Joi.string().valid("medium", "high", "critical").required(),

  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),

    lng: Joi.number().min(-180).max(180).required(),
  }).required(),

  description: Joi.string().trim().allow("").optional(),

  media: Joi.array().items(Joi.string().trim()).optional(),
});

export const createMissionSchema = Joi.object({
  emergencyId: Joi.string().hex().length(24).required().messages({
    "string.base": "emergencyId must be a string",
    "string.hex": "emergencyId must be a valid ObjectId",
    "string.length": "emergencyId must be 24 characters long",
    "any.required": "emergencyId is required",
  }),

  rescueTeamId: Joi.string().hex().length(24).required().messages({
    "string.base": "rescueTeamId must be a string",
    "string.hex": "rescueTeamId must be a valid ObjectId",
    "string.length": "rescueTeamId must be 24 characters long",
    "any.required": "rescueTeamId is required",
  }),

  vehiclesAssigned: Joi.array()
    .items(
      Joi.string().hex().length(24).messages({
        "string.hex": "vehicleId must be a valid ObjectId",
        "string.length": "vehicleId must be 24 characters long",
      }),
    )
    .min(1)
    .optional(),

  route: Joi.alternatives()
    .try(
      Joi.array(), // coordinate array
      Joi.object(), // GeoJSON / polyline object
      Joi.string(), // encoded polyline
    )
    .optional(),

  eta: Joi.date().greater("now").optional().messages({
    "date.base": "eta must be a valid date",
    "date.greater": "eta must be in the future",
  }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const createSafeZoneSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "name must be a string",
    "string.empty": "name is required",
    "any.required": "name is required",
  }),

  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required().messages({
      "number.base": "latitude must be a number",
      "number.min": "latitude must be >= -90",
      "number.max": "latitude must be <= 90",
      "any.required": "latitude is required",
    }),

    lng: Joi.number().min(-180).max(180).required().messages({
      "number.base": "longitude must be a number",
      "number.min": "longitude must be >= -180",
      "number.max": "longitude must be <= 180",
      "any.required": "longitude is required",
    }),
  })
    .required()
    .messages({
      "object.base": "location must be an object",
      "any.required": "location is required",
    }),

  capacity: Joi.number().integer().min(1).required().messages({
    "number.base": "capacity must be a number",
    "number.min": "capacity must be at least 1",
    "any.required": "capacity is required",
  }),

  currentOccupancy: Joi.number()
    .integer()
    .min(0)
    .max(Joi.ref("capacity"))
    .default(0)
    .messages({
      "number.base": "currentOccupancy must be a number",
      "number.min": "currentOccupancy cannot be negative",
      "number.max": "currentOccupancy cannot exceed capacity",
    }),

  facilities: Joi.array()
    .items(Joi.string().trim().lowercase().min(1))
    .optional(),

  status: Joi.string()
    .valid("safe", "warning", "unsafe")
    .default("safe")
    .messages({
      "any.only": "status must be one of safe, warning, or unsafe",
    }),

  lastUpdatedBy: Joi.string().hex().length(24).optional().messages({
    "string.hex": "lastUpdatedBy must be a valid ObjectId",
    "string.length": "lastUpdatedBy must be 24 characters long",
  }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const createVehicleSchema = Joi.object({
  type: Joi.string().trim().lowercase().min(2).max(50).required().messages({
    "string.base": "type must be a string",
    "string.empty": "type is required",
    "any.required": "type is required",
  }),

  identifier: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "identifier must be a string",
    "string.empty": "identifier is required",
    "any.required": "identifier is required",
  }),

  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required().messages({
      "number.base": "latitude must be a number",
      "number.min": "latitude must be >= -90",
      "number.max": "latitude must be <= 90",
      "any.required": "latitude is required",
    }),

    lng: Joi.number().min(-180).max(180).required().messages({
      "number.base": "longitude must be a number",
      "number.min": "longitude must be >= -180",
      "number.max": "longitude must be <= 180",
      "any.required": "longitude is required",
    }),
  })
    .required()
    .messages({
      "object.base": "location must be an object",
      "any.required": "location is required",
    }),

  capacity: Joi.number().integer().min(0).optional().messages({
    "number.base": "capacity must be a number",
    "number.min": "capacity cannot be negative",
  }),

  status: Joi.string()
    .valid("available", "in-use", "down")
    .default("available")
    .messages({
      "any.only": "status must be one of available, in-use, or down",
    }),

  assignedMissionId: Joi.string()
    .hex()
    .length(24)
    .allow(null)
    .optional()
    .messages({
      "string.hex": "assignedMissionId must be a valid ObjectId",
      "string.length": "assignedMissionId must be 24 characters long",
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const createVictimProfileSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.base": "userId must be a string",
    "string.hex": "userId must be a valid ObjectId",
    "string.length": "userId must be 24 characters long",
    "any.required": "userId is required",
  }),

  emergencyCount: Joi.number().integer().min(0).default(0).messages({
    "number.base": "emergencyCount must be a number",
    "number.min": "emergencyCount cannot be negative",
  }),

  lastEmergencyId: Joi.string()
    .hex()
    .length(24)
    .allow(null)
    .optional()
    .messages({
      "string.hex": "lastEmergencyId must be a valid ObjectId",
      "string.length": "lastEmergencyId must be 24 characters long",
    }),

  dependentsCount: Joi.number().integer().min(0).default(0).messages({
    "number.base": "dependentsCount must be a number",
    "number.min": "dependentsCount cannot be negative",
  }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const createRescueProfileSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.base": "userId must be a string",
    "string.hex": "userId must be a valid ObjectId",
    "string.length": "userId must be 24 characters long",
    "any.required": "userId is required",
  }),

  teamId: Joi.string().hex().length(24).allow(null).optional().messages({
    "string.hex": "teamId must be a valid ObjectId",
    "string.length": "teamId must be 24 characters long",
  }),

  skills: Joi.array()
    .items(Joi.string().valid("medical", "diving", "fire"))
    .optional()
    .messages({
      "any.only": "skills must be one of medical, diving, or fire",
    }),

  availabilityStatus: Joi.string()
    .valid("available", "on-mission", "offline")
    .default("offline")
    .messages({
      "any.only":
        "availabilityStatus must be available, on-mission, or offline",
    }),

  currentMissionId: Joi.string()
    .hex()
    .length(24)
    .allow(null)
    .optional()
    .messages({
      "string.hex": "currentMissionId must be a valid ObjectId",
      "string.length": "currentMissionId must be 24 characters long",
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const createLogisticsProfileSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.base": "userId must be a string",
    "string.hex": "userId must be a valid ObjectId",
    "string.length": "userId must be 24 characters long",
    "any.required": "userId is required",
  }),

  isActive: Joi.boolean().default(true).messages({
    "boolean.base": "isActive must be a boolean",
  }),

  currentMissionId: Joi.string()
    .hex()
    .length(24)
    .allow(null)
    .optional()
    .messages({
      "string.hex": "currentMissionId must be a valid ObjectId",
      "string.length": "currentMissionId must be 24 characters long",
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const subSchema = Joi.object({
  endpoint: Joi.string().required().messages({
    "any.required": "Endpoint is required",
    "string.empty": "Endpoint cannot be empty",
  }),
  keys: Joi.object({
    auth: Joi.string().required(),
    p256dh: Joi.string().required(),
  }).required(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createNotificationSchema = Joi.object({
  userId: Joi.string().pattern(objectIdPattern).required(),

  role: Joi.string()
    .valid("victim", "rescue", "logistics")
    .lowercase()
    .default("victim"),

  title: Joi.string().trim().min(1).required(),

  message: Joi.string().trim().min(1).required(),

  type: Joi.string()
    .valid("emergency", "mission", "system")
    .lowercase()
    .default("emergency"),

  read: Joi.boolean().default(false),

  meta: Joi.object({
    emergencyId: Joi.string().pattern(objectIdPattern).allow(null),

    missionId: Joi.string().pattern(objectIdPattern).allow(null),

    lat: Joi.number().min(-90).max(90).allow(null),

    lng: Joi.number().min(-180).max(180).allow(null),

    severity: Joi.string().valid("medium", "high", "critical").lowercase(),

    deliveredVia: Joi.object({
      socket: Joi.boolean().default(false),
      push: Joi.boolean().default(false),
    }),
  }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});
