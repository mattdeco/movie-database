import { Lightning, Router, Utils } from "@lightningjs/sdk";

export class Tile extends Lightning.Component {
  static _template() {
    return {
      Container: {
        rect: true,
        color: 0xff000000,
        margin: 0.5,
        w: 342,
        h: 630,
        scale: 0.9,

        flex: {
          direction: "column",
          alignContent: "center",
          padding: 20,
        },
        Image: {
          src: this.bindProp("imageUrl"),
        },

        Text: {
          w: 342,
          text: {
            text: this.bindProp("title"),
            textColor: 0xffffffff,
            textSize: 20,
            textAlign: "center",
            maxLines: 3,
          },
        },
      },
    };
  }

  _init() {
    // forces focus state to refocus so 1st tile is automatically in focus

    if (this.width !== 342) {
      this.tag("Container").patch({
        w: this.width,
        h: this.width * 2,
      });

      this.tag("Text").patch({
        w: this.width,
        text: {
          w: this.width,
        },
      });
    }

    this.focusAnim = this.tag("Container").animation({
      duration: 10,
      repeat: -1,
      actions: [
        {
          t: "",
          p: "color",
          v: {
            0: { v: 0xffd11b0a },
            0.15: { v: 0xffd68d1e },
            0.3: { v: 0xffd6d01e },
            0.45: { v: 0xff229c26 },
            0.6: { v: 0xff22619c },
            0.75: { v: 0xff9c225b },
          },
        },
      ],
    });

    this.scaleAnim = this.tag("Container").animation({
      duration: 0.3,
      repeat: 0,
      actions: [
        {
          p: "scale",
          v: {
            0: { v: 1, se: 0 },
            0.2: { v: 1, s: 0 },
            0.6: { v: 1, s: 0 },
            1: 1.1,
          },
        },
        { zIndex: 10 },
      ],
    });

    this._refocus();
  }

  _focus() {
    this.focusAnim.start();
    this.scaleAnim.start();

    this.tag("Container").patch({
      zIndex: 10,
    });

    this.tag("Text").patch({
      text: {
        textColor: 0xff000000,
      },
    });
  }

  _unfocus() {
    this.focusAnim.pause();
    this.scaleAnim.stop();

    this.tag("Container").patch({
      zIndex: 1,
      color: 0xff000000,
    });
    this.tag("Text").patch({
      text: {
        textColor: 0xffffffff,
      },
    });
  }

  _handleEnter() {
    Router.navigate("movie/" + this.movieId);
  }
}
