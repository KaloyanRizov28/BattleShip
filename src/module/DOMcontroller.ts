import { Player } from "../classes/Player";

interface ShipUI {
  name: string;
  length: number;
}

type Callback = () => void;


export function createMessageDisplay() {
  const existingDisplay = document.getElementById('attack-message');
  if (existingDisplay) {
      return existingDisplay;
  }

  const container = document.querySelector(".container");
  if (!container) {
      console.error("Could not find container element");
      return null;
  }

  const messageDisplay = document.createElement('div');
  messageDisplay.id = 'attack-message';
  messageDisplay.className = 'attack-message';
  container.appendChild(messageDisplay);
  return messageDisplay;
}

export function showBattleMessage(message: string, duration: number = 5500) {
  const messageDisplay = document.getElementById('attack-message') || createMessageDisplay();
  if (!messageDisplay) return;
  
  messageDisplay.textContent = message;
  messageDisplay.style.display = 'block';
  messageDisplay.style.opacity = '0';
  
  
  setTimeout(() => {
      messageDisplay.style.opacity = '1';
  }, 100);

  setTimeout(() => {
      messageDisplay.style.opacity = '0';
  }, duration - 1000);

  
  setTimeout(() => {
      messageDisplay.style.display = 'none';
  }, duration);
}



export function toggleGridClickable(gridID: string, enabled: boolean) {
    const grid = document.getElementById(gridID);
    if (!grid) {
        console.error(`Could not find grid ${gridID}`);
        return;
    }
    grid.style.pointerEvents = enabled ? 'auto' : 'none';
}

export function createGrid(player: Player, gridId: string, isEnemyOrComp: boolean, computerTurn?: Callback) {
  const grid = document.getElementById(gridId);
  
  if (!grid) {
      console.error(`Could not find grid ${gridId}`);
      return;
  }
  
  grid.innerHTML = '';
  
  for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.id = `${gridId}-${i}-${j}`;
          
          if (isEnemyOrComp) {
              if (player.board.tiles[i][j] === 9) {
                  cell.classList.add('miss');
              }

              cell.addEventListener("click", async () => {
                  
                  if (grid.style.pointerEvents === 'none') {
                      return;
                  }

                  // Prevent multiple clicks during animation
                  if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
                      return;
                  }
                  
                  const shipPresent = player.board.tiles[i][j] > 0 && player.board.tiles[i][j] !== 9;
                  
                  toggleGridClickable('grid1', false);
                  toggleGridClickable('grid2', false);

                  
                  showBattleMessage("Taking aim...", 2000);
                  
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  
                  player.board.reciveAttack({ x: i, y: j });
                  
                  if (shipPresent) {
                      cell.classList.add('hit');
                      showBattleMessage("Direct hit!", 3000);
                  } else if (player.board.tiles[i][j] === 9) {
                      cell.classList.add('miss');
                      showBattleMessage("Miss!", 3000);
                  }
                  
                  await new Promise(resolve => setTimeout(resolve, 3000));
                  
                  if(player.board.areAllShipsSunk()) {
                      showBattleMessage("Victory!", 4000);
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      displayWinningPage("Player");
                      console.log("End game player 0 wins");
                  } else {
                      if (computerTurn) {
                          // Keep grids disabled and start computer turn
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          computerTurn();
                      }
                  }
                  
                  console.log(`attack at ${i} and ${j}`);
              });
          } else {
              if (player.board.tiles[i][j] > 0 && player.board.tiles[i][j] !== 9) {
                  cell.classList.add('occupiedByShip');
              }
          }
          
          grid.appendChild(cell);
      }
  }
}

export function createShipyard(player: Player) {
  const ships: ShipUI[] = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Destroyer", length: 2 }
  ];
  
  const state = {
    isVertical: false
  };
 
  setupContainer(ships, player, state);
}
function setupContainer(ships: ShipUI[], player: Player, state: { isVertical: boolean }) {
  const container = document.querySelector(".container");
  if (!container) throw new Error("Container not found");
  container.innerHTML = "";
  

  const header = document.createElement('div');
  header.classList.add('placement-header');
  header.innerHTML = '<h2>Position Your Fleet</h2>';
  

  const gameArea = document.createElement('div');
  gameArea.classList.add('game-area');
  
  const grid = document.createElement("div");
  grid.setAttribute("id", "stagingGrid");
  grid.classList.add("grid");
  

  const controlSection = document.createElement('div');
  controlSection.classList.add('control-section');
  
  
  const rotateButton = document.createElement('button');
  rotateButton.textContent = 'Rotate Ships';
  rotateButton.classList.add('rotate-button');
  
  
  const buttonContinue = document.createElement('button');
  buttonContinue.textContent = 'Start Battle';
  buttonContinue.classList.add('button-continue');
  buttonContinue.style.display = 'none';
  
 
  const shipyard = createShipyardElement(ships);
  
  controlSection.appendChild(rotateButton);
  controlSection.appendChild(shipyard);
  controlSection.appendChild(buttonContinue);
  
  gameArea.appendChild(grid);
  gameArea.appendChild(controlSection);
  
  container.appendChild(header);
  container.appendChild(gameArea);
  
  // Initialize the grid and event handlers
  createGrid(player, "stagingGrid", false);
  setupDragAndDrop(player, state, rotateButton, buttonContinue);
  
  // Add click handlers for ship rotation
  const shipSlots = document.querySelectorAll('.ship-slot');
  shipSlots.forEach(slot => {
      slot.addEventListener('click', () => {
          if (!slot.classList.contains('vertical')) {
              slot.classList.add('vertical');
          } else {
              slot.classList.remove('vertical');
          }
      });
  });
}
function setupDragAndDrop(
  player: Player, 
  state: { isVertical: boolean }, 
  rotateButton: HTMLButtonElement,
  buttonContinue: HTMLButtonElement
) {
  rotateButton.addEventListener('click', () => {
      state.isVertical = !state.isVertical;
      rotateButton.textContent = `Ships: ${state.isVertical ? 'Vertical' : 'Horizontal'}`;
      const shipyard = document.querySelector(".shipyard")
      
        
      
      const shipSlots = document.querySelectorAll('.ship-slot');
      shipSlots.forEach(slot => {
          if (state.isVertical) {
              slot.classList.add('vertical');
              shipyard?.classList.add("verticalShip")
          } else {
              slot.classList.remove('vertical');
              shipyard?.classList.remove("verticalShip")
          }
      });
  });

  setupDragListeners();
  setupDropListeners(player, state, buttonContinue);
}
function updateBoard(player: Player) {
  const grid = document.getElementById('stagingGrid');
  if (!grid) return;
  grid.innerHTML = '';
  createGrid(player, "stagingGrid", false);
}

function createShipyardElement(ships: ShipUI[]) {
  const shipyard = document.createElement("div");
  shipyard.classList.add("shipyard");
  
  ships.forEach(ship => {
    
    
    const shipElement = document.createElement("div");
    shipElement.classList.add("ship-slot");
    shipElement.draggable = true;
    shipElement.id = ship.name;
    shipElement.dataset.length = ship.length.toString();
    
    
    for (let i = 0; i < ship.length; i++) {
      const segment = document.createElement("div");
      segment.classList.add("ship-segment");
      shipElement.appendChild(segment);
    }
    
    
    shipyard.appendChild(shipElement)
  });
 
  return shipyard;
}




function setupDropListeners(player: Player, state: { isVertical: boolean }, buttonContinue: HTMLButtonElement) {
  const grid = document.getElementById('stagingGrid');
  if (!grid) return;

  grid.addEventListener('dragover', (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (!target.classList.contains('cell')) return;

      clearHighlights();

      const [_, row, col] = target.id.split('-').map(Number);
      const draggedShip = document.querySelector('.ship-slot[dragging="true"]');
      if (!draggedShip) return;

      const shipLength = parseInt(draggedShip.getAttribute('data-length') || '0');
      
      const endRow = state.isVertical ? row + shipLength - 1 : row;
      const endCol = state.isVertical ? col : col + shipLength - 1;
      
      if (endRow < 10 && endCol < 10) {
          for (let i = row; i <= endRow; i++) {
              for (let j = col; j <= endCol; j++) {
                  const cell = document.getElementById(`stagingGrid-${i}-${j}`);
                  if (cell) {
                      const isOccupied = player.board.tiles[i][j] !== 0;
                      cell.classList.add(isOccupied ? 'invalid' : 'highlight');
                  }
              }
          }
      }
  });
  grid.addEventListener('dragleave', () => {
    clearHighlights();
  });

  document.addEventListener('drop', ((e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('cell')) return;
    
    e.preventDefault();
    const dragEvent = e as DragEvent;
    if (!dragEvent.dataTransfer) return;
 
    const data = JSON.parse(dragEvent.dataTransfer.getData('text/plain'));
    const shipLength = parseInt(data.length);
    const [_, row, col] = target.id.split('-').map(Number);

    clearHighlights();
 
    try {
      const startPos = {
        x: row,
        y: col
      };

      const endPos = {
        x: state.isVertical ? row + shipLength - 1 : row,
        y: state.isVertical ? col : col + shipLength - 1
      };

      // Check boundaries
      if (endPos.x >= 10 || endPos.y >= 10) {
        throw new Error("Ship placement out of bounds");
      }
 
      // Check for collisions
      for(let i = startPos.x; i <= endPos.x; i++) {
        for(let j = startPos.y; j <= endPos.y; j++) {
          if(player.board.tiles[i][j] !== 0) {
            throw new Error("Cannot place ship - space is already occupied");
          }
        }
      }
 
      player.board.placeShip(
        shipLength,
        player.board.ships.length + 1,
        startPos,
        endPos
      );
      
      document.getElementById(data.name)?.remove();
      updateBoard(player);

      if (player.board.ships.length === 5) {
        buttonContinue.style.display = 'block';
      }
    } catch (error) {
      console.error(error);
    }
  }) as EventListener);
}

function setupDragListeners() {
  const draggables = document.querySelectorAll<HTMLElement>('.ship-slot');
  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e: Event) => {
      const dragEvent = e as DragEvent;
      if (!dragEvent.dataTransfer) return;
      
      const target = dragEvent.currentTarget as HTMLElement;
      target.setAttribute('dragging', 'true');
      
      
      const dragImage = document.createElement('div');
      dragImage.style.opacity = '0';
      document.body.appendChild(dragImage);
      dragEvent.dataTransfer.setDragImage(dragImage, 0, 0);
      
      
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
      
      dragEvent.dataTransfer.setData('text/plain', JSON.stringify({
        length: target.dataset.length,
        name: target.id
      }));
    });

    draggable.addEventListener('dragend', () => {
      draggable.removeAttribute('dragging');
      clearHighlights();
    });
  });
}



function clearHighlights() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('highlight', 'invalid');
  });
}





export function buttonEventContinueHandle(player: Player, player2: Player, callback?: Callback) {
  const buttonContinue = document.querySelector('.button-continue');
  buttonContinue?.addEventListener("click", ((e: Event) => {
    gameView(player, player2, callback);
  }) as EventListener);
}

function gameView(player: Player, player2: Player, callback?: Callback) {
  const container = document.querySelector(".container");
  if (!container) throw new Error("Container not found");
  container.innerHTML = "";
  createMessageDisplay();

  
  const gameContainer = document.createElement("div");
  gameContainer.classList.add("game-container");
  gameContainer.classList.add("row")
  
  const grid1Wrapper = document.createElement("div");
  grid1Wrapper.classList.add("grid-wrapper");
  const grid2Wrapper = document.createElement("div");
  grid2Wrapper.classList.add("grid-wrapper");

 
  const player1Label = document.createElement("h3");
  player1Label.textContent = "Your Fleet";
  player1Label.classList.add("grid-label");

  const player2Label = document.createElement("h3");
  player2Label.textContent = "Enemy Waters";
  player2Label.classList.add("grid-label");

  const grid1 = document.createElement("div");
  grid1.setAttribute("id", "grid1");
  grid1.classList.add("grid");
 
  const grid2 = document.createElement("div");
  grid2.setAttribute("id", "grid2");
  grid2.classList.add("grid");
  
  
  grid1Wrapper.appendChild(player1Label);
  grid1Wrapper.appendChild(grid1);
  grid2Wrapper.appendChild(player2Label);
  grid2Wrapper.appendChild(grid2);
  
  gameContainer.appendChild(grid1Wrapper);
  gameContainer.appendChild(grid2Wrapper);
  container.appendChild(gameContainer);
  
  createGrid(player, 'grid1', player.isComputer);
  createGrid(player2, 'grid2', player2.isComputer, callback);
}
export async function updateCell(player: Player, gridId: string, x: number, y: number) {
  
  toggleGridClickable('grid1', false);
  toggleGridClickable('grid2', false);

  const cell = document.getElementById(`${gridId}-${x}-${y}`);
  if (!cell) return;

  const value = player.board.tiles[x][y];
  
  cell.classList.remove('hit', 'miss', 'occupiedByShip');

  
  showBattleMessage("Enemy taking aim...", 2000);
  
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (value === 9) {
      cell.classList.add('miss');
      showBattleMessage("Enemy missed!", 3000);
  } else if (value === -1) {
      if (!player.isComputer) {
          cell.classList.add('hit');
          showBattleMessage("Enemy scored a hit!", 3000);
      }
  }

  
  await new Promise(resolve => setTimeout(resolve, 3000));

  
  toggleGridClickable('grid1', true);
  toggleGridClickable('grid2', true);

  return Promise.resolve();
}


export function displayWinningPage(winner: string) {
  const container = document.querySelector(".container");
  if (!container) return;

  container.innerHTML = '';

  const winContent = document.createElement('div');
  winContent.className = 'win-content';
  winContent.innerHTML = `
      <h2>${winner} Wins!</h2>
      <button class="restart-button">Play Again</button>
  `;

  container.appendChild(winContent);

  const restartButton = document.querySelector('.restart-button');
  restartButton?.addEventListener('click', () => {
      location.reload();
  });
}