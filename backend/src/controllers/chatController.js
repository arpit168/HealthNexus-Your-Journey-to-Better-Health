import Chat from "../models/chatModel.js";

export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = await Chat.create({ userId, chatHistory: [] });
    }

    res.status(200).json({ success: true, chatHistory: chat.chatHistory });
  } catch (error) {
    next(error);
  }
};

export const updateChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { chatHistory } = req.body;

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, chatHistory });
    } else {
      chat.chatHistory = chatHistory;
    }

    await chat.save();
    res.status(200).json({ success: true, chatHistory: chat.chatHistory });
  } catch (error) {
    next(error);
  }
};

export const clearChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Chat.findOneAndUpdate({ userId }, { chatHistory: [] });
    res.status(200).json({ success: true, message: "Chat cleared" });
  } catch (error) {
    next(error);
  }
};
