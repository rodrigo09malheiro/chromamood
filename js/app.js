const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt');
const resultSection = document.getElementById('result');
const swatchesDiv = document.getElementById('swatches');
const typographyDiv = document.getElementById('typography');
const moodDescriptionDiv = document.getElementById('mood-description');

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert('Escreve uma descrição primeiro!');

  generateBtn.textContent = 'A gerar...';
  generateBtn.disabled = true;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    // Swatches
    swatchesDiv.innerHTML = '';
    data.colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.classList.add('swatch');
      swatch.style.backgroundColor = color;
      swatch.textContent = color;
      swatch.title = 'Clica para copiar';
      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(color);
        swatch.textContent = 'Copiado!';
        setTimeout(() => swatch.textContent = color, 1500);
      });
      swatchesDiv.appendChild(swatch);
    });

    // Tipografia
    typographyDiv.innerHTML = `
      <strong>Tipografia sugerida:</strong><br/>
      Título: ${data.typography.title}<br/>
      Corpo: ${data.typography.body}
    `;

    // Mood
    moodDescriptionDiv.innerHTML = `<strong>Mood:</strong> ${data.mood}`;

    resultSection.hidden = false;

  } catch (err) {
    alert('Erro ao gerar paleta. Tenta novamente.');
    console.error(err);
  } finally {
    generateBtn.textContent = 'Gerar Paleta';
    generateBtn.disabled = false;
  }
});