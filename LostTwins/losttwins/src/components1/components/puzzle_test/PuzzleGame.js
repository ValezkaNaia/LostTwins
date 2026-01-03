// src/components/puzzle_test/PuzzleGame.js

export function initPuzzle(container, onWin) {
    if (!container) return;

    const clickSound = new Audio('/sounds/click.mp3'); 
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg']; 
    const randomImg = `/image-puzzle/${images[Math.floor(Math.random() * images.length)]}`;
    
    let placedCount = 0;
    container.innerHTML = ''; 

    const wrapper = document.createElement('div');
    wrapper.className = 'puzzle-container';
    
    const board = document.createElement('div');
    board.className = 'puzzle-board';

    // Dica Visual (Imagem Fantasma)
    const guide = document.createElement('div');
    guide.className = 'puzzle-guide';
    guide.style.backgroundImage = `url(${randomImg})`;
    board.appendChild(guide);

    const inventory = document.createElement('div');
    inventory.className = 'puzzle-inventory';

    // Função para criar as peças (Unificada)
    const createPiece = (id, isLocked) => {
        const piece = document.createElement('div');
        const x = (id % 5) * 80;
        const y = Math.floor(id / 5) * 80;
        
        piece.className = 'puzzle-piece' + (isLocked ? ' piece-success' : '');
        piece.style.backgroundImage = `url(${randomImg})`;
        piece.style.backgroundPosition = `-${x}px -${y}px`;
        
        if (!isLocked) {
            piece.draggable = true;
            piece.id = `piece-${id}`;
            piece.ondragstart = (e) => e.dataTransfer.setData("text", id);
        }
        return piece;
    };

    // FUNÇÃO DE DROP (Declarada fora do loop para evitar o aviso do ESLint)
    const handleDrop = (e, targetId, slotElement) => {
        e.preventDefault();
        const draggedId = parseInt(e.dataTransfer.getData("text"));
        
        if (draggedId === targetId) {
            slotElement.appendChild(createPiece(targetId, true));
            const invItem = document.getElementById(`inv-${draggedId}`);
            if (invItem) invItem.remove();
            
            // Som e lógica de vitória
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            
            placedCount++;
            if (placedCount === 25) {
                wrapper.classList.add('puzzle-fade-out');
                setTimeout(onWin, 800);
            }
        }
    };

    // Criar os 25 slots
    for (let i = 0; i < 25; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.ondragover = (e) => e.preventDefault();
        slot.ondrop = (e) => handleDrop(e, i, slot); // Chama a função externa
        board.appendChild(slot);
    }

    // Criar inventário baralhado
    const shuffledIds = Array.from({length: 25}, (_, i) => i).sort(() => Math.random() - 0.5);
    shuffledIds.forEach(id => {
        const invItem = document.createElement('div');
        invItem.id = `inv-${id}`;
        invItem.className = 'inventory-item-container';
        invItem.appendChild(createPiece(id, false));
        inventory.appendChild(invItem);
    });

    wrapper.appendChild(board);
    wrapper.appendChild(inventory);
    container.appendChild(wrapper);
}