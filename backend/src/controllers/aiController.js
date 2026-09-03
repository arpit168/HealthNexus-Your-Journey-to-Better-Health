import groq from "../config/groq.js";
import Goal from "../models/goalModel.js";

const getSystemPrompt = (user, goal) => {
  let context = `You are HealthNexus Coach, a specialized AI assistant focused ONLY on health, fitness, nutrition, wellness, exercise, diet, mental health, and related medical topics.\n\n`;

  context += `User Profile Context:\n`;
  context += `- Name: ${user.fullName || "User"}\n`;
  if (user.healthData?.profile) {
    context += `- Age: ${user.healthData.profile.age || "N/A"}\n`;
    context += `- Gender: ${user.healthData.profile.gender || "N/A"}\n`;
    context += `- Activity Level: ${user.healthData.profile.activityLevel || "N/A"}\n`;
  }
  if (user.healthData?.vitals) {
    context += `- Current Weight: ${user.healthData.vitals.currentWeight || "N/A"}kg\n`;
    context += `- Height: ${user.healthData.vitals.height || "N/A"}cm\n`;
  }
  if (goal) {
    context += `- Primary Goal: ${goal.goalType} (Target: ${goal.targetWeight}kg)\n`;
    context += `- Timeline: ${goal.timeline} weeks\n`;
    context += `- Experience Level: ${goal.experienceLevel}\n`;
    context += `- Calorie Target: ${goal.calorieTarget} kcal\n`;
  }

  context += `\nIMPORTANT RULES:
- ONLY answer questions related to health, fitness, nutrition, wellness, exercise, diet, mental health, etc.
- Keep answers concise and actionable, tailored to the user's specific goals and physical profile provided above.
- If a user asks about ANY topic not related to health, you MUST respond with EXACTLY: "Sorry, I'm unable to answer it."
- Do NOT provide any information, explanation, or discussion on non-health topics.`;

  return context;
};

// -----------------------------
// Normal AI Response
// -----------------------------
export const generateResponse = async (req, res, next) => {
  try {
    const { message } = req.body;
    const user = req.user; // Added by Protect middleware

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user goals
    const goal = await Goal.findOne({ userId: user._id });

    // We use the dynamically generated system prompt with DB context
    const systemPrompt = getSystemPrompt(user, goal);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "qwen/qwen3.8-27b",
    });

    const reply = completion.choices[0]?.message?.content || "No response";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Error:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "AI generation failed",
    });
  }
};

// -----------------------------
// Streaming AI Response
// -----------------------------
export const streamResponse = async (req, res, next) => {
  try {
    const { message } = req.body;
    const user = req.user;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!user) {
      return res.status(401).end("Unauthorized");
    }

    // Fetch user goals
    const goal = await Goal.findOne({ userId: user._id });

    const systemPrompt = getSystemPrompt(user, goal);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "qwen/qwen3.8-27b",
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      res.write(content);
    }

    res.end();
  } catch (error) {
    console.error("Streaming Error:", error.message);
    const statusCode = error.status || 500;
    res.status(statusCode).end(error.message || "Streaming failed");
  }
};
