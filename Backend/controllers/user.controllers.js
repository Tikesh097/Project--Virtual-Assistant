import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User Not Found!" });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Get Current User Error!" });
  }
};

// Update assistant details
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage = imageUrl;

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded?.url || uploaded?.secure_url) {
        assistantImage = uploaded.url || uploaded.secure_url;
      }
    }

    if (!assistantName && !assistantImage) {
      return res.status(400).json({ message: "No update data provided!" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User Not Found!" });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update Assistant Error!" });
  }
};

// Ask assistant a command
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command || !command.trim()) {
      return res.status(400).json({ message: "Command is required!" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User Not Found!" });

    user.history.push(command)
    user.save()

    const userName = user.name;
    const assistantName = user.assistantName || "Assistant";

    const result = await geminiResponse(command,assistantName, userName);
    const resultString = typeof result === "string" ? result : JSON.stringify(result);
    const jsonMatch = resultString.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, can't understand!" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const { type, userInput, response } = gemResult;

    switch (type) {
      case "get-date":
        return res.json({ type, userInput, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
      case "get-time":
        return res.json({ type, userInput, response: `Current time is ${moment().format("hh:mm A")}` });
      case "get-day":
        return res.json({ type, userInput, response: `Today is ${moment().format("dddd")}` });
      case "get-month":
        return res.json({ type, userInput, response: `Month is ${moment().format("MMMM")}` });
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({ type, userInput, response });
      default:
        return res.status(400).json({ response: "I didn't understand that command." });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Assistant Error!" });
  }
};
