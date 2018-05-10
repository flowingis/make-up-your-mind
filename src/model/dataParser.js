const decode = string => {
  if (!string) {
    return []
  }

  return string
    .split(',')
    .map(stringPair => stringPair.split('='))
    .map(currentPair => {
      const label = currentPair[0]
      let value = parseInt(currentPair[1], 10) || 0

      if (value < 0) {
        value = 0
      }

      if (value > 100) {
        value = 100
      }

      return {
        label,
        value
      }
    })
}

const encode = data => {
  if (!Array.isArray(data)) {
    return ''
  }

  if (data.length === 0) {
    return ''
  }

  return data.map(element => `${element.label}=${element.value}`).join(',')
}

export default {
  decode,
  encode
}
