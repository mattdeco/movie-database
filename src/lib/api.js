// w92 w154 w185 w342 500 780
const API_KEY = "a07bf719484c11f2fb0acd47ab9989dd";
const IMAGE_BASE_URL = "http://image.tmdb.org/t/p/";

const getData = async (url) => {
  const data = await fetch(url);

  return data.json();
};

export { getData, API_KEY, IMAGE_BASE_URL };
