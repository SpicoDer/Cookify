import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    // Getting the hash id base on url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner while fetching data
    recipeView.renderSpinner();

    // Highlight selected recipe in results page
    resultsView.renderUpdate(model.searchResultsPage());

    // Load and render recipe
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch {
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    // Render spinner while fetching data
    resultsView.renderSpinner();

    // Get and load query
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);

    // Render initial results & pagination buttons
    resultsView.render(model.searchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderErrorMessage();
  }
};

const controlPagination = function (gotoPage) {
  // // Render new initial results & pagination buttons
  resultsView.render(model.searchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  // Update servings
  model.updateServings(servings);

  // Render recipe base on new servings
  recipeView.renderUpdate(model.state.recipe);
};

const controlBookmark = function () {
  // Adding and removing bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.addBookmark(model.state.recipe.id);

  // Updating bookmark icon
  recipeView.renderUpdate(model.state.recipe);
  console.log(model.state.bookmarks);
};

// Listening to events
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPageBtnHandler(controlPagination);
};

init();
