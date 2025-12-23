import React, { useState, useEffect } from 'react';

class NPC {
  constructor(x, y, id, npcData) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.name = npcData.name;
    this.minigame = npcData.minigame; // 'TicTacToe' or 'PPT'
    this.dialogueId = npcData.dialogueId;
    this.interactionRadius = 150;
    this.hasInteracted = false;
    this.width = 40;
    this.height = 40;
  }

  isPlayerInRange(playerX, playerY) {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.interactionRadius;
  }

  update(playerX, playerY) {
    // Check if player is close enough to trigger interaction
    if (this.isPlayerInRange(playerX, playerY)) {
      return { canInteract: true, npcId: this.id, minigame: this.minigame };
    }
    return { canInteract: false };
  }

  draw(ctx) {
    // Draw NPC sprite
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw interaction radius indicator when close
    ctx.strokeStyle = '#FFD700';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.interactionRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }
}

export default NPC;