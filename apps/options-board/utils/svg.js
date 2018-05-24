export const getMousePosition = (svg, event) => {
  const CTM = svg.getScreenCTM()
  return {
    x: Math.floor((event.clientX - CTM.e) / CTM.a),
    y: Math.floor((event.clientY - CTM.f) / CTM.d)
  }
}
