export const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}

export const createAttributesObserver = (targetNode, onChange) => {
  const callback = mutationList => {
    const mutation = mutationList.find(m => m.type === 'attributes')
    if (mutation) {
      onChange(mutation)
    }
  }
  const observer = new window.MutationObserver(callback)
  observer.observe(targetNode, { attributes: true })
  return observer.disconnect
}

export const setChild = (parent, child) => {
  if (parent.childElementCount) {
    parent.replaceChild(child, parent.childNodes[0])
  } else {
    parent.appendChild(child)
  }
}
