interface Component {
  render(): void,
  onClick(): void,
  onHover(): void,
  enable(): void,
  disable(): void,
};

interface render {
  (): void
}

interface onClick {
  (): void
}

interface onHover {
  (): void
}

interface enable {
  (): void
}

interface disable {
  (): void
}

class Button implements Component {
  constructor(render: render, onClick: onClick, onHover: onHover, enable: enable, disable: disable) {
    this.render = render
    this.onClick = onClick
    this.onHover = onHover
    this.enable = enable
    this.disable = disable
  }
  render = () => { }
  onClick = () => { }
  onHover = () => { }
  enable = () => { }
  disable = () => { }
}

class IconButton implements Component {
  constructor(render: render, onClick: onClick, onHover: onHover, enable: enable, disable: disable) {
    this.render = render
    this.onClick = onClick
    this.onHover = onHover
    this.enable = enable
    this.disable = disable
  }
  render = () => { }
  onClick = () => { }
  onHover = () => { }
  enable = () => { }
  disable = () => { }
}

class TextField implements Component {
  constructor(render: render, onClick: onClick, onHover: onHover, enable: enable, disable: disable) {
    this.render = render
    this.onClick = onClick
    this.onHover = onHover
    this.enable = enable
    this.disable = disable
  }
  render = () => { }
  onClick = () => { }
  onHover = () => { }
  enable = () => { }
  disable = () => { }
}