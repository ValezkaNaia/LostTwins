// src/components/puzzle_test/PuzzleGame.js

/**
 * Inicializa o minijogo de Puzzle.
 * Esta função manipula diretamente o DOM para criar um jogo de quebra-cabeças
 * onde o jogador deve arrastar as peças para a posição correta.
 * 
 * @param {HTMLElement} container - O elemento HTML onde o jogo será desenhado.
 * @param {Function} onWin - Função de callback executada quando o jogador vence.
 */
export function initPuzzle(container, onWin) {
    // Se o contentor não existir, sai da função para evitar erros
    if (!container) return;

    // Inicializa o som de clique para feedback auditivo
    const clickSound = new Audio('/sounds/click.mp3'); 
    
    // Array com os nomes das imagens possíveis para o puzzle
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg']; 
    
    // Seleciona aleatoriamente uma imagem da lista para ser usada no jogo atual
    const randomImg = `/image-puzzle/${images[Math.floor(Math.random() * images.length)]}`;
    
    // Contador para rastrear quantas peças foram colocadas corretamente
    let placedCount = 0;
    
    // Limpa qualquer conteúdo HTML anterior dentro do contentor
    container.innerHTML = ''; 

    // Cria o elemento principal que envolve todo o jogo
    const wrapper = document.createElement('div');
    wrapper.className = 'puzzle-container';
    
    // Cria a área do tabuleiro (a grelha onde as peças serão encaixadas)
    const board = document.createElement('div');
    board.className = 'puzzle-board';

    // Dica Visual (Imagem Fantasma): Cria uma camada com a imagem completa translúcida
    // Isto serve de guia para o jogador saber onde colocar cada peça
    const guide = document.createElement('div');
    guide.className = 'puzzle-guide';
    guide.style.backgroundImage = `url(${randomImg})`;
    board.appendChild(guide);

    // Cria a área de inventário onde as peças desordenadas ficarão disponíveis
    const inventory = document.createElement('div');
    inventory.className = 'puzzle-inventory';

    /**
     * Função auxiliar para criar uma peça individual do puzzle.
     * Calcula a posição correta da imagem de fundo baseada no ID da peça.
     * 
     * @param {number} id - O identificador único da peça (0 a 24).
     * @param {boolean} isLocked - Se verdadeiro, a peça já está no tabuleiro e não pode ser movida.
     */
    const createPiece = (id, isLocked) => {
        const piece = document.createElement('div');
        
        // Calcula as coordenadas X e Y para o recorte da imagem (assumindo peças de 80x80px)
        const x = (id % 5) * 80;
        const y = Math.floor(id / 5) * 80;
        
        // Define a classe CSS. Adiciona 'piece-success' se a peça estiver bloqueada (correta)
        piece.className = 'puzzle-piece' + (isLocked ? ' piece-success' : '');
        piece.style.backgroundImage = `url(${randomImg})`;
        
        // Ajusta a posição do fundo para mostrar apenas a parte correta da imagem
        piece.style.backgroundPosition = `-${x}px -${y}px`;
        
        // Se a peça não estiver bloqueada (está no inventário), torna-a arrastável
        if (!isLocked) {
            piece.draggable = true;
            piece.id = `piece-${id}`;
            // Evento iniciado ao arrastar: guarda o ID da peça na transferência de dados
            piece.ondragstart = (e) => e.dataTransfer.setData("text", id);
        }
        return piece;
    };

    /**
     * Lida com o evento de largar (Drop) uma peça num slot do tabuleiro.
     * Verifica se a peça largada corresponde à posição correta.
     */
    const handleDrop = (e, targetId, slotElement) => {
        e.preventDefault(); // Previne o comportamento padrão do navegador
        
        // Recupera o ID da peça que estava a ser arrastada
        const draggedId = parseInt(e.dataTransfer.getData("text"));
        
        // Verifica se o ID da peça corresponde ao ID do slot (posição correta)
        if (draggedId === targetId) {
            // Adiciona a peça ao slot, agora marcada como bloqueada (isLocked = true)
            slotElement.appendChild(createPiece(targetId, true));
            
            // Remove a peça original do inventário para não duplicar
            const invItem = document.getElementById(`inv-${draggedId}`);
            if (invItem) invItem.remove();
            
            // Reinicia e toca o som de encaixe
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            
            // Incrementa o progresso
            placedCount++;
            
            // Verifica se todas as 25 peças foram colocadas (Vitória)
            if (placedCount === 25) {
                // Adiciona classe para animação de desaparecimento suave
                wrapper.classList.add('puzzle-fade-out');
                // Aguarda a animação terminar (800ms) antes de chamar o callback de vitória
                setTimeout(onWin, 800);
            }
        }
    };

    // Loop para criar os 25 slots do tabuleiro (grelha 5x5)
    for (let i = 0; i < 25; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        
        // Permite que o elemento receba drops (necessário prevenir o default)
        slot.ondragover = (e) => e.preventDefault();
        
        // Define o que acontece quando se larga uma peça aqui
        slot.ondrop = (e) => handleDrop(e, i, slot);
        
        board.appendChild(slot);
    }

    // Criação do inventário com peças baralhadas
    // 1. Cria um array de 0 a 24.
    // 2. Usa sort() com Math.random() para baralhar a ordem.
    const shuffledIds = Array.from({length: 25}, (_, i) => i).sort(() => Math.random() - 0.5);
    
    shuffledIds.forEach(id => {
        const invItem = document.createElement('div');
        invItem.id = `inv-${id}`; // ID para facilitar a remoção posterior
        invItem.className = 'inventory-item-container';
        
        // Cria a peça jogável (isLocked = false) e adiciona ao contentor
        invItem.appendChild(createPiece(id, false));
        inventory.appendChild(invItem);
    });

    // Montagem final: adiciona tabuleiro e inventário ao wrapper, e o wrapper ao contentor principal
    wrapper.appendChild(board);
    wrapper.appendChild(inventory);
    container.appendChild(wrapper);
}