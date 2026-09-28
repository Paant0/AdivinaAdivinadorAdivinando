# AdivinaAdivinadorAdivinando

Juego de precisión y percepción temporal. Completa cinco rondas deteniendo el cronómetro lo más cerca posible de cada objetivo.

## Cómo jugar

- Observa el tiempo objetivo de la ronda.
- Presiona **Iniciar** y luego **Detener** cuando creas que ha pasado ese tiempo. También puedes pulsar en cualquier parte del juego o usar Espacio/Enter.
- Revisa el objetivo, tu tiempo, la diferencia absoluta y los puntos obtenidos.
- Presiona **Siguiente ronda** para continuar. Los objetivos son 1.000, 2.000, 3.500, 5.000 y 7.500 segundos.
- Al completar la quinta ronda, consulta la puntuación total, la mejor y peor ronda, y la diferencia promedio.

## Puntuación

Cada ronda empieza con un máximo de 1000 puntos. Se restan 1000 puntos por cada segundo de diferencia absoluta, con un mínimo de cero:

`puntos = máximo(0, redondear(1000 - diferencia × 1000))`

Por ejemplo, una diferencia de 0.027 segundos da 973 puntos. La puntuación total es la suma de las cinco rondas; la diferencia promedio se calcula usando las diferencias reales antes de mostrarlas redondeadas a tres decimales.