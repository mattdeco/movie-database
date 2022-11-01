import { Lightning, Router } from "@lightningjs/sdk";

export class NotFound extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xffff4942,
      },
      Text: {
        mount: 0.5,
        x: 960,
        y: 540,
        text: {
          text: "404 Not Found",
          fontSize: 100,
        },
      },
      SubText: {
        mount: 0.5,
        x: 960,
        y: 900,
        text: {
          text: "[ Press Enter to Return to Home ]",
          fontSize: 42,
        },
      },
    };
  }

  _handleEnter() {
    Router.navigate("home");
  }
}
