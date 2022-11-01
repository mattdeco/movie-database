import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { getData, API_KEY, IMAGE_BASE_URL } from "../lib/api";
import { Tile } from "../components/Tile";

export class Home extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff000000,
      },

      Container: {
        w: 1920,

        Title: {
          mount: 0.5,
          x: 960,
          y: 100,
          text: {
            text: "Upcoming Movies",
            fontSize: 100,
          },
        },

        Results: {
          y: 200,
          color: 0xff808080,
          w: 1920,
          flex: {
            direction: "row",
            wrap: true,
          },
        },
      },
    };
  }

  _handleLeft() {
    if (this.index - 1 >= 0) {
      this.index = this.index - 1;
    }

    let tempRow = Math.floor(this.index / 5);

    if (tempRow < this.row) {
      this.row = tempRow;
      this.tag("Container").patch({
        smooth: {
          y: this.tag("Container").y + 650,
        },
      });
    }
  }

  _handleRight() {
    if (this.index + 1 <= this.tag("Results").children.length - 1) {
      this.index = this.index + 1;
    }

    let tempRow = Math.floor(this.index / 5);

    if (tempRow > this.row) {
      this.row = tempRow;
      this.tag("Container").patch({
        smooth: {
          y: this.tag("Container").y - 650,
        },
      });
    }
  }

  _handleUp() {
    if (this.index - 5 < 0 || this.row == 0) {
      return;
    }

    this.index = this.index - 5;
    this.row = this.row - 1;

    this.tag("Container").patch({
      smooth: {
        y: this.tag("Container").y + 650,
      },
    });
  }

  _handleDown() {
    let maxRows = this.tag("Results").children.length / 5;
    if (this.row == maxRows - 1) {
      return;
    }

    this.index = this.index + 5;
    this.row = this.row + 1;

    this.tag("Container").patch({
      smooth: {
        y: this.tag("Container").y - 650,
      },
    });
  }

  _getFocused() {
    return this.getFocusedTile();
  }

  getFocusedTile() {
    return this.tag("Results").children[this.index];
  }

  _init() {
    this.index = 0;

    this.row = Math.floor(this.index / 5);
    this.column = this.index % 5;

    const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2022&primary_release_date.gte=2022-10-26&with_watch_monetization_types=flatrate`;
    this.getMovies(moviesUrl);
  }

  async getMovies(url) {
    const imageSize = "w342/";

    const data = await getData(url);

    const movies = data.results.map((movie) => {
      return {
        flex: { direction: "column" },

        type: Tile,
        description: movie.overview,
        imageUrl: IMAGE_BASE_URL + imageSize + movie.poster_path,
        movieId: movie.id,
        releaseDate: movie.release_date,
        title: movie.title,
        width: 342,
      };
    });

    this.tag("Results").patch({
      children: movies,
    });
  }
}
