export const onlineUsers = new Map();

export const addUser = (userId, socketId) => {
  if (!userId) {
    console.error("❌ addUser called with invalid userId");
    return;
  }

  onlineUsers.set(String(userId), socketId);
  console.log("🟢 addUser:", userId.toString(), socketId);

};

export const removeUser = (userId) => {
  if (!userId) return;
  onlineUsers.delete(String(userId));
};


export const getSocketId = (userId) => {
  return onlineUsers.get(String(userId));
};

export const getAllOnlineUsers = () => {
  return [...onlineUsers.keys()];
};
