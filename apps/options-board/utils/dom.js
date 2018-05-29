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
