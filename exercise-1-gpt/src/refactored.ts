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

const componentRender: render = () => {
  console.log("Rendering component");
}

const componentOnClick: onClick = () => {
  console.log("Clicked");
}

const componentOnHover: onHover = () => {
  console.log("Hovered");
}

const componentOnEnable: enable = () => {
  console.log("Enabled");
}

const componentDisable: disable = () => {
  console.log("Disabled");
}

const buttonRender: render = () => {
  console.log("Rendering button");
}

const iconButtonRender: render = () => {
  console.log("Rendering icon button");
}

const textFieldOnClick: onClick = () => {
  throw new Error("TextField cannot be clicked");
}


export class Button implements Component {
  render = buttonRender
  onClick = componentOnClick
  onHover = componentOnHover
  enable = componentOnEnable
  disable = componentDisable
}

export class IconButton implements Component {
  render = iconButtonRender
  onClick = componentOnClick
  onHover = componentOnHover
  enable = componentOnEnable
  disable = componentDisable
}

export class TextField implements Component {
  render = componentRender
  onClick = textFieldOnClick
  onHover = componentOnHover
  enable = componentOnEnable
  disable = componentDisable
}