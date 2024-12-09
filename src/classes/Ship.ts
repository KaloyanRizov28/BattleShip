import { SignatureKind } from "typescript";


export interface Coordinates {
    x: number;
    y: number;
}


 export interface Ship {
    length: number;
    hits: number;
    isSunk: boolean;
    hit(): void;
    startPlacment:Coordinates;
    endPlacment:Coordinates;
    indetifierBoard : number;
}





export const createShip = (length : number,indetifierBoard:number, startPlacment:Coordinates, endPlacment:Coordinates) : Ship => {
    
    let hits = 0;
    
    


    

    return {
     length,
     startPlacment,
     endPlacment,
     indetifierBoard,
     get hits() { return hits; },
     get isSunk() { return hits >= length; },
     hit() {
         {hits++}
     }
    };
  };