export interface Nodo{
    padre: number | null;
    indice: number;
    pos_IA: coordinate;
    pos_PJ: coordinate;
    profundidad: number;
    posiciones_monedas: coordinates;
    posiciones_monedas_especiales: coordinates;
    tipo: string;
    utilidad: number;

    // getPosicion(): coordinates;
    // getProfundidad(): number;
    // getHeuristica(): number;
    // getPosicionesMonedas(): coordinates;
    // getTipo(): string;
    // getPadre(): Nodo | null;
    // getUtilidad(): number;

    // setUtilidad(utilidad: number): void;
}
export type coordinate_exp = {x_pos: number, y_pos: number};
export type coordinate = [number, number];
export type coordinates = coordinate[]
export type matrix = number[][];