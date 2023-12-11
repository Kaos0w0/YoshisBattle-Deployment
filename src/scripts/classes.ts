import { Nodo as NodoInterface, coordinate, coordinates} from "../Interfaces/interfaces";

export class Nodo implements NodoInterface {
    padre: number | null;
    indice: number;
    pos_IA: coordinate;
    pos_PJ: coordinate;
    profundidad: number;
    posiciones_monedas: coordinates;
    posiciones_monedas_especiales: coordinates;
    tipo: string;
    utilidad: number;   
    p_Jugador:number;
    p_IA:number;
    mejor_mov: coordinate | null;
    hijo:Nodo | null;
    constructor(padre:number | null, indice: number ,pos_IA:coordinate,pos_PJ:coordinate, profundidad:number, posiciones_monedas:coordinates,posiciones_monedas_especiales:coordinates, tipo:string, utilidad:number,p_Jugador:number = 0,p_IA:number =0) {
        this.padre = padre;
        this.indice = indice;
        this.pos_IA = pos_IA;
        this.pos_PJ = pos_PJ;
        this.profundidad = profundidad;
        this.posiciones_monedas = posiciones_monedas;
        this.posiciones_monedas_especiales = posiciones_monedas_especiales;
        this.tipo = tipo;
        this.utilidad = utilidad;
        this.p_Jugador = p_Jugador;
        this.p_IA = p_IA;
        this.mejor_mov = null;
        this.hijo = null;
    }

    getPuntuacion(tipo: string): number {
        if(tipo == "MAX"){
            return this.p_IA;
        }else{
            return this.p_Jugador;
        }
    }

    getPadre(): number | null {
        return this.padre;
    }

    getIndice(): number {
        return this.indice;
    }

    setMejorMov(movimiento: coordinate): void {
        this.mejor_mov = movimiento;
    }

    getPosicion(tipo:String): coordinate {
        if(tipo == "MAX"){
            return this.pos_IA;
        }else{
            return this.pos_PJ;

        }
    }
    

    getProfundidad(): number {
        return this.profundidad;
    }

    getPosicionesMonedas(): coordinates {
        return this.posiciones_monedas;
    }

    getPosicionesMonedasEspeciales(): coordinates {
        return this.posiciones_monedas_especiales;
    }

    getTipo(): string {
        return this.tipo;
    }

    getTipoContrario(): string {
        if(this.tipo == "MAX"){
            return "MIN";
        }else{
            return "MAX";
        }
    }

    getUtilidad(): number {
        return this.utilidad;
    }

    setUtilidad(utilidad: number): void {
        this.utilidad = utilidad;
    }

    setPuntuacion(puntuacion: number, tipo: string): void {
        if(tipo == "MAX"){
            this.p_IA = puntuacion;
        }else{
            this.p_Jugador = puntuacion;
        }
    }
    setHijo(hijo:Nodo):void{
        this.hijo = hijo;
    }
}