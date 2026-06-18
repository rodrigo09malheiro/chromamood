# 🎨 ChromaMood

Gerador de paletas de cor com IA a partir de uma descrição de mood ou ambiente.

## 🌐 App Online

👉 [chromamood.vercel.app](https://chromamood.vercel.app/)

## 📁 Repositório

👉 [github.com/rodrigo09malheiro/chromamood](https://github.com/rodrigo09malheiro/chromamood)

## 💡 Como usar

1. Acede à app em [chromamood.vercel.app](https://chromamood.vercel.app/)
2. Escreve uma descrição de um mood ou ambiente (ex: *"café vintage à noite"*)
3. Clica em **Gerar Paleta**
4. A IA gera 5 cores, tipografia sugerida e uma descrição do mood
5. Clica em qualquer cor para copiar o código HEX

## 🛠️ Tecnologias

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (Serverless Functions no Vercel)
- **IA:** [Groq API](https://groq.com/) com modelo `llama-3.3-70b-versatile`
- **Deploy:** [Vercel](https://vercel.com/) com CI/CD automático via GitHub
- **Testes:** Jest com jsdom

## ⚙️ Estrutura do Projeto

chromamood/

├── api/

│   └── generate.js       # Serverless function — integração com Groq

├── css/

│   └── style.css         # Estilos da interface

├── js/

│   └── app.js            # Lógica do frontend

├── tests/

│   └── app.test.js       # Unit tests (Jest)

├── .github/

│   └── workflows/

│       └── ci.yml        # Pipeline CI/CD

├── index.html            # Página principal

└── vercel.json           # Configuração do Vercel

## 🔄 CI/CD

Cada push para `main` despoleta automaticamente o pipeline no GitHub Actions:

1. Verifica presença dos ficheiros essenciais
2. Lint ao HTML
3. Corre os unit tests (Jest)
4. Valida o `vercel.json`
5. Verifica sintaxe do JavaScript
6. O Vercel faz o deploy automático

## 👥 Equipa

| Membro | GitHub |
|--------|--------|
| Rodrigo Malheiro | [@rodrigo09malheiro](https://github.com/rodrigo09malheiro) |
| Eduardo Oliveira | [@eduardooliveira2005](https://github.com/eduardooliveira2005) |

## 📚 Contexto Académico

Projeto desenvolvido no âmbito da unidade curricular de **Engenharia de Software**  
**ECGM — IPVC/ESTG** | 2025/2026