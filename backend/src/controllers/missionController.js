import {
  createMission,
  getRescueMissions,
  updateMissionStatus,
} from "../service/missionServices.js";

export const makeMission = async (req, res) => {
  const mission = await createMission(req.body, req.app.get("io"));
  res.status(201).json({ mission });
};

export const fetchRescueMissions = async (req, res) => {
  const missions = await getRescueMissions(req.user._id);

  res.status(200).json({
    success: true,
    missions,
  });
};

export const changeMissionStatus = async (req, res) => {
  const { id } = req.params; // ✅ FIX
  const { status } = req.body;

  const mission = await updateMissionStatus(id, status, req.app.get("io"));

  res.status(200).json({
    success: true,
    data: mission,
  });
};
