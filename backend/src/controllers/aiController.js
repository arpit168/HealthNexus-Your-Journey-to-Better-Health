import groq from "../config/groq.js";

// -----------------------------
// Normal AI Response
// -----------------------------
export const generateResponse = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are HealthNexus Coach, a specialized AI assistant focused ONLY on health, fitness, nutrition, wellness, exercise, diet, mental health, and related medical topics. 

      IMPORTANT RULES:
      - ONLY answer questions related to health, body deficiencies, illness, fitness, nutrition, wellness, exercise, diet, yoga, sports, mental health, sleep, stress management, weight management, workout routines, meal planning, supplements, and general medical health topics.
      - If a user asks about ANY topic not related to health (such as general knowledge, technology, entertainment, politics, history, math problems, coding, or any other non-health topic), you MUST respond with EXACTLY: "Sorry, I'm unable to answer it."
      - Do NOT provide any information, explanation, or discussion on non-health topics.
      - If a question contains both health and non-health parts, answer ONLY the health-related part and ignore the rest.
      - Be helpful and detailed for all health-related questions.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      // Use one of these currently supported models:
      model: "llama-3.3-70b-versatile", // Latest Llama model (recommended)
      // OR
      // model: "llama-3.1-8b-instant",  // Faster, smaller model
      // OR
      // model: "gemma2-9b-it",          // Google's Gemma model
      // OR
      // model: "qwen-2.5-32b",          // Qwen model
    });

    const reply = completion.choices[0]?.message?.content || "No response";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Error:", error.message);
    console.error("Full error:", error);
    return res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};

// -----------------------------
// Streaming AI Response
// -----------------------------
export const streamResponse = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are HealthNexus Coach, a specialized AI assistant focused ONLY on health, fitness, nutrition, wellness, exercise, diet, mental health, and related medical topics. 

      IMPORTANT RULES:
      - ONLY answer questions related to health, body deficiencies, illness, fitness, nutrition, wellness, exercise, diet, yoga, sports, mental health, sleep, stress management, weight management, workout routines, meal planning, supplements, and general medical health topics.
      - If a user asks about ANY topic not related to health (such as general knowledge, technology, entertainment, politics, history, math problems, coding, or any other non-health topic), you MUST respond with EXACTLY: "Sorry, I'm unable to answer it."
      - Do NOT provide any information, explanation, or discussion on non-health topics.
      - If a question contains both health and non-health parts, answer ONLY the health-related part and ignore the rest.
      - Be helpful and detailed for all health-related questions.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile", // Updated model
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      res.write(content);
    }

    res.end();
  } catch (error) {
    console.error("Streaming Error:", error.message);
    res.status(500).end("Streaming failed");
  }
};
