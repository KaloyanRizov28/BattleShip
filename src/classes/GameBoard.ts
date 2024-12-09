import { createShip , Ship , Coordinates} from "./Ship";

 export interface GameBoard {
    tiles: number[][]
    ships:Ship[];
    placeShip: (length: number, indentifierShip:number, startPlacment:Coordinates, endPlacment:Coordinates ) => void   //indetifier is a number that is placed in the 2d array game board to show where which ship is .
    reciveAttack: (cor: Coordinates) => void
    areAllShipsSunk: () => boolean
}


export const CreateGameBoard = (): GameBoard => {
    
    const initializeBoard = () => Array(10).fill(0).map(() => Array(10).fill(0));
    let tiles = initializeBoard();
    let ships:Ship[] = [];

    const placeShip = (length: number, identifierBoard: number, startPlacement: Coordinates, endPlacement: Coordinates) => {
        
        // Check if any tile in the proposed placement is already occupied
        for(let i = Math.min(startPlacement.x, endPlacement.x); i <= Math.max(startPlacement.x, endPlacement.x); i++) {
            for(let j = Math.min(startPlacement.y, endPlacement.y); j <= Math.max(startPlacement.y, endPlacement.y); j++) {
                if(tiles[i][j] !== 0) {
                    throw new Error("Cannot place ship - space is already occupied");
                }
            }
        }
    
        
        const ship = createShip(length, identifierBoard, startPlacement, endPlacement);
        ships.push(ship);
        
        
        for(let i = Math.min(startPlacement.x, endPlacement.x); i <= Math.max(startPlacement.x, endPlacement.x); i++) {
            for(let j = Math.min(startPlacement.y, endPlacement.y); j <= Math.max(startPlacement.y, endPlacement.y); j++) {
                tiles[i][j] = identifierBoard;
            }
        }
    }
    const reciveAttack = (attackCor: Coordinates) => {
        if(tiles[attackCor.x][attackCor.y] !== 0) {    // check if ship is present 
            const identifiedShip = ships.find(ship => ship.indetifierBoard === tiles[attackCor.x][attackCor.y]);
            if (identifiedShip) {
                identifiedShip.hit();
                // Mark the hit on the board with -1 or another value to indicate a hit
                tiles[attackCor.x][attackCor.y] = -1;  // Or any other value to mark a hit
            }
        }
        else {
            tiles[attackCor.x][attackCor.y] = 9; // 9 for misses
        }   
    }

    const areAllShipsSunk = () => {
        return ships.every(ship => ship.isSunk);
    }
    
    return { tiles, placeShip , ships, reciveAttack , areAllShipsSunk};
    
   
   
   
    
}