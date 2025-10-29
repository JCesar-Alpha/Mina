import React, { useState, useEffect, useCallback } from 'react';
import './Campo_Minado.css';

const CampoMinado = () => {
  const [jogo, setJogo] = useState(null);
  const [dificuldadeAtual, setDificuldadeAtual] = useState('facil');
  const [tempo, setTempo] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const configuracoes = {
    facil: { largura: 9, altura: 9, minas: 10 },
    intermediario: { largura: 16, altura: 16, minas: 40 },
    dificil: { largura: 30, altura: 16, minas: 99 }
  };

  // Classe do jogo baseada no Campo_Minado.js que você enviou
  class JogoCampoMinado {
    constructor(largura, altura, minas) {
      this.largura = largura;
      this.altura = altura;
      this.totalMinas = minas;
      this.jogoIniciado = false;
      this.jogoAcabou = false;
      this.vitoria = false;
      this.celulasReveladas = 0;
      this.bandeirasColocadas = 0;
      this.tempo = 0;
      this.tempoInterval = null;
      
      this.tabuleiro = [];
      this.inicializarTabuleiro();
    }

    inicializarTabuleiro() {
      this.tabuleiro = [];
      for (let y = 0; y < this.altura; y++) {
        this.tabuleiro[y] = [];
        for (let x = 0; x < this.largura; x++) {
          this.tabuleiro[y][x] = {
            temMina: false,
            revelada: false,
            bandeira: false,
            interrogacao: false,
            valor: 0,
            x: x,
            y: y
          };
        }
      }
      
      this.jogoIniciado = false;
      this.jogoAcabou = false;
      this.vitoria = false;
      this.celulasReveladas = 0;
      this.bandeirasColocadas = 0;
      this.tempo = 0;
      this.pararTimer();
    }

    iniciarJogo(primeiroX, primeiroY) {
      this.jogoIniciado = true;
      this.jogoAcabou = false;
      this.vitoria = false;
      this.celulasReveladas = 0;
      this.bandeirasColocadas = 0;
      this.tempo = 0;
      
      this.iniciarTimer();
      this.distribuirMinas(primeiroX, primeiroY);
      this.calcularAdjacentes();
    }

    distribuirMinas(excluirX, excluirY) {
      let minasColocadas = 0;
      
      while (minasColocadas < this.totalMinas) {
        const x = Math.floor(Math.random() * this.largura);
        const y = Math.floor(Math.random() * this.altura);
        
        const distancia = Math.max(Math.abs(x - excluirX), Math.abs(y - excluirY));
        if (distancia <= 1) continue;
        
        if (!this.tabuleiro[y][x].temMina) {
          this.tabuleiro[y][x].temMina = true;
          minasColocadas++;
        }
      }
    }

    calcularAdjacentes() {
      const direcoes = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      for (let y = 0; y < this.altura; y++) {
        for (let x = 0; x < this.largura; x++) {
          const celula = this.tabuleiro[y][x];
          
          if (!celula.temMina) {
            let contador = 0;
            
            for (const [dx, dy] of direcoes) {
              const novoX = x + dx;
              const novoY = y + dy;
              
              if (this.dentroDoTabuleiro(novoX, novoY) && 
                  this.tabuleiro[novoY][novoX].temMina) {
                contador++;
              }
            }
            
            celula.valor = contador;
          }
        }
      }
    }

    dentroDoTabuleiro(x, y) {
      return x >= 0 && x < this.largura && y >= 0 && y < this.altura;
    }

    revelarCelula(x, y) {
      if (!this.jogoIniciado) {
        this.iniciarJogo(x, y);
      }

      const celula = this.tabuleiro[y][x];
      
      if (celula.revelada || celula.bandeira || celula.interrogacao || this.jogoAcabou) {
        return;
      }

      celula.revelada = true;
      this.celulasReveladas++;

      if (celula.temMina) {
        this.fimDeJogo(false);
        return;
      }

      if (celula.valor === 0) {
        this.revelarVizinhos(x, y);
      }

      this.verificarVitoria();
    }

    revelarVizinhos(x, y) {
      const direcoes = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      for (const [dx, dy] of direcoes) {
        const novoX = x + dx;
        const novoY = y + dy;
        
        if (this.dentroDoTabuleiro(novoX, novoY)) {
          const vizinho = this.tabuleiro[novoY][novoX];
          
          if (!vizinho.revelada && !vizinho.bandeira && !vizinho.interrogacao) {
            this.revelarCelula(novoX, novoY);
          }
        }
      }
    }

    alternarBandeira(x, y) {
      if (!this.jogoIniciado || this.jogoAcabou || this.tabuleiro[y][x].revelada) {
        return;
      }

      const celula = this.tabuleiro[y][x];
      
      if (!celula.bandeira && !celula.interrogacao) {
        celula.bandeira = true;
        this.bandeirasColocadas++;
      } else if (celula.bandeira) {
        celula.bandeira = false;
        celula.interrogacao = true;
        this.bandeirasColocadas--;
      } else if (celula.interrogacao) {
        celula.interrogacao = false;
      }
    }

    cliqueDuplo(x, y) {
      if (!this.jogoIniciado || this.jogoAcabou || !this.tabuleiro[y][x].revelada) {
        return;
      }

      const celula = this.tabuleiro[y][x];
      const bandeirasAdjacentes = this.contarBandeirasAdjacentes(x, y);

      if (bandeirasAdjacentes === celula.valor) {
        this.revelarVizinhosNaoMarcados(x, y);
      }
    }

    contarBandeirasAdjacentes(x, y) {
      const direcoes = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      let contador = 0;
      for (const [dx, dy] of direcoes) {
        const novoX = x + dx;
        const novoY = y + dy;
        
        if (this.dentroDoTabuleiro(novoX, novoY) && 
            this.tabuleiro[novoY][novoX].bandeira) {
          contador++;
        }
      }
      
      return contador;
    }

    revelarVizinhosNaoMarcados(x, y) {
      const direcoes = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      for (const [dx, dy] of direcoes) {
        const novoX = x + dx;
        const novoY = y + dy;
        
        if (this.dentroDoTabuleiro(novoX, novoY)) {
          const vizinho = this.tabuleiro[novoY][novoX];
          
          if (!vizinho.revelada && !vizinho.bandeira && !vizinho.interrogacao) {
            this.revelarCelula(novoX, novoY);
          }
        }
      }
    }

    verificarVitoria() {
      const totalCelulasSeguras = this.largura * this.altura - this.totalMinas;
      
      if (this.celulasReveladas === totalCelulasSeguras) {
        this.fimDeJogo(true);
      }
    }

    fimDeJogo(vitoria) {
      this.jogoAcabou = true;
      this.vitoria = vitoria;
      this.pararTimer();
      
      if (!vitoria) {
        this.revelarTodasMinas();
      }
    }

    revelarTodasMinas() {
      for (let y = 0; y < this.altura; y++) {
        for (let x = 0; x < this.largura; x++) {
          const celula = this.tabuleiro[y][x];
          if (celula.temMina) {
            celula.revelada = true;
          }
        }
      }
    }

    iniciarTimer() {
      this.pararTimer();
      this.tempo = 0;
      this.tempoInterval = setInterval(() => {
        this.tempo++;
      }, 1000);
    }

    pararTimer() {
      if (this.tempoInterval) {
        clearInterval(this.tempoInterval);
        this.tempoInterval = null;
      }
    }

    reiniciarJogo() {
      this.pararTimer();
      this.inicializarTabuleiro();
    }

    getEstadoCelula(x, y) {
      return this.tabuleiro[y][x];
    }

    getMinasRestantes() {
      return this.totalMinas - this.bandeirasColocadas;
    }

    getTempo() {
      return this.tempo;
    }

    estaAtivo() {
      return this.jogoIniciado && !this.jogoAcabou;
    }
  }

  // Inicializar jogo
  useEffect(() => {
    novoJogo();
  }, []);

  const novoJogo = useCallback(() => {
    const config = configuracoes[dificuldadeAtual];
    const novoJogo = new JogoCampoMinado(config.largura, config.altura, config.minas);
    setJogo(novoJogo);
    setTempo(0);
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [dificuldadeAtual]);

  // Atualizar tempo
  useEffect(() => {
    if (jogo?.estaAtivo() && !intervalId) {
      const id = setInterval(() => {
        setTempo(jogo.getTempo());
      }, 1000);
      setIntervalId(id);
    } else if (jogo?.jogoAcabou && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jogo, intervalId]);

  const alterarDificuldade = (dificuldade) => {
    setDificuldadeAtual(dificuldade);
    // Não chamar novoJogo aqui - será chamado pelo useEffect
  };

  // Efeito para reiniciar jogo quando mudar dificuldade
  useEffect(() => {
    novoJogo();
  }, [dificuldadeAtual, novoJogo]);

  const cliqueEsquerdo = (x, y) => {
    if (!jogo || jogo.jogoAcabou) return;
    
    const novoJogo = new JogoCampoMinado(jogo.largura, jogo.altura, jogo.totalMinas);
    Object.assign(novoJogo, JSON.parse(JSON.stringify(jogo)));
    novoJogo.revelarCelula(x, y);
    setJogo(novoJogo);
    setTempo(novoJogo.getTempo());
  };

  const cliqueDireito = (e, x, y) => {
    e.preventDefault();
    if (!jogo || jogo.jogoAcabou) return;
    
    const novoJogo = new JogoCampoMinado(jogo.largura, jogo.altura, jogo.totalMinas);
    Object.assign(novoJogo, JSON.parse(JSON.stringify(jogo)));
    novoJogo.alternarBandeira(x, y);
    setJogo(novoJogo);
  };

  const cliqueDuplo = (x, y) => {
    if (!jogo || jogo.jogoAcabou) return;
    
    const novoJogo = new JogoCampoMinado(jogo.largura, jogo.altura, jogo.totalMinas);
    Object.assign(novoJogo, JSON.parse(JSON.stringify(jogo)));
    novoJogo.cliqueDuplo(x, y);
    setJogo(novoJogo);
    setTempo(novoJogo.getTempo());
  };

  const getEmojiReiniciar = () => {
    if (!jogo) return '😊';
    if (jogo.vitoria) return '😎';
    if (jogo.jogoAcabou) return '😵';
    return '😊';
  };

  const getMensagemJogo = () => {
    if (!jogo) return null;
    
    if (jogo.vitoria) {
      return { texto: '🎉 Parabéns! Você venceu! 🎉', tipo: 'mensagem-vitoria' };
    } else if (jogo.jogoAcabou) {
      return { texto: '💥 Game Over! Tente novamente! 💥', tipo: 'mensagem-derrota' };
    }
    
    return null;
  };

  // Adicionar evento de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        novoJogo();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [novoJogo]);

  const mensagem = getMensagemJogo();

  return (
    <div className="container">
      <h1>🎯 Campo Minado</h1>
      
      <div className="controles-dificuldade">
        <button 
          className={`botao-dificuldade ${dificuldadeAtual === 'facil' ? 'ativo' : ''}`}
          onClick={() => alterarDificuldade('facil')}
        >
          Fácil (9x9 - 10 minas)
        </button>
        <button 
          className={`botao-dificuldade ${dificuldadeAtual === 'intermediario' ? 'ativo' : ''}`}
          onClick={() => alterarDificuldade('intermediario')}
        >
          Intermediário (16x16 - 40 minas)
        </button>
        <button 
          className={`botao-dificuldade ${dificuldadeAtual === 'dificil' ? 'ativo' : ''}`}
          onClick={() => alterarDificuldade('dificil')}
        >
          Difícil (16x30 - 99 minas)
        </button>
      </div>

      <div className="controles-jogo">
        <div className="contador contador-minas">
          <span>💣</span>
          <span id="minas-restantes">
            {jogo ? Math.max(0, jogo.getMinasRestantes()).toString().padStart(3, '0') : '010'}
          </span>
        </div>
        
        <button className="botao-reiniciar" onClick={novoJogo}>
          <span id="emoji-reiniciar">{getEmojiReiniciar()}</span>
          Reiniciar
        </button>
        
        <div className="contador contador-tempo">
          <span>⏱️</span>
          <span id="tempo">{tempo.toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div className="tabuleiro-container">
        {jogo && (
          <div 
            className={`tabuleiro ${jogo.vitoria ? 'vitoria' : ''}`}
            style={{ 
              gridTemplateColumns: `repeat(${jogo.largura}, 35px)`
            }}
          >
            {jogo.tabuleiro.map((linha, y) =>
              linha.map((celula, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`celula ${
                    celula.revelada ? 'revelada' : ''
                  } ${
                    celula.revelada && celula.temMina ? 'mina-revelada' : ''
                  } ${
                    celula.bandeira ? 'bandeira' : ''
                  } ${
                    celula.interrogacao ? 'interrogacao' : ''
                  }`}
                  data-valor={celula.revelada && !celula.temMina && celula.valor > 0 ? celula.valor : ''}
                  onClick={() => cliqueEsquerdo(x, y)}
                  onContextMenu={(e) => cliqueDireito(e, x, y)}
                  onDoubleClick={() => cliqueDuplo(x, y)}
                >
                  {celula.revelada ? (
                    celula.temMina ? '💣' : (celula.valor > 0 ? celula.valor : '')
                  ) : (
                    celula.bandeira ? '🚩' : (celula.interrogacao ? '?' : '')
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {mensagem && (
        <div className={`mensagem-jogo mostrar ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="instrucoes">
        <h3>🎮 Como Jogar:</h3>
        <p><strong>Clique Esquerdo:</strong> Revelar célula</p>
        <p><strong>Clique Direito:</strong> Colocar/remover bandeira (🚩)</p>
        <p><strong>Clique Duplo:</strong> Revelar células adjacentes (quando número coincide com bandeiras)</p>
        <p><strong>Tecla R:</strong> Reiniciar jogo</p>
      </div>
    </div>
  );
};

export default CampoMinado;
