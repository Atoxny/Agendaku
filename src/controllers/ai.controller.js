const { GoogleGenerativeAI } = require('@google/generative-ai');

const aiController = {
  async processText(req, res) {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'your_api_key_here') {
        return res.status(500).json({ error: 'GEMINI_API_KEY no configurada correctamente' });
      }

      if (!prompt) {
        return res.status(400).json({ error: 'Se requiere un prompt' });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.json({ response: text });
    } catch (error) {
      console.error('AI Error:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud de IA' });
    }
  }
};

module.exports = aiController;
