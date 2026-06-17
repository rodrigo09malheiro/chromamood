const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt');
const resultSection = document.getElementById('result');
const swatchesDiv = document.getElementById('swatches');
const typographyDiv = document.getElementById('typography');
const moodDescriptionDiv = document.getElementById('mood-description');

generateBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  
  if (!prompt) {
    alert('Por favor, descreve um mood primeiro!');
    return;
  }

  generateBtn.textContent = 'A gerar paleta com IA...';
  generateBtn.disabled = true;

  // Simulação de delay de 1 segundo para parecer real
  setTimeout(() => {
    // Dados de teste para simular a resposta da API
    const mockData = {
      colors: ['#2E1A47', '#4A3B52', '#6B5B7B', '#C06C84', '#F8B195'],
      typography: {
        title: 'Playfair Display',
        body: 'Source Sans Pro'
      },
      mood: `Uma paleta inspirada no teu mood: "${prompt}". Evoca um ambiente acolhedor, misterioso e nostálgico.`
    };

    // Limpar os swatches antigos
    swatchesDiv.innerHTML = '';
    
    // Inserir os novos Swatches de Cor dinamicamente
    mockData.colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.classList.add('swatch');
      swatch.style.backgroundColor = color;
      swatch.textContent = color.toUpperCase();
      swatch.title = 'Clica para copiar o código HEX';
      
      // Lógica de clique para copiar (Requisito principal da Issue)
      swatch.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(color);
          
          // Feedback visual temporário
          const originalText = swatch.textContent;
          swatch.textContent = 'Copiado!';
          
          setTimeout(() => {
            swatch.textContent = originalText;
          }, 1500);
        } catch (err) {
          console.error('Erro ao copiar: ', err);
        }
      });
      
      swatchesDiv.appendChild(swatch);
    });

    // Inserir os dados da Tipografia sugerida
    typographyDiv.innerHTML = `
      <h3 style="color: #7c3aed; margin-bottom: 0.5rem;">Typography Match</h3>
      <strong>Títulos:</strong> ${mockData.typography.title}<br/>
      <strong>Corpo de texto:</strong> ${mockData.typography.body}
    `;

    // Inserir la descrição narrativa do Mood
    moodDescriptionDiv.innerHTML = `
      <h3 style="color: #7c3aed; margin-bottom: 0.5rem;">Mood Narrative</h3>
      <p>${mockData.mood}</p>
    `;

    // Mostrar a secção de resultados
    resultSection.hidden = false;

    // Restaurar estado original do botão
    generateBtn.textContent = 'Gerar Paleta';
    generateBtn.disabled = false;
  }, 1000);
});