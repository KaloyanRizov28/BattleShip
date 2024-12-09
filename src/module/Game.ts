import { displayWinningPage, createShipyard , buttonEventContinueHandle, updateCell,} from "./DOMcontroller"

import { createPlayer , Player} from "../classes/Player";
import { Coordinates } from "../classes/Ship";
import { createMessageDisplay } from "./DOMcontroller";



export const GameFlow = (function() {
    let players: Player[] = [];
    let lastHit: Coordinates | null = null;
    let adjacentTargets: Coordinates[] = [];

    players.push(createPlayer(false));
    players.push(createPlayer(true));

    
    autoPlaceShips(players[1])

    function computerTurn() {
        let attackX: number;
        let attackY: number;
    
        if (adjacentTargets.length > 0) {
            const nextTarget = adjacentTargets.pop()!;
            attackX = nextTarget.x;
            attackY = nextTarget.y;
        } else {
            do {
                attackX = Math.floor(Math.random() * 10);
                attackY = Math.floor(Math.random() * 10);
            } while (
                players[0].board.tiles[attackX][attackY] === 9 ||  // Miss
                players[0].board.tiles[attackX][attackY] === -1    // Hit
            );
        }
    
        
        const previousValue = players[0].board.tiles[attackX][attackY];
        players[0].board.reciveAttack({ x: attackX, y: attackY });
    
       
        if (previousValue !== 0) {
            lastHit = { x: attackX, y: attackY };
            
            
            const adjacent = [
                { x: attackX - 1, y: attackY },
                { x: attackX + 1, y: attackY },
                { x: attackX, y: attackY - 1 },
                { x: attackX, y: attackY + 1 }
            ];
    
            
            const newTargets = adjacent.filter(pos => {
                if (pos.x < 0 || pos.x >= 10 || pos.y < 0 || pos.y >= 10) return false;
                
                const value = players[0].board.tiles[pos.x][pos.y];
                return value !== 9 && value !== -1; 
            });
    
            adjacentTargets.push(...newTargets);
        }
    
        updateCell(players[0], 'grid1', attackX, attackY);
    
        if(players[0].board.areAllShipsSunk()) {
            console.log("Computer Wins");
            displayWinningPage("Computer")
        }
    }
    function autoPlaceShips(player: Player) {
        const ships = [
            { length: 5, id: 1 },
            { length: 4, id: 2 },
            { length: 3, id: 3 },
            { length: 3, id: 4 },
            { length: 2, id: 5 }
        ];
    
        for (const ship of ships) {
            let placed = false;
            
            while (!placed) {
                try {
                    const isVertical = Math.random() < 0.5;
                    const startX = Math.floor(Math.random() * 10);
                    const startY = Math.floor(Math.random() * 10);
                    const endX = isVertical ? startX + ship.length - 1 : startX;
                    const endY = isVertical ? startY : startY + ship.length - 1;
                    
                    if (endX >= 10 || endY >= 10) continue;
                    
                    player.board.placeShip(
                        ship.length,
                        ship.id,
                        { x: startX, y: startY },
                        { x: endX, y: endY }
                    );
                    
                    placed = true;
                } catch (error) {
                    continue;
                }
            }
        }
    }

    const startingButton = document.querySelector(".start-button");
    startingButton?.addEventListener("click", ((e: Event) => {
        
        createShipyard(players[0]);
        buttonEventContinueHandle(players[0], players[1], computerTurn);
    }) as EventListener);

    
    return {};
})();