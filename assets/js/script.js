const autocompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? 'https://via.placeholder.com/300x444' : movie.Poster;
    return `
       <img src="${imgSrc}" />
       ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'de16d4f',
        s: searchTerm
      }
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  }
};

inputAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
});

inputAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }
});


let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'de16d4f',
      i: movie.imdbID
    }
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if(side === 'left'){
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if(leftMovie && rightMovie){
    runComparison(leftMovie, rightMovie);
  }
};

const runComparison =  (leftMovie, rightMovie) => {

  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');
  const winningContainer = document.querySelector('.winning-container');

  let winner = document.querySelector('#winner');

  let leftCount = 0;
  let rightCount = 0;

  leftSideStats.forEach((leftStat, index) => {
      const rightStat = rightSideStats[index];

      const leftSideValue = parseInt(leftStat.dataset.value);
      const rightSideValue = parseInt(rightStat.dataset.value);

      if(leftSideValue > rightSideValue){
        leftStat.classList.remove('normal');
        leftStat.classList.add('winning');
        leftCount++;
      } else {
        rightStat.classList.remove('normal');
        rightStat.classList.add('winning');
        rightCount++;
      }
  });


   if(leftCount > rightCount){
     winner.innerHTML = leftMovie.Title;
     winningContainer.classList.remove('d-none');
   } else {
     winner.innerHTML = rightMovie.Title;
     winningContainer.classList.remove('d-none');
   }
};

const movieTemplate = (movieDetail) => {
  const boxOfficeScore = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')) || 0;
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if(isNaN(value)){
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

console.log('box', boxOfficeScore)
console.log('awards', awards)

  return `
     <article class="media">
             <img class="mr-3" width="144" src="${movieDetail.Poster}" />
        <div class="media-body">
          <div class="content">
             <h1 class="movie-title">${movieDetail.Title}</h1>
             <h4 class="movie-genre">${movieDetail.Genre}</h4>
             <p class="movie-desc">${movieDetail.Plot}</p>
          </div>
        </div>
     </article>
     <article data-value=${awards} class="small notification normal">
       <p class="credits-title">${movieDetail.Awards}</p>
       <p class="credits-subtitle">Awards</p>
     </article>
     <article data-value=${boxOfficeScore} class="small notification normal">
     <p class="credits-title">${movieDetail.BoxOffice}</p>
     <p class="credits-subtitle">Box Office</p>
   </article>
   <article data-value=${metascore} class="small notification normal">
   <p class="credits-title">${movieDetail.Metascore}</p>
   <p class="credits-subtitle">Meta Score</p>
 </article>
 <article data-value=${imdbRating} class="small notification normal">
 <p class="credits-title">${movieDetail.imdbRating}</p>
 <p class="credits-subtitle">IMDB Rating</p>
</article>

<article data-value=${imdbVotes} class="small notification normal">
<p class="credits-title">${movieDetail.imdbVotes}</p>
<p class="credits-subtitle">IMDB Votes</p>
</article>

  `;
};