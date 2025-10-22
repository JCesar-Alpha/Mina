class CampoMinado {
    constructor(largura = 9, altura = 9, minas = 10) {
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
        // Criar tabuleiro vazio
        this.tabuleiro = [];
        for (let y = 0; y < this.altura; y++) {
            this.tabuleiro[y] = [];
            for (let x = 0; x < this.largura; x++) {
                this.tabuleiro[y][x] = {
                    temMina: false,
                    revelada: false,
                    bandeira: false,
                    interrogação: false,
                    valor: 0, // 0 = vazia, 1-8 = número de minas adjacentes
                    x: x,
                    y: y
                };
            }
        }
    }

    iniciarJogo(primeiroX, primeiroY) {
        this.jogoIniciado = true;
        this.jogoAcabou = false;
        this.vitoria = false;
        this.celulasReveladas = 0;
        this.bandeirasColocadas = 0;
        this.tempo = 0;
        
        // Iniciar timer
        this.iniciarTimer();
        
        // Distribuir minas (evitando a primeira célula clicada)
        this.distribuirMinas(primeiroX, primeiroY);
        
        // Calcular números adjacentes
        this.calcularAdjacentes();
    }

    distribuirMinas(excluirX, excluirY) {
        let minasColocadas = 0;
        
        while (minasColocadas < this.totalMinas) {
            const x = Math.floor(Math.random() * this.largura);
            const y = Math.floor(Math.random() * this.altura);
            
            // Não colocar mina na célula inicial nem nas adjacentes
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
        
        // Não revelar se já está revelada, com bandeira ou interrogação
        if (celula.revelada || celula.bandeira || celula.interrogação || this.jogoAcabou) {
            return;
        }

        celula.revelada = true;
        this.celulasReveladas++;

        if (celula.temMina) {
            this.fimDeJogo(false);
            return;
        }

        // Se for célula vazia (valor 0), revelar recursivamente
        if (celula.valor === 0) {
            this.revelarVizinhos(x, y);
        }

        // Verificar vitória
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
                
                if (!vizinho.revelada && !vizinho.bandeira && !vizinho.interrogação) {
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
        
        if (!celula.bandeira && !celula.interrogação) {
            // Colocar bandeira
            celula.bandeira = true;
            this.bandeirasColocadas++;
        } else if (celula.bandeira) {
            // Remover bandeira e colocar interrogação
            celula.bandeira = false;
            celula.interrogação = true;
            this.bandeirasColocadas--;
        } else if (celula.interrogação) {
            // Remover interrogação
            celula.interrogação = false;
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
                
                if (!vizinho.revelada && !vizinho.bandeira && !vizinho.interrogação) {
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
            // Revelar todas as minas
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
        this.jogoIniciado = false;
        this.jogoAcabou = false;
        this.vitoria = false;
        this.celulasReveladas = 0;
        this.bandeirasColocadas = 0;
        this.tempo = 0;
    }

    // Métodos para interface
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

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CampoMinado;
}
