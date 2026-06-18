// Paletas pré-definidas por categoria emocional
const PALETTES = {
  quente_escuro: ['#2C1810', '#4A2C17', '#8B6914', '#C4A882', '#1A0F0A'],
  quente_vibrante: ['#FF4500', '#FF8C00', '#FFD700', '#8B0000', '#3D1C02'],
  frio_claro: ['#87CEEB', '#B0E0E6', '#F0F8FF', '#4682B4', '#FFFFFF'],
  frio_escuro: ['#0D1B2A', '#1B2A4A', '#2E4057', '#4A7C9E', '#A8C5DA'],
  natureza_verde: ['#1B4332', '#40916C', '#6B4226', '#D4A017', '#0D1B0F'],
  natureza_terroso: ['#5C3D2E', '#9C6B3C', '#C4A265', '#E8D5B0', '#2D1B0E'],
  noturno: ['#0A0A0F', '#1A1A2E', '#16213E', '#0F3460', '#533483'],
  romantico: ['#FF6B9D', '#C44569', '#F8B500', '#FF8E53', '#2C1654'],
  minimalista: ['#F5F5F5', '#E0E0E0', '#9E9E9E', '#424242', '#212121'],
  luxo: ['#1A1A1A', '#2D2D2D', '#C9A84C', '#E8D5A3', '#8B7536'],
  tropical: ['#FF6B35', '#F7C59F', '#EFEFD0', '#004E89', '#1A936F'],
  mistico: ['#2D1B69', '#553772', '#7B2D8B', '#A663CC', '#1A0A2E'],
};

const TYPOGRAPHY = {
  quente_escuro: { title: 'Playfair Display', body: 'Lora' },
  quente_vibrante: { title: 'Bebas Neue', body: 'Roboto' },
  frio_claro: { title: 'Raleway', body: 'Open Sans' },
  frio_escuro: { title: 'Montserrat', body: 'Source Sans Pro' },
  natureza_verde: { title: 'Merriweather', body: 'PT Serif' },
  natureza_terroso: { title: 'Playfair Display', body: 'Crimson Text' },
  noturno: { title: 'Orbitron', body: 'Exo 2' },
  romantico: { title: 'Cormorant Garamond', body: 'EB Garamond' },
  minimalista: { title: 'Helvetica Neue', body: 'Inter' },
  luxo: { title: 'Didot', body: 'Futura' },
  tropical: { title: 'Pacifico', body: 'Nunito' },
  mistico: { title: 'Cinzel', body: 'Crimson Text' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gemma2-9b-it',
        messages: [
          {
            role: 'system',
            content: `És um especialista em psicologia das cores e design emocional.

Analisa o mood descrito e escolhe a categoria que melhor representa as emoções transmitidas.

Categorias disponíveis:
- quente_escuro: cafés, bares noturnos, aconchego, vintage, madeira, couro
- quente_vibrante: pôr do sol, energia, fogo, lava, verão intenso, paixão
- frio_claro: manhã, neve, brisa, leveza, espaço aberto, pureza
- frio_escuro: oceano profundo, tempestade, chuva, melancolia, profundidade
- natureza_verde: floresta, mata, bosque, natureza, crescimento, frescura
- natureza_terroso: deserto, terra, outono, pedra, areia, rustico
- noturno: cidade à noite, tecnologia, espaço, cyberpunk, galáxia, universo
- romantico: amor, flores, pôr do sol rosa, delicadeza, feminino, celebração
- minimalista: moderno, clean, simples, corporativo, neutro, escandinavo
- luxo: ouro, elegância, premium, sofisticado, formal, diamante
- tropical: praia, selva, frutas, alegria, cores vivas, verão tropical
- mistico: magia, fantasia, universo, espiritual, sonho, misterioso

Responde APENAS com um JSON válido sem markdown:
{"categoria":"nome_da_categoria","mood":"Descrição evocativa em português (2-3 frases que capturam a essência emocional do mood)"}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4
      })
    });

    const groqData = await response.json();

    if (!groqData.choices || !groqData.choices[0]) {
      console.error('Groq response:', JSON.stringify(groqData));
      return res.status(500).json({ error: 'Resposta inválida da Groq' });
    }

    let content = groqData.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(content);
    const categoria = parsed.categoria in PALETTES ? parsed.categoria : 'minimalista';

    return res.status(200).json({
      colors: PALETTES[categoria],
      typography: TYPOGRAPHY[categoria],
      mood: parsed.mood
    });

  } catch (err) {
    console.error('Erro:', err.message);
    return res.status(500).json({ error: 'Erro ao chamar a API da Groq', details: err.message });
  }
}