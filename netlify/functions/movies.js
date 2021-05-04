// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  // console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  // console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error! Please provide years and genre!` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
      // store the movie
      let movie = moviesFromCsv[i]
      
      // decide whether the movie matches the required year and genre
      if (movie.startYear == year && movie.genres.includes(genre) 
      // ignores those with no genre or runtime
      && movie.genres != `\\N` && movie.runtimeMinutes != `\\N`){
        
        // add 1 to the count 
        returnValue.numResults = returnValue.numResults + 1

        //add the movie to the return value
        let details = {
          primary_title: movie.primaryTitle,
          released_year: movie.startYear,
          genres: movie.genres
        } 
        returnValue.movies.push(details)
      }
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}