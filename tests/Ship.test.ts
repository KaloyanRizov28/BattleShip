import { createShip } from '../src/classes/Ship';

describe('Ship', () => {
    it('should create a ship with correct properties', () => {
        const startPlacement = { x: 0, y: 0 };
        const endPlacement = { x: 0, y: 2 };
        const ship = createShip(3, 1, startPlacement, endPlacement);

        expect(ship.length).toBe(3);
        expect(ship.startPlacment).toEqual(startPlacement);
        expect(ship.endPlacment).toEqual(endPlacement);
        expect(ship.indetifierBoard).toBe(1);
        expect(ship.hits).toBe(0);
        expect(ship.isSunk).toBe(false);
    });

    it('should track hits correctly', () => {
        const ship = createShip(2, 1, { x: 0, y: 0 }, { x: 0, y: 1 });
        
        ship.hit();
        expect(ship.hits).toBe(1);
        expect(ship.isSunk).toBe(false);

        ship.hit();
        expect(ship.hits).toBe(2);
        expect(ship.isSunk).toBe(true);
    });

    it('should allow hits beyond ship length', () => {
        const ship = createShip(1, 1, { x: 0, y: 0 }, { x: 0, y: 0 });
        
        ship.hit();
        ship.hit(); // Extra hit
        
        expect(ship.hits).toBe(2);
        expect(ship.isSunk).toBe(true);
    });
});