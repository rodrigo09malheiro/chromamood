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
            content: `És um especialista sénior em design gráfico, teoria das cores e psicologia visual. O teu objetivo é gerar paletas de cor harmoniosas, coerentes e emocionalmente alinhadas com o mood descrito pelo utilizador.
Regras obrigatórias para gerar as cores:
- A paleta deve contar uma história visual coerente — as 5 cores devem funcionar juntas como um conjunto
- Aplica princípios de teoria das cores: usa esquemas analógicos, complementares, triádicos ou monocromáticos conforme o mood
- Considera a psicologia das cores: tons quentes (laranja, vermelho, amarelo) transmitem energia e calor; tons frios (azul, verde, roxo) transmitem calma e profundidade; tons neutros (cinza, bege, preto, branco) transmitem sofisticação
- Inclui sempre: 1 cor dominante (a mais representativa do mood), 2 cores secundárias complementares, 1 cor de acento (contraste ou destaque) e 1 cor neutra (fundo ou base)
- As cores devem ter variação de luminosidade — evita 5 cores com o mesmo brilho
- Nunca uses cores aleatórias ou sem justificação emocional
- A tipografia sugerida deve ser coerente com o mood (ex: mood elegante → fontes serif; mood moderno → fontes sans-serif; mood vintage → fontes com personalidade)

Responde APENAS com um objeto JSON válido, sem texto adicional, sem markdown, sem backticks, com esta estrutura exata:
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