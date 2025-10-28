const express = require('express');
const router = express.Router();
const { fetch } = require('undici');

// Proxy sencillo a la API de Gemini para no exponer la API key en el cliente
// POST /api/ai/message { message: string }
router.post('/message', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada' });
    }

    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Parámetro "message" requerido' });
    }

    const systemPrompt = 'Eres un asistente virtual para el portafolio de Alejandro Vargas, un diseñador gráfico y web. Responde preguntas sobre sus servicios, proyectos y habilidades de manera amigable y profesional. Mantén las respuestas concisas.';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUsuario: ${message}` }] }
      ]
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(502).json({ error: 'Error en proveedor AI', details: errText });
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.json({ text });
  } catch (e) {
    console.error('AI proxy error:', e);
    return res.status(500).json({ error: 'Error interno en AI proxy' });
  }
});

module.exports = router;
