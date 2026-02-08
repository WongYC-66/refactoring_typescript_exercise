export abstract class Component {
  render(): void {
    console.log("Rendering component");
  }

  onClick(): void {
    console.log("Clicked");
  }

  onHover(): void {
    console.log("Hovered");
  }

  enable(): void {
    console.log("Enabled");
  }

  disable(): void {
    console.log("Disabled");
  }
}

export class Button extends Component {
  render(): void {
    console.log("Rendering button");
  }
}

export class IconButton extends Button {
  render(): void {
    console.log("Rendering icon button");
  }
}

export class TextField extends Component {
  onClick(): void {
    throw new Error("TextField cannot be clicked");
  }
}

