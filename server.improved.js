const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

//can use or replace with our own dataset
const appdata = [
]

//create server
const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if (request.method === 'DELETE') {
    handleDelete(request, response)
  }
})

//if its get, getting somehting. post = getting data coming in from a request
const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handleDelete = function(request, response) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  //data recieved, end event
  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    // ... do something with the data here!!!
    //data string gives a parsible string with the response
    let entryToDelete = JSON.parse( dataString )
    let song
    for(let i =0;i < appdata.length; i++) {
      if(appdata[i].yourname === entryToDelete.delete) {
        song = appdata[i].yoursong
        appdata.splice(i,1)
      }
    }

    //DECREMENT calculate how many other poeple answered that song 
    for(let j =0;j < appdata.length; j++) {
      if(appdata[j].yoursong === song) {
        if(appdata[j].count > 1) {
          appdata[j].count = appdata[j].count - 1
        } 
      }
    }
    


    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })   //send back simple value
    response.end(JSON.stringify( appdata )) //send back to the client.. this is sending back just a test string
  })
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  //data recieved, end event
  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )

    let newEntry = JSON.parse( dataString )

    //calculate how many other poeple answered that song
    let songCount = 1
    for(let i =0;i < appdata.length; i++) {
      if(appdata[i].yoursong === newEntry.yoursong) {
        songCount +=1
      }
    }
    
    // console.log( "songCount" )
    appdata.push( newEntry )

    newEntry.count = songCount

    console.log(newEntry)
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })   //send back simple value
    response.end(JSON.stringify( appdata )) //send back to the client.. this is sending back just a test string
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
