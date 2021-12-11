/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let showResults = await axios.get("https://api.tvmaze.com/search/shows/", { params: { q: query } });
  console.log(showResults);
  const showsArray = [];
  showResults.data.forEach((item) => {
    showsArray.push(
      {
        id: item.show.id,
        name: item.show.name,
        summary: item.show.summary,
        image: item.show.image.medium
      }
    )
  });
  console.log(showsArray);

  return showsArray;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let imageURL = show.image;
    if (show.image == "null") {
      imageURL = "https://tinyurl.com/tv-missing";
    };
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${imageURL}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="episodeList">Episodes<button/>
         </div>
       </div>
      `);
    $showsList.append($item);
    document.querySelector(`div[data-show-id="${show.id}"]>button.episodeList`).addEventListener("click", () => {
      $("#episodes-area").show();
      let showID = show.id;
      getEpisodes(showID);
    })
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let fetchedEpisodes = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let $episodesList = [];
  console.log(fetchedEpisodes);
  fetchedEpisodes.data.forEach((ep) => {
    $episodesList.push(
      {
        // id: ep.id,
        name: ep.name,
        season: ep.season,
        number: ep.number
      }
    )
  });
  console.log($episodesList);
  let episodeListDOM = document.querySelector("#episodes-list");
  episodeListDOM.innerHTML = "";
  $episodesList.forEach((episode) => {
    let episodeLi = document.createElement("li");
    episodeLi.textContent = `Season ${episode.season}, Episode ${episode.number} - ${episode.name}`;
    episodeListDOM.appendChild(episodeLi);
  })
  return $episodesList;
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}
