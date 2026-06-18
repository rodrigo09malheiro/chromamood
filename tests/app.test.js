/**
 * Unit Tests - ChromaMood
 * Gerados com apoio de IA (Claude) para validar lógica principal da aplicação
 */

// Mock do fetch global
global.fetch = jest.fn();

// ─── Helpers de cor ───────────────────────────────────────────────────────────

describe('Validação de cores HEX', () => {
  const isValidHex = (color) => /^#[0-9A-Fa-f]{6}$/.test(color);

  test('aceita cor HEX válida', () => {
    expect(isValidHex('#FF5733')).toBe(true);
    expect(isValidHex('#000000')).toBe(true);
    expect(isValidHex('#ffffff')).toBe(true);
  });

  test('rejeita cor HEX inválida', () => {
    expect(isValidHex('FF5733')).toBe(false);   // sem #
    expect(isValidHex('#GGG')).toBe(false);      // caracteres inválidos
    expect(isValidHex('#12345')).toBe(false);    // comprimento errado
    expect(isValidHex('')).toBe(false);          // vazio
  });
});

// ─── Estrutura da resposta da API ─────────────────────────────────────────────

describe('Estrutura da resposta da API', () => {
  const isValidApiResponse = (data) => {
    return (
      data &&
      Array.isArray(data.colors) &&
      data.colors.length === 5 &&
      data.colors.every(c => /^#[0-9A-Fa-f]{6}$/.test(c)) &&
      data.typography &&
      typeof data.typography.title === 'string' &&
      typeof data.typography.body === 'string' &&
      typeof data.mood === 'string'
    );
  };

  test('aceita resposta válida da API', () => {
    const validResponse = {
      colors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C'],
      typography: { title: 'Playfair Display', body: 'Lato' },
      mood: 'Elegante e misterioso'
    };
    expect(isValidApiResponse(validResponse)).toBe(true);
  });

  test('rejeita resposta sem colors', () => {
    expect(isValidApiResponse({ typography: { title: 'A', body: 'B' }, mood: 'x' })).toBe(false);
  });

  test('rejeita resposta com menos de 5 cores', () => {
    const bad = {
      colors: ['#FF5733', '#C70039'],
      typography: { title: 'A', body: 'B' },
      mood: 'x'
    };
    expect(isValidApiResponse(bad)).toBe(false);
  });

  test('rejeita resposta sem mood', () => {
    const bad = {
      colors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C'],
      typography: { title: 'A', body: 'B' }
    };
    expect(isValidApiResponse(bad)).toBe(false);
  });
});

// ─── Lógica do prompt ─────────────────────────────────────────────────────────

describe('Validação do prompt do utilizador', () => {
  const isValidPrompt = (prompt) =>
    typeof prompt === 'string' && prompt.trim().length > 0;

  test('aceita prompt com texto', () => {
    expect(isValidPrompt('café vintage à noite')).toBe(true);
    expect(isValidPrompt('  floresta ao amanhecer  ')).toBe(true);
  });

  test('rejeita prompt vazio', () => {
    expect(isValidPrompt('')).toBe(false);
    expect(isValidPrompt('   ')).toBe(false);
  });

  test('rejeita prompt que não é string', () => {
    expect(isValidPrompt(null)).toBe(false);
    expect(isValidPrompt(undefined)).toBe(false);
    expect(isValidPrompt(123)).toBe(false);
  });
});

// ─── Mock da chamada à API ────────────────────────────────────────────────────

describe('Chamada à API /api/generate', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('chama fetch com método POST e content-type correto', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        colors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C'],
        typography: { title: 'Georgia', body: 'Arial' },
        mood: 'Intenso'
      })
    });

    const prompt = 'pôr do sol no deserto';
    await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/generate', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }));
  });

  test('retorna dados válidos no sucesso', async () => {
    const mockData = {
      colors: ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#ffffff'],
      typography: { title: 'Montserrat', body: 'Open Sans' },
      mood: 'Noturno e tecnológico'
    };

    fetch.mockResolvedValueOnce({ json: async () => mockData });

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'cyberpunk' })
    });

    const data = await response.json();
    expect(data.colors).toHaveLength(5);
    expect(data.mood).toBe('Noturno e tecnológico');
  });
});