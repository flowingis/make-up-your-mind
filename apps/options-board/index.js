import './style/index.scss'
import './components'

window.requestAnimationFrame(() => {
  const board = document.querySelector('app-board')

  board.data = [
    {
      x: 200,
      y: 400
    }
  ]
})
