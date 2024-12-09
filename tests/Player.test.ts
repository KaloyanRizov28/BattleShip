import { createPlayer } from '../src/classes/Player';
import { CreateGameBoard, GameBoard } from '../src/classes/GameBoard';

// Mock the GameBoard module
jest.mock('../src/classes/GameBoard.ts', () => ({
    CreateGameBoard: jest.fn(() => ({
        
    }))
}));

describe('Player', () => {
    test('createPlayer should create a computer player', () => {
        const player = createPlayer(true);
        
        expect(player.isComputer).toBe(true);
        expect(player.board).toBeDefined();
        expect(CreateGameBoard).toHaveBeenCalled();
    });

    test('createPlayer should create a human player', () => {
        const player = createPlayer(false);
        
        expect(player.isComputer).toBe(false);
        expect(player.board).toBeDefined();
        expect(CreateGameBoard).toHaveBeenCalled();
    });
});