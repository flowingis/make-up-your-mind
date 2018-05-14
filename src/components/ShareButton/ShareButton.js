const TEMPLATE = '<button>Share</button>'

class ShareButton extends HTMLElement {
  get url () {
    return this.getAttribute('url')
  }

  set url (url) {
    this.setAttribute('url', url)
  }

  connectedCallback () {
    if (!navigator.share) {
      return
    }

    this.innerHTML = TEMPLATE
  }
}

export default ShareButton
