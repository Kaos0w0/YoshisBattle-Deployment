/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
/* eslint-disable no-inner-declarations */
import { useEffect } from 'react';
import { coordinate, matrix, coordinates } from '../Interfaces/interfaces';
import { minimax, posiblesMovientos } from '../scripts/minimax';

interface MapaProps {
  difficulty: 'Facil' | 'Intermedio' | 'Dificil' | undefined;
  stopAudio: () => void;
}

let puntos_verde = 0;
let puntos_rojo = 0;
const divsConListeners: { div: HTMLElement; eventHandler: unknown; }[] = [];

// Función que retorna el índice de un vector en una matriz (array de arrays)
// Ej. matriz = [[1,2],[3,4]] vector = [3,4] retorna 1
function indiceSubArray(matriz: coordinates, vector: coordinate) {
  return matriz.findIndex((e) => e[0] === vector[0] && e[1] === vector[1]);
}

// Función que retorna true si un vector está en una matriz (array de arrays)
// Ej. matriz = [[1,2],[3,4]] vector = [3,4] retorna true
function existeSubArray(matriz: coordinates, vector: coordinate) {
  return matriz.some((e) => e[0] === vector[0] && e[1] === vector[1]);
}

// Funcion que determina si el juego ha terminado partiendo de la no existencia de monedas
function noHayMonedas(p_monedas_normales: coordinates, p_monedas_especiales: coordinates) {
  return (p_monedas_especiales.length === 0 && p_monedas_normales.length === 0);
}

function calcular_ruta_en_l(posicion_inicial: coordinate, posicion_final: coordinate, jugador: number, matriz: matrix) {
  const posicion_inicial_x = posicion_inicial[0];
  const posicion_inicial_y = posicion_inicial[1];
  const posicion_final_x = posicion_final[0];
  const posicion_final_y = posicion_final[1];

  const dy = Math.abs(posicion_final_x - posicion_inicial_x);
  const dx = Math.abs(posicion_final_y - posicion_inicial_y);

  const paso_y = posicion_inicial_x < posicion_final_x ? 1 : -1;
  const paso_x = posicion_inicial_y < posicion_final_y ? 1 : -1;

  const otro_jugador = jugador === 3 ? 4 : 3;
  const x1 = posicion_inicial_x;
  const y1 = posicion_inicial_y;

  // Se verifica si el otro jugador está en la ruta
  const no_p_in_route1 = ((y1 + 1 <= 7) && (y1 + 2 <= 7) && (matriz[x1][y1 + 1] !== otro_jugador) 
  && (matriz[x1][y1 + 2] !== otro_jugador))

  const no_p_in_route2 = ((y1 - 1 >= 0) && (y1 - 2 >= 0) && (matriz[x1][y1 - 1] !== otro_jugador)
    && (matriz[x1][y1 - 2] !== otro_jugador))

  const no_p_in_route3 = ((x1 + 1 <= 7) && (x1 + 2 <= 7) && (matriz[x1 + 1][y1] !== otro_jugador)
    && (matriz[x1 + 2][y1] !== otro_jugador))

  const no_p_in_route4 = ((x1 - 1 >= 0) && (x1 - 2 >= 0) && (matriz[x1 - 1][y1] !== otro_jugador)
    && (matriz[x1 - 2][y1] !== otro_jugador))

  if(dx === 2 && dy === 1){
    if(paso_x === 1){
      if(paso_y === 1){
          return no_p_in_route1 === true ? ['derecha', 'derecha', 'abajo'] : ['abajo', 'derecha', 'derecha']
      } else {
          return no_p_in_route1 === true ? ['derecha', 'derecha', 'arriba'] : ['arriba', 'derecha', 'derecha']
      }
    } else {
      if(paso_y === 1){
          return no_p_in_route2 === true ? ['izquierda', 'izquierda', 'abajo'] : ['abajo', 'izquierda', 'izquierda']
      } else {
          return no_p_in_route2 === true ? ['izquierda', 'izquierda', 'arriba'] : ['arriba', 'izquierda', 'izquierda']
      }
    }
  } else if(dx === 1 && dy === 2){
    if(paso_y === 1){
      if(paso_x === 1){
          return no_p_in_route3 === true ? ['abajo', 'abajo', 'derecha'] : ['derecha', 'abajo', 'abajo']
      } else {
          return no_p_in_route3 === true ? ['abajo', 'abajo', 'izquierda'] : ['izquierda', 'abajo', 'abajo']
      }
    } else {
      if(paso_x === 1){
          return no_p_in_route4 === true ? ['arriba', 'arriba', 'derecha'] : ['derecha', 'arriba', 'arriba']
      } else {
          return no_p_in_route4 === true ? ['arriba', 'arriba', 'izquierda'] : ['izquierda', 'arriba', 'arriba']
      }
    }
  } else {
    return []
  }
}

function animar_movimiento(camino: string[], jugador: number, origen: coordinate, matriz: matrix) {
  const yoshi = document.getElementById(jugador === 3 ? 'yoshi-verde' : 'yoshi-rojo');
  let posicion_inicial_x = origen[0];
  let posicion_inicial_y = origen[1];
  if(!yoshi){ return; }
  yoshi.style.transition = 'translate 0.5s linear';

  const intervalo = setInterval(() => {
    const divOrigen = document.getElementById(`cell ${posicion_inicial_x}-${posicion_inicial_y}`);
    const hijoDiv = divOrigen?.lastChild;
    let divDestino: HTMLElement | null = null;
    if(!divOrigen || !hijoDiv){ return; }

    switch(matriz[posicion_inicial_x][posicion_inicial_y]){
      case 0:
        if(divOrigen.childElementCount > 1) break;
        const image = document.createElement('img');
        image.setAttribute('src', '../src/assets/elementos_juego/monedas/invisible2.png');
        image.setAttribute('width', '55%');
        divOrigen.appendChild(image);
        break;
      case 1:
        if(divOrigen.childElementCount > 1) break;
        const image2 = document.createElement('img');
        image2.setAttribute('src', '../src/assets/elementos_juego/monedas/normal.gif');
        image2.setAttribute('width', '40%');
        image2.setAttribute('top', '50%');
        image2.setAttribute('position', 'relative');
        image2.setAttribute('z-index', '0');
        divOrigen.appendChild(image2);
        break;
      case 2:
        if(divOrigen.childElementCount > 1) break;
        const image4 = document.createElement('img');
        image4.setAttribute('src', '../src/assets/elementos_juego/monedas/especial.gif');
        image4.setAttribute('width', '50%');
        image4.setAttribute('top', '50%');
        image4.setAttribute('position', 'relative');
        image4.setAttribute('z-index', '0');
        image4.style.alignItems = 'center';
        divOrigen.appendChild(image4);
        break;
      default:
        break;
    }

    switch(camino[0]){
      case 'arriba':
        yoshi.setAttribute('src', jugador === 3 ? '../src/assets/elementos_juego/green/up/3.png' : '../src/assets/elementos_juego/red/up/3.png');
        posicion_inicial_x--;
        divDestino = document.getElementById(`cell ${posicion_inicial_x}-${posicion_inicial_y}`);
        if(!divDestino){ return; }
        const hijoDivDestino = divDestino?.firstChild;
        if(matriz[posicion_inicial_x][posicion_inicial_y] in [0,2,5]){
          hijoDivDestino ? divDestino?.removeChild(hijoDivDestino) : null;
        }
        // yoshi.style.top = `${divDestino.offsetHeight}px`;
        yoshi.style.transform = `-${divDestino.offsetHeight}px`;
        divDestino?.appendChild(yoshi);
        break;
      case 'abajo':
        yoshi.setAttribute('src', jugador === 3 ? '../src/assets/elementos_juego/green/down/3.png' : '../src/assets/elementos_juego/red/down/3.png');
        posicion_inicial_x++;
        divDestino = document.getElementById(`cell ${posicion_inicial_x}-${posicion_inicial_y}`);
        if(!divDestino){ return; }
        const hijoDivDestino2 = divDestino?.firstChild;
        if(matriz[posicion_inicial_x][posicion_inicial_y] in [0,2,5]){
          hijoDivDestino2 ? divDestino?.removeChild(hijoDivDestino2) : null;
        }
        // yoshi.style.top = `${divDestino.offsetHeight}px`;
        yoshi.style.transform = `${divDestino.offsetHeight}px`;
        divDestino?.appendChild(yoshi);
        break;
      case 'derecha':
        yoshi.setAttribute('src', jugador === 3 ? '../src/assets/elementos_juego/green/right/3.png' : '../src/assets/elementos_juego/red/right/3.png');
        posicion_inicial_y++;
        divDestino = document.getElementById(`cell ${posicion_inicial_x}-${posicion_inicial_y}`);
        if(!divDestino){ return; }
        const hijoDivDestino3 = divDestino?.firstChild;
        if(matriz[posicion_inicial_x][posicion_inicial_y] in [0,2,5]){
          hijoDivDestino3 ? divDestino?.removeChild(hijoDivDestino3) : null;
        }
        // yoshi.style.left = `${divDestino.offsetWidth}px`;
        yoshi.style.transform = `${divDestino.offsetWidth}px`;
        divDestino?.appendChild(yoshi);
        break;
      case 'izquierda':
        yoshi.setAttribute('src', jugador === 3 ? '../src/assets/elementos_juego/green/left/3.png' : '../src/assets/elementos_juego/red/left/3.png');
        posicion_inicial_y--;
        divDestino = document.getElementById(`cell ${posicion_inicial_x}-${posicion_inicial_y}`);
        if(!divDestino){ return; }
        const hijoDivDestino4 = divDestino?.firstChild;
        if(matriz[posicion_inicial_x][posicion_inicial_y] in [0,2,5]){
          hijoDivDestino4 ? divDestino?.removeChild(hijoDivDestino4) : null;
        }
        // yoshi.style.left = `${divDestino.offsetWidth}px`;
        yoshi.style.transform = `-${divDestino.offsetWidth}px`;
        divDestino?.appendChild(yoshi);
        break;
      }

      if(camino.length === 1){
        const hijoDivDestino = divDestino?.firstChild;
        hijoDivDestino ? divDestino?.removeChild(hijoDivDestino) : null;
        if(posicion_inicial_y < 4){
          yoshi.setAttribute('src', jugador === 3 ? '../src/assets/elementos_juego/green/idle/1.png' : '../src/assets/elementos_juego/red/idle/1.png');
        } else {
          yoshi.setAttribute('src', jugador === 3 ? '../src/assets/elementos_juego/green/idle/2.png' : '../src/assets/elementos_juego/red/idle/2.png');
        }
      }
      camino.shift();
      if(camino.length === 0){
        clearInterval(intervalo);
      }

    }, 600);
}

function actualizar_matriz(matriz: matrix, p_jugadores: coordinates, p_monedas_normales: coordinates, p_monedas_especiales: coordinates, mejor_jugada: coordinate, jugador: number) {
  const indiceMoneda = indiceSubArray(p_monedas_normales, mejor_jugada);
  const indiceMonedaEspecial = indiceSubArray(p_monedas_especiales, mejor_jugada);
  const p_jugador = jugador === 3 ? 1 : 0;
  animar_movimiento(calcular_ruta_en_l(p_jugadores[p_jugador], mejor_jugada, jugador, matriz), jugador, p_jugadores[p_jugador], matriz);
  matriz[mejor_jugada[0]][mejor_jugada[1]] = jugador;
  if (indiceMoneda !== -1) {
    const sonidoMoneda = new Audio('../src/assets/elementos_juego/sonidos/coin.wav');
    setTimeout(() => { sonidoMoneda.play() }, 1800);
    jugador === 3 ? puntos_verde++ : puntos_rojo++;
    p_monedas_normales.splice(indiceMoneda, 1);
    matriz[mejor_jugada[0]][mejor_jugada[1]] = 5;
  } else if (indiceMonedaEspecial !== -1) {
    const sonidoMoneda = new Audio('../src/assets/elementos_juego/sonidos/ecoin.wav');
    setTimeout(() => { sonidoMoneda.play() }, 1800);
    jugador === 3 ? puntos_verde += 3 : puntos_rojo += 3;
    p_monedas_especiales.splice(indiceMonedaEspecial, 1);
    matriz[mejor_jugada[0]][mejor_jugada[1]] = 5; 
  }
  if(matriz[p_jugadores[p_jugador][0]][p_jugadores[p_jugador][1]] !== 5){
    matriz[p_jugadores[p_jugador][0]][p_jugadores[p_jugador][1]] = 0;
  }  
  p_jugadores[p_jugador] = mejor_jugada;  
  const h3_puntaje_jugador = document.getElementById(jugador === 3 ? 'verde' : 'rojo');
  if(h3_puntaje_jugador){
    setTimeout(() => { 
      h3_puntaje_jugador.innerHTML = jugador === 3 ? `verde: ${puntos_verde}` : `rojo: ${puntos_rojo}`;
    }, 1800);
  }
}

function juegoTerminado(p_monedas_normales: coordinates, p_monedas_especiales: coordinates, _callback?: () => void) {
  if (noHayMonedas(p_monedas_normales, p_monedas_especiales)) {
    if(puntos_verde > puntos_rojo){
      setTimeout(() => { document.getElementById('turno') ? document.getElementById('turno')!.innerHTML = '¡GANA VERDE!' : null; }, 1000);
      const sonidoVictoria = new Audio('../src/assets/elementos_juego/sonidos/iawin.wav');
      _callback ? _callback() : null;
      sonidoVictoria.play();
    } else if(puntos_verde < puntos_rojo){
      setTimeout(() => { document.getElementById('turno') ? document.getElementById('turno')!.innerHTML = '¡GANA ROJO!' : null; }, 1000);
      const sonidoVictoria = new Audio('../src/assets/elementos_juego/sonidos/pjwin.wav');
      _callback ? _callback() : null;
      sonidoVictoria.play();
    } else {
      setTimeout(() => { document.getElementById('turno') ? document.getElementById('turno')!.innerHTML = '¡EMPATE!' : null; }, 1000);
      const sonidoEmpate = new Audio('../src/assets/elementos_juego/sonidos/empate.wav');
      _callback ? _callback() : null;
      sonidoEmpate.play();
    }
    return true;
  } else {
    return false;
  }
}

function turnoIA(matriz: matrix, p_monedas_normales: coordinates, p_monedas_especiales: coordinates, p_jugadores: coordinates, dificultad: 'Facil' | 'Intermedio' | 'Dificil' | undefined, _callback?: () => void) {
  if(juegoTerminado(p_monedas_normales, p_monedas_especiales, _callback)){
    return;
  } else {
    const mejor_jugada = minimax(matriz, p_monedas_normales, p_monedas_especiales, p_jugadores,puntos_rojo, puntos_verde,dificultad);
    if(mejor_jugada === null){ return; }
    actualizar_matriz(matriz, p_jugadores, p_monedas_normales, p_monedas_especiales, mejor_jugada, 3);
    setTimeout(() => {
      turnoHumano(matriz, p_monedas_normales, p_monedas_especiales, p_jugadores, dificultad, _callback);
      document.getElementById('turno') ? document.getElementById('turno')!.innerHTML = 'turno de: rojo' : null;
    }, 2000);
  } 
}

function turnoHumano(matriz: matrix, p_monedas_normales: coordinates, p_monedas_especiales: coordinates,  p_jugadores: coordinates, dificultad: 'Facil' | 'Intermedio' | 'Dificil' | undefined, _callback?: () => void){
  if (juegoTerminado(p_monedas_normales, p_monedas_especiales, _callback)) {
    return;
  } else {
    const movimientos = posiblesMovientos(p_jugadores[0], matriz);
    for (let i = 0; i < movimientos.length; i++) {
      if(matriz[movimientos[i][0]][movimientos[i][1]] === 5){
        divsNoDisponibles(`cell ${movimientos[i][0]}-${movimientos[i][1]}`);
      } else {
        agregarClickListenerADivs(`cell ${movimientos[i][0]}-${movimientos[i][1]}`, matriz, p_monedas_normales, p_monedas_especiales, p_jugadores, dificultad, _callback);
      }
    }
  }
}

function divsNoDisponibles(divId: string) {
  const div = document.getElementById(divId);
  if (div) {
    function handleClick() {}
    div.className = 'no-clickable';
    divsConListeners.push({ div, eventHandler: handleClick });
  }
}

function agregarClickListenerADivs(divId: string, matriz: matrix, p_monedas_normales: coordinates, p_monedas_especiales: coordinates, p_jugadores: coordinates, dificultad: 'Facil' | 'Intermedio' | 'Dificil' | undefined, _callback?: () => void) {
  const div = document.getElementById(divId);
  if (div) {
    div.className = 'clickable';
    function handleClick() {
      div ? div.removeEventListener('click', handleClick) : null;
      div ? div.className = '' : null;
      eliminarEventListenersDeDivs();
      const jugada = divId.split(' ')[1].split('-').map(e => parseInt(e));
      actualizar_matriz(matriz, p_jugadores, p_monedas_normales, p_monedas_especiales, (jugada as coordinate), 4);      
      setTimeout(() => {
        document.getElementById('turno') ? document.getElementById('turno')!.innerHTML = 'turno de: verde' : null;
        turnoIA(matriz, p_monedas_normales, p_monedas_especiales, p_jugadores, dificultad, _callback);
      }, 2000);
    }
    div.addEventListener('click', handleClick);
    divsConListeners.push({ div, eventHandler: handleClick });
  }
}

function eliminarEventListenersDeDivs() {
  divsConListeners.forEach(({ div, eventHandler }) => {
    div.removeEventListener('click', eventHandler as EventListener);
    div.className = '';
  });

  // Limpiar la lista de divs con event listeners
  divsConListeners.length = 0;
}

const Map: React.FC<MapaProps> = ({ difficulty, stopAudio }) => {
  let matrizYaFueCreada = false;
  let matrizYaFueDibujada = false;
  const matriz_juego: matrix = Array(8).fill(0).map(() => Array(8).fill(0));
  const posicionMonedasNormales: coordinates = [[0, 0], [0, 7], [7, 0], [7, 7], [1, 0], [0, 1], [1, 7], [7, 1], [6, 0], [0, 6], [6, 7], [7, 6]];
  const posicionMonedasEspeciales: coordinates = [[3, 3], [3, 4], [4, 3], [4, 4]];
  const posicionesDisponibles: coordinates = [];
  const posicionJugadores: coordinates = [];
  function generarMatriz() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (existeSubArray(posicionMonedasNormales, [i, j])) {
          matriz_juego[i][j] = 1;
        } else if (existeSubArray(posicionMonedasEspeciales, [i, j])) {
          matriz_juego[i][j] = 2;
        } else {
          posicionesDisponibles.push([i, j]);
        }
      }
    }
    let posicionesAleatorias = 0;
     while (posicionesAleatorias < 2) {
       // posicionJugadores = [[posicion yoshi rojo], [posicion yoshi verde]]]
       const randomIndex = Math.floor(Math.random() * posicionesDisponibles.length);
       const randomPosition = posicionesDisponibles[randomIndex];
       posicionesAleatorias == 1 ? matriz_juego[randomPosition[0]][randomPosition[1]] = 3 : matriz_juego[randomPosition[0]][randomPosition[1]] = 4;
       posicionesAleatorias++;
       posicionJugadores.push(randomPosition);
       posicionesDisponibles.splice(randomIndex, 1);
    }
    matrizYaFueCreada = true;
  }


  useEffect(() => {
    if (!matrizYaFueCreada) {
      generarMatriz();
    }
    const container = document.getElementById('seccion-medio');
    if (container && document.getElementById('cell 0-0') === null) {
      for (let i = 0; i < 8; i++) {
        const row = document.createElement('div');
        row.setAttribute('id', 'row');
        row.style.display = 'table-row';
        container.appendChild(row);
        for (let j = 0; j < 8; j++) {
          const div = document.createElement('div');
          div.style.border = '1px dashed #9e9c9c';
          div.style.display = 'table-cell';
          div.style.textAlign = 'center';
          div.style.position = 'relative';
          div.style.width = '12.5%';
          if (matriz_juego[i][j] === 0) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/invisible2.png');
            image.setAttribute('width', '55%');
            image.setAttribute('position', 'relative');
            image.setAttribute('z-index', '0');
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 1) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/normal.gif');
            image.setAttribute('width', '40%');
            image.setAttribute('top', '50%');
            image.setAttribute('position', 'relative');
            image.setAttribute('z-index', '0');
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 2) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/especial.gif');
            image.setAttribute('width', '50%');
            image.setAttribute('top', '50%');
            image.setAttribute('position', 'relative');
            image.setAttribute('z-index', '0');
            image.style.alignItems = 'center';
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 3) {
            const image = document.createElement('img');
            if (j < 4) {
              image.setAttribute('src', '../src/assets/elementos_juego/green/idle/1.png');
            } else {
              image.setAttribute('src', '../src/assets/elementos_juego/green/idle/2.png');
            }
            image.setAttribute('width', '60%');
            image.setAttribute('height', 'auto');
            image.setAttribute('id', 'yoshi-verde')
            image.setAttribute('top', '0px');
            image.setAttribute('left', '0px');
            image.setAttribute('position', 'relative');
            image.setAttribute('z-index', '1');
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 4) {
            const image = document.createElement('img');
            if (j < 4) {
              image.setAttribute('src', '../src/assets/elementos_juego/red/idle/1.png');
            } else {
              image.setAttribute('src', '../src/assets/elementos_juego/red/idle/2.png');
            }
            image.setAttribute('width', '60%');
            image.setAttribute('height', 'auto');
            image.setAttribute('id', 'yoshi-rojo')
            image.setAttribute('top', '0px');
            image.setAttribute('left', '0px');
            image.setAttribute('position', 'relative');
            image.setAttribute('z-index', '1');
            div.appendChild(image);
          }
          div.setAttribute('id', `cell ${i}-${j}`);
          row.appendChild(div);
        }
      }
      if(!matrizYaFueDibujada){
        matrizYaFueDibujada = true;
        setTimeout(() => {
          turnoIA(matriz_juego, posicionMonedasNormales, posicionMonedasEspeciales, posicionJugadores, difficulty, stopAudio);
        }, 2000);
      }
    }
  }, []);

  return (
    <>
      <div id="contenedor">
        <div id="mapa">
          <div id="seccion-izquierda"></div>
          <div id="seccion-centro">
            <div id="seccion-medio"></div>
          </div>
          <div id="seccion-derecha"></div>
        </div>
        <div id="puntuacion" className=''>
          <h3 id='dificultad'>{difficulty?.toUpperCase()}</h3>
          <br></br>
          <br></br>
          <h3 id='turno'>turno de: verde</h3>
          <br></br>
          <h3 id='rojo'>rojo: {puntos_rojo}</h3>
          <h3 id='verde'>verde: {puntos_verde}</h3>
          <button id='exit' onClick={() => window.location.reload()}>salir</button>   
        </div>
      </div>
    </>
  );
}

export default Map;
