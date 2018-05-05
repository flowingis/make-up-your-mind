export const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}

export const bindEvents = (root, context, ...eventNames) => {
  eventNames.forEach(eventName => {
    const attributeName = `data-bind-${eventName}`
    Array.from(root.querySelectorAll(`[${attributeName}]`)).forEach(
      clickable => {
        const handler = context[clickable.getAttribute(attributeName)].bind(
          context
        )
        clickable.addEventListener(eventName, handler)
      }
    )
  })
}
