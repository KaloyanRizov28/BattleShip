import { CreateGameBoard } from "../src/classes/GameBoard";

describe('GameBoard', () => {
    let gameBoard;

    beforeEach(() => {
        gameBoard = CreateGameBoard();
    });

    describe('initialization', () => {
        test('board should be 10x10', () => {
            expect(gameBoard.tiles.length).toBe(10);
            expect(gameBoard.tiles[0].length).toBe(10);
        });
    });

    describe('ship placement', () => {
        test('places ship horizontally and adds to ships array', () => {
            gameBoard.placeShip(3, 1, { x: 0, y: 0 }, { x: 0, y: 2 });
            
            expect(gameBoard.ships.length).toBe(1);
            expect(gameBoard.tiles[0][0]).toBe(1);
            expect(gameBoard.tiles[0][1]).toBe(1);
            expect(gameBoard.tiles[0][2]).toBe(1);
        });

        test('places ship vertically', () => {
            gameBoard.placeShip(3, 1, { x: 2, y: 3 }, { x: 4, y: 3 });
            
            expect(gameBoard.tiles[2][3]).toBe(1);
            expect(gameBoard.tiles[3][3]).toBe(1);
            expect(gameBoard.tiles[4][3]).toBe(1);
        });

        test('prevents placing overlapping ships', () => {
            gameBoard.placeShip(3, 1, { x: 0, y: 0 }, { x: 0, y: 2 });
            
            expect(() => {
                gameBoard.placeShip(2, 2, { x: 0, y: 1 }, { x: 0, y: 2 });
            }).toThrow();
        });
    });

    describe('receiving attacks', () => {
        beforeEach(() => {
            gameBoard.placeShip(3, 1, { x: 0, y: 0 }, { x: 0, y: 2 });
        });

        test('records hit on ship', () => {
            gameBoard.reciveAttack({ x: 0, y: 1 });
            expect(gameBoard.ships[0].hits).toBe(1);
        });

        test('marks missed shots', () => {
            gameBoard.reciveAttack({ x: 5, y: 5 });
            expect(gameBoard.tiles[5][5]).toBe(9);
        });

        test('can detect when all ships are sunk', () => {
            gameBoard.reciveAttack({ x: 0, y: 0 });
            gameBoard.reciveAttack({ x: 0, y: 1 });
            gameBoard.reciveAttack({ x: 0, y: 2 });
            
            expect(gameBoard.areAllShipsSunk()).toBe(true);
        });
    });
});