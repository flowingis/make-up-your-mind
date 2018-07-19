import get from 'lodash.get'

export const updateProps = (root, context = root) => {
  Array.from(root.querySelectorAll('[data-prop]')).forEach(element => {
    const attribute = element.getAttribute('data-prop')
    const [componentProperty, key] = attribute.split(':')
    element[componentProperty] = get(context, key)
  })
}

export const bindEvents = (root, context, ...eventNames) => {
  eventNames.forEach(eventName => {
    const attributeName = `data-bind-${eventName}`
    Array.from(root.querySelectorAll(`[${attributeName}]`)).forEach(element => {
      const handler = context[element.getAttribute(attributeName)].bind(
        context
      )
      element.addEventListener(eventName, handler)
    })
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
