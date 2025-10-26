🎯 Campo Minado em React
Um jogo clássico de Campo Minado desenvolvido em React com interface moderna, responsiva e três níveis de dificuldade.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)


✨ Características
🎮 Jogo clássico de Campo Minado com mecânicas tradicionais

📱 Design responsivo que funciona em desktop, tablet e mobile

🎯 Três níveis de dificuldade ajustáveis

⏱️ Cronômetro integrado para acompanhar seu tempo

🚩 Sistema de bandeiras para marcar minas suspeitas

🎨 Interface moderna com gradientes e animações suaves

⌨️ Atalhos de teclado para melhor experiência

🏆 Sistema de vitória/derrota com feedback visual

🎲 Níveis de Dificuldade
Dificuldade	Tamanho	Minas
Fácil	9×9	10 minas
Intermediário	16×16	40 minas
Difícil	16×30	99 minas
🚀 Como Executar
Pré-requisitos
Node.js 16+ instalado

npm ou yarn

Instalação e Execução
Clone o repositório:

bash
git clone <url-do-repositorio>
cd campo-minado
Instale as dependências:

bash
npm install
Execute em modo desenvolvimento:

bash
npm run dev
Acesse o jogo:

text
http://localhost:3000
Build para Produção
bash
npm run build
npm run preview
🎮 Como Jogar
Controles Básicos
Ação	Comando
Revelar célula	Clique Esquerdo
Colocar bandeira	Clique Direito
Revelar células adjacentes	Clique Duplo
Reiniciar jogo	Botão "Reiniciar" ou Tecla R
Regras do Jogo
Objetivo: Revelar todas as células que não contêm minas

Números: Indicam quantas minas existem nas células adjacentes

Bandeiras: Use para marcar células onde suspeita haver minas

Clique Duplo: Quando o número de bandeiras ao redor coincide com o número na célula, revela automaticamente as células restantes

Cuidado: Clicar em uma mina termina o jogo!

Estratégias
🎯 Comece pelos cantos - geralmente são mais seguros

🚩 Use bandeiras para marcar minas confirmadas

🔢 Analise os números para deduzir posições de minas

⚡ Use clique duplo para revelar múltiplas células rapidamente

🛠️ Tecnologias Utilizadas
Frontend: React 18.2.0

Build Tool: Vite 5.0.8

Estilização: CSS3 com Grid e Flexbox

Linguagem: JavaScript ES6+

Gerenciamento de Estado: React Hooks (useState, useEffect)

📁 Estrutura do Projeto
text
campo-minado/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          # Componente principal do jogo
│   ├── CampoMinado.css  # Estilos do jogo
│   └── main.jsx         # Ponto de entrada da aplicação
├── package.json         # Dependências e scripts
├── vite.config.js       # Configuração do Vite
└── README.md           # Documentação
🎨 Personalização
Cores e Temas
As cores podem ser facilmente personalizadas editando o arquivo src/CampoMinado.css. As principais variáveis são:

css
/* Cores principais */
--cor-primaria: #667eea;
--cor-secundaria: #764ba2;
--cor-vitoria: #4CAF50;
--cor-derrota: #ff4444;
Dificuldades Customizadas
Para adicionar novos níveis de dificuldade, edite o objeto configuracoes no App.jsx:

javascript
const configuracoes = {
  custom: { largura: 20, altura: 20, minas: 80 }
};
🐛 Solução de Problemas
Problemas Comuns
Jogo não inicia

Verifique se todas as dependências foram instaladas com npm install

Confirme que a porta 3000 está disponível

Células não respondem

Verifique o console do navegador por erros JavaScript

Recarregue a página (F5)

Layout quebrado em mobile

Limpe o cache do navegador

Verifique a versão do CSS

Desempenho
O jogo é otimizado para performance com React hooks

Uso eficiente de estado local

Renderização condicional para melhor responsividade

🤝 Contribuindo
Contribuições são bem-vindas! Siga estos passos:

Fork o projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

🙋‍♂️ Suporte
Se você encontrar algum problema ou tiver sugestões:

Abra uma issue

Descreva o problema detalhadamente

Inclua informações sobre seu ambiente (navegador, SO, etc.)

🎉 Agradecimentos
Inspirado no clássico Minesweeper da Microsoft

Comunidade React pelos componentes e hooks

Contribuidores de código aberto

Divirta-se jogando! 🎮

Desenvolvido com ❤️ usando React e Vite
