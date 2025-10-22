class CampoMinado {
    constructor() {
        this.QUANTIDADE_MINAS = 10;
        this.MINA = -1;
        this.VAZIO = 0;
        this.VAZIO_JOGO = -2;
        this.MINA_MARCADA = -3;
        this.QUANTIDADE_LINHAS = 9;
        this.QUANTIDADE_COLUNAS = 9;

        this.matriz = [];
        this.matrizJogo = [];
        this.gameOver = false;
        this.quantidadeMinasEscondidas = this.QUANTIDADE_MINAS;
        this.quantidadeMinasMarcadas = 0;

        this.vizinhosParaRevelar = [];
        this.vizinhosRevelados = [];

        this.inicializar();
    }

    inicializar() {
        // Inicializar matrizes
        this.matriz = Array(this.QUANTIDADE_LINHAS).fill().map(() => Array(this.QUANTIDADE_COLUNAS).fill(0));
        this.matrizJogo = Array(this.QUANTIDADE_LINHAS).fill().map(() => Array(this.QUANTIDADE_COLUNAS).fill(this.VAZIO));
        
        this.gameOver = false;
        this.quantidadeMinasEscondidas = this.QUANTIDADE_MINAS;
        this.quantidadeMinasMarcadas = 0;
        this.vizinhosParaRevelar = [];
        this.vizinhosRevelados = [];

        // Colocar minas
        for (let i = 0; i < this.QUANTIDADE_MINAS; i++) {
            this.colocarMinas();
        }

        // Calcular vizinhos
        this.mudarVizinhos();
    }

    colocarMinas() {
        let linha, coluna;
        do {
            linha = Math.floor(Math.random() * this.QUANTIDADE_LINHAS);
            coluna = Math.floor(Math.random() * this.QUANTIDADE_COLUNAS);
        } while (this.matriz[linha][coluna] === this.MINA);

        this.matriz[linha][coluna] = this.MINA;
    }

    mudarVizinhos() {
        const direcoes = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (let i = 0; i < this.QUANTIDADE_LINHAS; i++) {
            for (let j = 0; j < this.QUANTIDADE_COLUNAS; j++) {
                if (this.matriz[i][j] !== this.MINA) {
                    let count = 0;
                    for (const [dx, dy] of direcoes) {
                        const ni = i + dx;
                        const nj = j + dy;
                        if (ni >= 0 && ni < this.QUANTIDADE_LINHAS && nj >= 0 && nj < this.QUANTIDADE_COLUNAS) {
                            if (this.matriz[ni][nj] === this.MINA) {
                                count++;
                            }
                        }
                    }
                    this.matriz[i][j] = count;
                }
            }
        }
    }

    jogar(linha, coluna, operacao) {
        if (this.gameOver || linha < 0 || linha >= this.QUANTIDADE_LINHAS || coluna < 0 || coluna >= this.QUANTIDADE_COLUNAS) {
            return false;
        }

        // Operação 1: Revelar
        if (operacao === 1 && this.matrizJogo[linha][coluna] === this.VAZIO) {
            if (this.matriz[linha][coluna] === this.MINA) {
                this.matrizJogo[linha][coluna] = this.MINA;
                this.gameOver = true;
                return true;
            }

            if (this.matriz[linha][coluna] > 0) {
                this.matrizJogo[linha][coluna] = this.matriz[linha][coluna];
            }

            if (this.matriz[linha][coluna] === this.VAZIO) {
                this.revelaVizinhos(linha, coluna);
                while (this.vizinhosParaRevelar.length > 0) {
                    const vizinho = this.vizinhosParaRevelar.shift();
                    this.revelaVizinhos(vizinho.linha, vizinho.coluna);
                }
            }
        }

        // Operação 2: Marcar mina
        if (operacao === 2) {
            if (this.matrizJogo[linha][coluna] === this.VAZIO && this.quantidadeMinasMarcadas < this.QUANTIDADE_MINAS) {
                this.matrizJogo[linha][coluna] = this.MINA_MARCADA;
                this.quantidadeMinasMarcadas++;
                if (this.matriz[linha][coluna] === this.MINA) {
                    this.quantidadeMinasEscondidas--;
                }
            }
        }

        // Operação 3: Desmarcar mina
        if (operacao === 3) {
            if (this.matrizJogo[linha][coluna] === this.MINA_MARCADA) {
                this.matrizJogo[linha][coluna] = this.VAZIO;
                this.quantidadeMinasMarcadas--;
                if (this.matriz[linha][coluna] === this.MINA) {
                    this.quantidadeMinasEscondidas++;
                }
            }
        }

        return true;
    }

    revelaVizinhos(i, j) {
        this.matrizJogo[i][j] = this.VAZIO_JOGO;

        const vizinhoRevelado = { linha: i, coluna: j };
        this.vizinhosRevelados.push(vizinhoRevelado);

        const index = this.vizinhosParaRevelar.findIndex(v => v.linha === i && v.coluna === j);
        if (index > -1) {
            this.vizinhosParaRevelar.splice(index, 1);
        }

        const direcoes = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dx, dy] of direcoes) {
            const ni = i + dx;
            const nj = j + dy;
            
            if (ni >= 0 && ni < this.QUANTIDADE_LINHAS && nj >= 0 && nj < this.QUANTIDADE_COLUNAS) {
                if (this.matriz[ni][nj] !== this.MINA && this.matrizJogo[ni][nj] === this.VAZIO) {
                    if (this.matriz[ni][nj] === this.VAZIO) {
                        this.matrizJogo[ni][nj] = this.VAZIO_JOGO;
                        const novoVizinho = { linha: ni, coluna: nj };
                        if (!this.vizinhosRevelados.some(v => v.linha === ni && v.coluna === nj)) {
                            this.vizinhosParaRevelar.push(novoVizinho);
                        }
                    } else {
                        this.matrizJogo[ni][nj] = this.matriz[ni][nj];
                    }
                }
            }
        }
    }

    todasCelulasMarcadas() {
        for (let i = 0; i < this.QUANTIDADE_LINHAS; i++) {
            for (let j = 0; j < this.QUANTIDADE_COLUNAS; j++) {
                if (this.matrizJogo[i][j] === this.VAZIO) {
                    return false;
                }
            }
        }
        return true;
    }

    getQuantidadeMinasMarcadas() {
        return this.QUANTIDADE_MINAS - this.quantidadeMinasMarcadas;
    }
}

class GameUI {
    constructor() {
        this.game = new CampoMinado();
        this.timer = 0;
        this.timerInterval = null;
        this.isFirstMove = false;

        this.initializeElements();
        this.initializeEventListeners();
        this.renderBoard();
        this.updateUI();
    }

    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.minasCount = document.getElementById('minas-count');
        this.timerDisplay = document.getElementById('timer');
        this.restartBtn = document.getElementById('restart-btn');
        this.gameOverScreen = document.getElementById('game-over');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.playAgainBtn = document.getElementById('play-again-btn');
    }

    initializeEventListeners() {
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
        
        // Prevenir menu contextual no clique direito
        this.gameBoard.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        
        for (let i = 0; i < this.game.QUANTIDADE_LINHAS; i++) {
            for (let j = 0; j < this.game.QUANTIDADE_COLUNAS; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // Clique esquerdo
                cell.addEventListener('click', (e) => this.handleCellClick(e, i, j, 1));
                
                // Clique direito
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellClick(e, i, j, 2);
                });

                this.gameBoard.appendChild(cell);
            }
        }
        
        this.updateBoard();
    }

    updateBoard() {
        const cells = this.gameBoard.getElementsByClassName('cell');
        
        for (let cell of cells) {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const cellValue = this.game.matrizJogo[row][col];
            
            cell.className = 'cell';
            cell.textContent = '';
            
            if (cellValue === this.game.VAZIO) {
                // Célula não revelada
                cell.classList.add('hidden');
            } else if (cellValue === this.game.VAZIO_JOGO) {
                // Célula vazia revelada
                cell.classList.add('revealed');
            } else if (cellValue === this.game.MINA_MARCADA) {
                // Mina marcada
                cell.classList.add('flagged');
                cell.textContent = '%';
            } else if (cellValue === this.game.MINA) {
                // Mina revelada
                cell.classList.add('revealed', 'mine');
                cell.textContent = '@';
            } else if (cellValue > 0) {
                // Número revelado
                cell.classList.add('revealed', `number-${cellValue}`);
                cell.textContent = cellValue;
            }
        }
    }

    handleCellClick(event, row, col, operation) {
        if (!this.isFirstMove) {
            this.isFirstMove = true;
            this.startTimer();
        }

        if (this.game.jogar(row, col, operation)) {
            this.updateBoard();
            this.updateUI();
            this.checkGameStatus();
        }
    }

    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timerDisplay.textContent = this.timer;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateUI() {
        this.minasCount.textContent = this.game.getQuantidadeMinasMarcadas();
    }

    checkGameStatus() {
        if (this.game.gameOver) {
            this.showGameOver(false);
        } else if (this.game.todasCelulasMarcadas() && this.game.quantidadeMinasEscondidas === 0) {
            this.showGameOver(true);
        }
    }

    showGameOver(isWin) {
        this.stopTimer();
        
        if (isWin) {
            this.gameOverMessage.textContent = 'VOCÊ VENCEU O JOGO!!!';
            this.gameOverMessage.className = 'win-message';
        } else {
            this.gameOverMessage.textContent = 'GAME OVER! Você atingiu uma mina.';
            this.gameOverMessage.className = 'lose-message';
            this.revealAllMines();
        }
        
        this.gameOverScreen.classList.remove('hidden');
    }

    revealAllMines() {
        for (let i = 0; i < this.game.QUANTIDADE_LINHAS; i++) {
            for (let j = 0; j < this.game.QUANTIDADE_COLUNAS; j++) {
                if (this.game.matriz[i][j] === this.game.MINA) {
                    this.game.matrizJogo[i][j] = this.game.MINA;
                }
            }
        }
        this.updateBoard();
    }

    restartGame() {
        this.stopTimer();
        this.game.inicializar();
        this.timer = 0;
        this.timerDisplay.textContent = '0';
        this.isFirstMove = false;
        this.gameOverScreen.classList.add('hidden');
        this.renderBoard();
        this.updateUI();
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});