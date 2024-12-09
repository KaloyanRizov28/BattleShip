import { CreateGameBoard, GameBoard } from "./GameBoard";

export interface Player {
    name?: string;  
    isComputer: boolean;
    board: GameBoard;
}

export const createPlayer = (isComputer: boolean): Player => {
    const board = CreateGameBoard();  
    

    
    return { board, isComputer };
}

