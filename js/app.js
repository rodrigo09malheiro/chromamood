const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt');
const resultSection = document.getElementById('result');
const swatchesDiv = document.getElementById('swatches');
const typographyDiv = document.getElementById('typography');
const moodDescriptionDiv = document.getElementById('mood-description');

const historySection = document.getElementById('history-section');
const historyContainer = document.getElementById('history-container');
const clearHistoryBtn = document.getElementById('clear-history-btn');

function generateRandomHex() {
  const chars = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('chromamood_history')) || [];
  
  if (history.length === 0) {
    historySection.hidden = true;
    historyContainer.innerHTML = '';
    return;
  }

  historyContainer.innerHTML = '';
  
  history.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('history-item');

    const promptText = document.createElement('div');
    promptText.classList.add('history-item-prompt');
    promptText.textContent = `"${item.prompt}"`;
    itemDiv.appendChild(promptText);

    const colorsContainer = document.createElement('div');
    colorsContainer.classList.add('history-item-colors');

    item.colors.forEach(color => {
      const miniSwatch = document.createElement('div');
      miniSwatch.classList.add('history-mini-swatch');
      miniSwatch.style.backgroundColor = color;
      miniSwatch.title = `Clique para copiar ${color.toUpperCase()}`;

      miniSwatch.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(color);
          alert(`Cor ${color.toUpperCase()} copiada do histórico!`);
        } catch (err) {
          console.error('Erro ao copiar do histórico: ', err);
        }
      });

      colorsContainer.appendChild(miniSwatch);
    });

    itemDiv.appendChild(colorsContainer);
    historyContainer.appendChild(itemDiv);
  });

  historySection.hidden = false;
}

function saveToHistory(prompt, colors) {
  const history = JSON.parse(localStorage.getItem('chromamood_history')) || [];
  const newPalette = { prompt, colors };
  history.unshift(newPalette);
  if (history.length > 10) history.pop();
  localStorage.setItem('chromamood_history', JSON.stringify(history));
  loadHistory();
}

clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Tens a certeza que queres limpar todo o histórico de paletas?')) {
    localStorage.removeItem('chromamood_history');
    loadHistory();
  }
});

generateBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  
  if (!prompt) {
    alert('Por favor, descreve um mood primeiro!');
    return;
  }

  generateBtn.textContent = 'A gerar paleta com IA...';
  generateBtn.disabled = true;

  // Limpar os elementos completamente para esconder os blocos vazios no CSS
  swatchesDiv.innerHTML = '';
  typographyDiv.innerHTML = '';
  moodDescriptionDiv.innerHTML = '';

  setTimeout(() => {
    const randomColors = [
      generateRandomHex(),
      generateRandomHex(),
      generateRandomHex(),
      generateRandomHex(),
      generateRandomHex()
    ];

    const mockData = {
      colors: randomColors,
      typography: { title: 'Playfair Display', body: 'Source Sans Pro' },
      mood: `Uma paleta dinâmica gerada para: "${prompt}".`
    };

    mockData.colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.classList.add('swatch');
      swatch.style.backgroundColor = color;
      swatch.textContent = color.toUpperCase();
      swatch.title = 'Clica para copiar o código HEX';
      
      swatch.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(color);
          const originalText = swatch.textContent;
          swatch.textContent = 'Copiado!';
          setTimeout(() => { swatch.textContent = originalText; }, 1500);
        } catch (err) {
          console.error('Erro ao copiar: ', err);
        }
      });
      
      swatchesDiv.appendChild(swatch);
    });

    typographyDiv.innerHTML = `
      <h3 style="color: #a78bfa; margin-bottom: 0.5rem; font-size: 1.1rem;">Typography Match</h3>
      <strong>Títulos:</strong> ${mockData.typography.title}<br/>
      <strong>Corpo de texto:</strong> ${mockData.typography.body}
    `;

    moodDescriptionDiv.innerHTML = `
      <h3 style="color: #a78bfa; margin-bottom: 0.5rem; font-size: 1.1rem;">Mood Narrative</h3>
      <p>${mockData.mood}</p>
    `;

    resultSection.hidden = false;
    saveToHistory(prompt, mockData.colors);

    generateBtn.textContent = 'Gerar Paleta';
    generateBtn.disabled = false;
  }, 800);
});

loadHistory();