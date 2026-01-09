import {
  createEmergency,
  getVictimEmergencies,
  getAllEmergencies,
  updateEmergencyStatus,
} from "../service/emergencyServices.js";

export const reportEmergency = async (req, res) => {
  const emergency = await createEmergency(
    req.user._id,
    req.body,
    req.app.get("io"),
  );
  res
    .status(201)
    .json({ message: "Emergency reported successfully", emergency });
};

export const getMyEmergencies = async (req, res) => {
  const emergencies = await getVictimEmergencies(req.user._id);
  res.status(200).json({ emergencies });
};

export const fetchAllEmergencies = async (req, res) => {
  const emergencies = await getAllEmergencies();
  res.status(200).json({ emergencies });
};

export const changeEmergencyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await updateEmergencyStatus(id, status);
  res.status(200).json({ message: "Emergency status updated", updated });
};
