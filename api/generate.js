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
            content: `És um especialista em design e teoria das cores. Quando receberes uma descrição de um mood ou ambiente, responde APENAS com um objeto JSON válido, sem texto adicional, sem markdown, sem backticks, com esta estrutura exata:
{"colors":["#hex1","#hex2","#hex3","#hex4","#hex5"],"typography":{"title":"Nome da fonte para títulos","body":"Nome da fonte para corpo de texto"},"mood":"Descrição breve do mood em português"}`
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