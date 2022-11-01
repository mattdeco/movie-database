import { Info } from "../pages/Info";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";

export default {
  root: "home",
  routes: [
    {
      path: "home",
      component: Home,
    },
    {
      path: "movie/:movieId${/[0-9]{3,8}/i}",
      component: Info,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: "*",
      component: NotFound,
    },
  ],
};
