const TEMPLATE = '<button>Share</button>'

class ShareButton extends HTMLElement {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
  }

  get url () {
    return this.getAttribute('url')
  }

  set url (url) {
    this.setAttribute('url', url)
  }

  onClick () {
    if (!this.url) {
      return
    }

    navigator.share({
      title: 'Framework Compass Chart',
      text: 'Here your Framework Compass Chart',
      url: this.url
    })
  }

  connectedCallback () {
    if (!navigator.share) {
      return
    }

    this.innerHTML = TEMPLATE
    this.querySelector('button').addEventListener('click', this.onClick)
  }
}

export default ShareButton
