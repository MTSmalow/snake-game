// Selecionando elementos HTML usando nomes de classe e armazenando-os em variáveis
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// Inicializando variáveis para gerenciar o estado do jogo e a posição da cobra
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obtendo a pontuação mais alta do armazenamento local ou definindo-a como 0 se não estiver disponível
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Recorde: ${highScore}`;

// Função para atualizar a posição da comida no tabuleiro do jogo
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Função para lidar com o fim do jogo, limpando o temporizador e recarregando a página
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Fim do Jogo! Pressione OK para jogar novamente...");
    location.reload();
}

// Função para mudar a direção da cobra com base na tecla pressionada
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Adicionando ouvintes de eventos de clique aos botões de controle para mudar a direção da cobra
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

// Função para inicializar o jogo
const initGame = () => {
    // Verifica se o jogo terminou e lida com isso
    if(gameOver) return handleGameOver();

    // Criando HTML para o elemento de comida e verificando se a cobra comeu a comida
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Pontuação: ${score}`;
        highScoreElement.innerText = `Recorde: ${highScore}`;
    }

    // Atualizando a posição da cabeça da cobra e deslocando os elementos do corpo
    snakeX += velocityX;
    snakeY += velocityY;
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Verificando se a cabeça da cobra atingiu a parede
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    // Renderizando a cobra no tabuleiro do jogo e verificando colisões
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

// Inicializando o jogo atualizando a posição da comida e definindo um intervalo para o loop do jogo
updateFoodPosition();
setIntervalId = setInterval(initGame, 100);

// Adicionando um ouvinte de eventos de tecla para mudar a direção da cobra com base nas setas do teclado
document.addEventListener("keyup", changeDirection);