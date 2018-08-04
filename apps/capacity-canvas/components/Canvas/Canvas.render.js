import template from './Canvas.svg.html'
import { htmlToElement } from 'lib/utils/dom'

export default canvas => {
  const canvasContent = htmlToElement(template)

  if (canvas.childElementCount) {
    canvas.replaceChild(canvasContent, canvas.childNodes[0])
  } else {
    canvas.appendChild(canvasContent)
  }

  return canvasContent
}
