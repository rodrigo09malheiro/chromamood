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
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `És um especialista sénior em design gráfico, teoria das cores e psicologia visual.

Quando receberes uma descrição de um mood, segue SEMPRE este processo de raciocínio interno antes de responder:
1. Identifica as emoções principais do mood (ex: calma, energia, nostalgia, luxo)
2. Escolhe uma temperatura de cor dominante (quente/fria/neutra) coerente com essas emoções
3. Define a cor dominante que melhor representa o mood
4. Escolhe 2 cores secundárias analógicas ou complementares à dominante
5. Adiciona 1 cor de acento com contraste suficiente para destacar elementos
6. Adiciona 1 cor neutra (fundo ou base) coerente com o conjunto
7. Verifica que as 5 cores têm variação de luminosidade entre si
8. Escolhe tipografia coerente com o mood

Exemplos de paletas coerentes:
- "café vintage à noite" → castanhos escuros (#2C1810, #4A2C17), bege envelhecido (#C4A882), dourado suave (#8B6914), preto quente (#1A0F0A)
- "praia ao amanhecer" → azul claro (#87CEEB), areia (#F5DEB3), coral suave (#FF7F7F), branco (#FFFFFF), azul profundo (#1E90FF)
- "floresta mística" → verde escuro (#1B4332), verde musgo (#40916C), castanho terra (#6B4226), dourado (#D4A017), preto esverdeado (#0D1B0F)

Após o raciocínio interno (que NÃO deves incluir na resposta), responde APENAS com um objeto JSON válido, sem texto adicional, sem markdown, sem backticks:
{"colors":["#hex1","#hex2","#hex3","#hex4","#hex5"],"typography":{"title":"Nome da fonte para títulos","body":"Nome da fonte para corpo de texto"},"mood":"Descrição evocativa do mood em português (2-3 frases)"}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const groqData = await response.json();
    
    if (!groqData.choices || !groqData.choices[0]) {
      console.error('Groq response:', JSON.stringify(groqData));
      return res.status(500).json({ error: 'Resposta inválida da Groq' });
    }

    let content = groqData.choices[0].message.content;
    
    // Limpar possíveis backticks ou markdown
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(content);
    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Erro:', err.message);
    return res.status(500).json({ error: 'Erro ao chamar a API da Groq', details: err.message });
  }
}