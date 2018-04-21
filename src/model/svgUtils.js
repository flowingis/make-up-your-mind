export const generatePathAttribute = points => {
  let dPathAttribute = points.reduce((accumulator, point, index) => {
    return (
      accumulator + (index === 0 ? 'M' : 'L') + point.x + ' ' + point.y + ' '
    )
  }, '')

  dPathAttribute += 'z'

  return dPathAttribute
}
