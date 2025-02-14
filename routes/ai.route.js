// routes/ai.route.js
import express from "express";
import axios from "axios";
const router = express.Router();

// POST /api/ai/analyze
router.post("/urgent", async (req, res) => {
  try {
    const { description } = req.body;
    
    const aiResponse = await axios.post("https://0zf511zz-5000.inc1.devtunnels.ms/urgent", {
      description,
    });
    
    res.status(200).json({
      success: true,
      data: aiResponse.data,
    });
  } catch (error) {
    console.error("Error calling AI service:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
