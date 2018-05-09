export const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}

export const updateProps = (root, context = root) => {
  Array.from(root.querySelectorAll('[data-prop]')).forEach(clickable => {
    const attribute = clickable.getAttribute('data-prop')
    const [componentProperty, key] = attribute.split(':')
    clickable[componentProperty] = context[key]
  })
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

export const createChildListObserver = (targetNode, onChange) => {
  const callback = mutationList => {
    const mutation = mutationList.find(m => m.type === 'childList')
    if (mutation) {
      onChange(mutation)
    }
  }
  const observer = new window.MutationObserver(callback)
  observer.observe(targetNode, { childList: true })
  return observer.disconnect
}
