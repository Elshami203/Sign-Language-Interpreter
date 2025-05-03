import asyncHandler from "express-async-handler";

export const createRoom = asyncHandler(async (req, res) => {
  const roomId = Math.random().toString(36).substring(7);

  res.status(200).json({
    message: "Room created successfully",
    data: {
      roomId,
    },
  });
});

export const joinRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    res.status(400);
    throw new Error("Room ID is required");
  }

  res.status(200).json({
    message: "Joined room successfully",
    data: {
      roomId,
    },
  });
});
