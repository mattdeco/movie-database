import { Lightning, Router } from "@lightningjs/sdk";
import { getData, API_KEY, IMAGE_BASE_URL } from "../lib/api";
import { Tile } from "../components/Tile";

export class ExitText extends Lightning.Component {
  static _template() {
    return {
      Text: {
        text: {
          text: "[ Return Home ]",
          textColor: 0xffa3a3a3,
        },
      },
    };
  }

  _focus() {
    this.tag("Text").patch({
      text: {
        textColor: 0xff00ffff,
      },
    });
  }

  _unfocus() {
    this.tag("Text").patch({
      text: {
        textColor: 0xffa3a3a3,
      },
    });
  }

  _handleEnter() {
    Router.navigate("home");
  }
}

export class Info extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff000000,
      },

      Container: {
        Text: {
          mount: 0.5,
          x: 960,
          y: 100,
          text: {
            text: "",
            fontSize: 80,
            textAlign: "center",
          },
        },

        Image: {
          w: 500,
          h: 750,
          x: 100,
          y: 200,
          src: this.bindProp("imageUrl"),
        },

        Metadata: {
          flex: { direction: "column" },
          x: 700,
          y: 200,
          w: 1000,

          Description: {
            text: {
              text: "Loading...",
              fontSize: 40,
              maxLines: 9,
              wordWrapWidth: 1000,
            },
          },

          Release: {
            text: {
              text: "",
              fontSize: 36,
              wordWrapWidth: 1000,
            },
          },
        },
      },

      SimilarTitle: {
        x: 700,
        y: 620,
        text: {
          text: "Similar Movies:",
        },
      },

      Similar: {
        x: 700,
        y: 700,
        flex: { direction: "row" },
        rect: true,
        color: 0xff000000,
      },

      ReturnHome: {
        type: ExitText,
        x: 200,
        y: 1000,
      },
    };
  }

  _init() {
    this.index = 0;
  }

  // when Info is updated
  _enable() {
    this.index = 0;

    this.getMovieInfo();
    this.getSimilarMovies();
  }

  _getFocused() {
    if (this.index == -1) {
      return this.tag("ReturnHome");
    } else {
      return this.getFocusedTile();
    }
  }

  getFocusedTile() {
    return this.tag("Similar").children[this.index];
  }

  _handleLeft() {
    if (this.index - 1 >= 0) {
      this.index = this.index - 1;
    } else {
      this.index = -1;
    }
  }

  _handleRight() {
    if (this.index + 1 <= this.tag("Similar").children.length - 1) {
      this.index = this.index + 1;
    }
  }

  set params(data) {
    this.movieId = data.movieId; // from url

    // from data object
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.releaseDate = data.releaseDate;
    this.title = data.title;
  }

  async getSimilarMovies() {
    const imageSize = "w185/";
    const recommendationUrl = `https://api.themoviedb.org/3/movie/${this.movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`;

    const data = await getData(recommendationUrl);
    const similarMovies = data.results.slice(0, 5).map((movie) => {
      return {
        flex: { direction: "column" },
        type: Tile,
        imageUrl: IMAGE_BASE_URL + imageSize + movie.poster_path,
        movieId: movie.id,
        width: 185,
      };
    });

    this.tag("Similar").patch({
      children: similarMovies,
    });

    this.updateMetadata();
  }

  async getMovieInfo() {
    const movieUrl = `https://api.themoviedb.org/3/movie/${this.movieId}?api_key=${API_KEY}&language=en-US`;
    const imageSize = "w500/";

    const data = await getData(movieUrl);
    this.description = data.overview;
    this.imageUrl = IMAGE_BASE_URL + imageSize + data.poster_path; // get bigger size?
    this.releaseDate = data.release_date;
    this.title = data.title;

    this.updateMetadata();
  }

  updateMetadata() {
    this.tag("Text").patch({
      text: {
        text: this.title,
      },
    });

    this.tag("Description").patch({
      text: {
        text: this.description,
      },
    });

    this.tag("Image").patch({
      src: this.imageUrl,
    });

    this.tag("Release").patch({
      text: {
        text: "Release Date: " + this.releaseDate,
      },
    });
  }
}
