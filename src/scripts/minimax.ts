import { Nodo } from "./classes";
import * as Collections from 'typescript-collections';
import { coordinate, coordinates, matrix } from "../Interfaces/interfaces";

export function posiblesMovientos(pos: coordinate, matriz: matrix): coordinates {
    let auxCoordinatesI: number[][] = [[2, -2], [1, -1]];

    //Posibles movimientos de pos
    let mov1: coordinates = [[pos[0] + auxCoordinatesI[0][0], pos[1] + auxCoordinatesI[1][0]], [pos[0] + auxCoordinatesI[0][0], pos[1] + auxCoordinatesI[1][1]]]; //Cuadrante 1 
    let mov2: coordinates = [[pos[0] + auxCoordinatesI[0][1], pos[1] + auxCoordinatesI[1][0]], [pos[0] + auxCoordinatesI[0][1], pos[1] + auxCoordinatesI[1][1]]]; //Cuadrante 2 
    let mov3: coordinates = [[pos[0] + auxCoordinatesI[1][1], pos[1] + auxCoordinatesI[0][0]], [pos[0] + auxCoordinatesI[1][1], pos[1] + auxCoordinatesI[0][1]]]; //Cuadrante 3 
    let mov4: coordinates = [[pos[0] + auxCoordinatesI[1][0], pos[1] + auxCoordinatesI[0][0]], [pos[0] + auxCoordinatesI[1][0], pos[1] + auxCoordinatesI[0][1]]]; //Cuadrante 4 

    let mov: coordinates = [];
    mov.push(...mov1, ...mov2, ...mov3, ...mov4)
    mov = mov.filter(pos => {
        if (pos[0] >= 0 && pos[0] <= 7 && pos[1] >= 0 && pos[1] <= 7) {
            return (matriz[pos[0]][pos[1]] == 1 || matriz[pos[0]][pos[1]] == 0 || matriz[pos[0]][pos[1]] == 2 || matriz[pos[0]][pos[1]] == 5)
        }
    })

    return mov
}

export function puntuacionMovimiento(movimiento: coordinate, p_monedas: coordinates, p_monedas_especiales: coordinates): number {
    for (let i = 0; i < p_monedas_especiales.length; i++) {
        if (movimiento[0] === p_monedas_especiales[i][0] && movimiento[1] === p_monedas_especiales[i][1]) {
            return 3;
        }
    }

    for (let i = 0; i < p_monedas.length; i++) {
        if (movimiento[0] === p_monedas[i][0] && movimiento[1] === p_monedas[i][1]) {
            return 1;
        }
    }

    return 0;
}

export function heuristica(n_puntosIA: number, n_puntosJugador: number, movimientos: coordinates, p_monedas_especiales: coordinates, p_monedas: coordinates, matriz: matrix): number {
    let posiblesMonedas = 0

    for (let j = 0; j < movimientos.length; j++) {
        if(matriz[movimientos[j][0]][movimientos[j][1]] == 5) continue;
        for (let i = 0; i < p_monedas_especiales.length; i++) {
            if (movimientos[j][0] === p_monedas_especiales[i][0] && movimientos[j][1] === p_monedas_especiales[i][1]) {
                posiblesMonedas += 1;
            }
        }
    }

    for (let j = 0; j < movimientos.length; j++) {
        if(matriz[movimientos[j][0]][movimientos[j][1]] == 5) continue;
        for (let i = 0; i < p_monedas.length; i++) {
            if (movimientos[j][0] === p_monedas[i][0] && movimientos[j][1] === p_monedas[i][1]) {
                posiblesMonedas += 0.5;
            }
        }
    }

    return n_puntosIA - n_puntosJugador + posiblesMonedas;
}

function juego_terminado(p_monedas_normales: coordinates, p_monedas_especiales: coordinates) {
    return (p_monedas_especiales.length === 0 && p_monedas_normales.length === 0);
}

export function ganador(n_puntosIA: number, n_puntosJugador: number): number {
    if (n_puntosIA > n_puntosJugador) return 3;
    else if (n_puntosIA < n_puntosJugador) return 4;
    else return 0;
}

export function obtenerDificultad(dificultad: string): number {
    switch (dificultad) {
        case "Facil":
            return 2;
        case "Intermedio":
            return 4;
        case "Dificil":
            return 6;
    }
    return 0;
}

function eliminarMoneda(pos: coordinate, p_monedas: coordinates): coordinates {
    return p_monedas.filter((moneda) => {
        return !(moneda[0] === pos[0] && moneda[1] === pos[1]);
    })
}

export function minimax(matrix: matrix, p_monedas: coordinates, p_monedas_especiales: coordinates, p_jugadores: coordinates, puntos_rojo:number, puntos_verde:number, dificultad_juego: string = "Facil") {
    function crearArbol() {
        let NodoRaiz = new Nodo(null, 0, p_jugadores[1], p_jugadores[0], 0, p_monedas, p_monedas_especiales, "MAX", -Infinity, puntos_rojo, puntos_verde);

        let vector: Nodo[] = [];
        vector.push(NodoRaiz);

        let dificultad = obtenerDificultad(dificultad_juego);
        let profundidad = 0;
        let indice = 0;

        while (profundidad < dificultad) {
            profundidad++;
            for (let nodo of vector) {
                if (nodo.getProfundidad() == (profundidad - 1)) {
                    if (juego_terminado(nodo.getPosicionesMonedas(), nodo.getPosicionesMonedasEspeciales())) {
                        let ganador_ = ganador(nodo.p_IA, nodo.p_Jugador)
                        if (ganador_ == 3) nodo.setUtilidad(1000);
                        else if (ganador_ == 4) nodo.setUtilidad(-1000);
                        else nodo.setUtilidad(0);
                        continue;
                    } else {
                        let movs = posiblesMovientos(nodo.getPosicion(nodo.getTipo()), matrix)
                        for (let mov of movs) {
                            if(matrix[mov[0]][mov[1]] == 5) continue;
                            indice++;
                            let p_mov = puntuacionMovimiento(mov, nodo.getPosicionesMonedas(), nodo.getPosicionesMonedasEspeciales())
                            let new_p_monedas: coordinates
                            let new_p_monedas_esp: coordinates
                            switch (p_mov) {
                                case 1:
                                    new_p_monedas = eliminarMoneda(mov, nodo.getPosicionesMonedas())
                                    new_p_monedas_esp = nodo.getPosicionesMonedasEspeciales()
                                    break;
                                case 3:
                                    new_p_monedas_esp = eliminarMoneda(mov, nodo.getPosicionesMonedasEspeciales())
                                    new_p_monedas = nodo.getPosicionesMonedas()
                                    break;
                                default:
                                    new_p_monedas = nodo.getPosicionesMonedas()
                                    new_p_monedas_esp = nodo.getPosicionesMonedasEspeciales()
                                    break;
                            }

                            let tipo = (profundidad % 2 == 0) ? "MAX" : "MIN";
                            let hijo: Nodo;

                            if (tipo === "MIN") {
                                hijo = new Nodo(nodo.indice, indice, mov, nodo.pos_PJ, profundidad, new_p_monedas, new_p_monedas_esp, tipo, Infinity, nodo.p_Jugador, nodo.p_IA + p_mov);
                            } else {
                                hijo = new Nodo(nodo.indice, indice, nodo.pos_IA, mov, profundidad, new_p_monedas, new_p_monedas_esp, tipo, -Infinity, nodo.p_Jugador + p_mov, nodo.p_IA);
                            }

                            if(hijo.getProfundidad() == dificultad){
                                if(juego_terminado(hijo.getPosicionesMonedas(), hijo.getPosicionesMonedasEspeciales())){
                                    let ganador_ = ganador(hijo.p_IA, hijo.p_Jugador)
                                    if (ganador_ == 3) hijo.setUtilidad(1000);
                                    else if (ganador_ == 4) hijo.setUtilidad(-1000);
                                    else hijo.setUtilidad(0);
                                } else {
                                    hijo.setUtilidad(heuristica(hijo.p_IA, hijo.p_Jugador, posiblesMovientos(hijo.getPosicion(hijo.getTipo()), matrix), hijo.getPosicionesMonedasEspeciales(), hijo.getPosicionesMonedas(), matrix))
                                }
                            }

                            vector.push(hijo);
                        }
                    }
                }
            }
        }
        return vector;
    }

    function calcularUtilidad(nodos: Nodo[]) {
        //Subiendo de utilidad
        for (let longitud = nodos.length-1; longitud >= 0; longitud--) {
            if(nodos[longitud].getPadre() == null){
                break;
            }
            else {
                if(nodos[longitud].tipo == "MAX"){
                    if(nodos[longitud].utilidad < nodos[nodos[longitud].padre ?? 0].utilidad){
                        nodos[nodos[longitud].padre ?? 0].utilidad = nodos[longitud].utilidad;
                        nodos[nodos[longitud].padre ?? 0].mejor_mov = nodos[longitud].getPosicion("MIN");
                    }
                } else {
                    if(nodos[longitud].utilidad > nodos[nodos[longitud].padre ?? 0].utilidad){
                        nodos[nodos[longitud].padre ?? 0].utilidad = nodos[longitud].utilidad;
                        nodos[nodos[longitud].padre ?? 0].mejor_mov = nodos[longitud].getPosicion("MAX");
                    }
                }
            }
        }
        return nodos[0].mejor_mov;
    }

    let nodos: Nodo[] = crearArbol();
    return calcularUtilidad(nodos);
}
