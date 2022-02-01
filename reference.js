var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

//* create absoute path 
var contactDir = path.join(__dirname,',/contact');
console.log(contactDir);

//? http server is created
http.createServer( (req, res ) => {
    console.log( req.method, req.url );

    var store = '';
    res.on( 'data' , (chunk) => {
        store += chunk;
    })


    res.on( 'end', ()=>{
        //* converting data into 
        var parsedata = qs.parse(store);
        //* grab the username from store data which come from form
        var username = qs.parse(store).username;

        //! handel request on form path capture data from form and save it in contact directory
        if ( req.method === 'POST' && req.url === '/form' ) {
            // check whether this username exists in users directory or not
            // We have to create a file using username + append .json to create a proper file
            // wx flag ensures that given username.json should not already exist in users directory, otherwise throws an error
            //* it opens the contact dir
            fs.open(contactDir + username + ".json", "wx", (err, fd) => {  
                // fd is pointing to newly created file inside users directory
                // once file is created, we can write content to file
                // since store has all the data of the user  
                //* it will create data in contact dir            
                fs.writeFile(fd, parsedata, (err) => {   
                    // err indicated file was not written
                    // if no error, file was written successfully
                    // close the file   
                    //* it close the dir
                    fs.close(fd, (err) => {
                    //* if no err, send response to client
                    console.log(err)
                    // if no err, send response to client
                    //* it will give respone in form of html when file is created
                    res.setHeader( 'Content-Type', 'text/html' );
                    res.end(`<h1>Contact Saved</h1>
                    <p>${username}successfully created</p>`);
                    });
                });
            });
        }
    } )

    //! handel request on CSS file using url
    if ( req.method === 'GET' && req.url.split(".").pop() === "css" ) {
    //* set header for css file
    res.setHeader("Content-Type", "text/css");
    //* read css file and send it in response
        fs.readFile("./assets/stylesheets/" + req.url, (err, content) => {
            if (err) return console.log(err);
                res.end(content);
        });
    }

    //! handel request on images
    if (  req.url.split('.').pop() === 'png' || req.url.split('.').pop() === 'jpg' ) {
        //* set header for image file
        res.setHeader('Content-Type',`image/jpeg`);
        fs.createReadStream(__dirname + '/media').pipe(res);
    }

    //! handel request on contact path and render the contact page
    if ( req.method === 'GET' && req.url === '/contact' ) {
        res.setHeader( 'Content-Type', 'text/html' );
        fs.createReadStream( './contact.html' ).pipe(res);
    }

    //! handel request on index page and render the index page 
    if ( req.method === 'GET' && req.url === '/' ) {
        res.setHeader( 'Content-Type', 'text/html' );
        fs.createReadStream( './index.html' ).pipe( res );
    }

    //! handel request on about page and render the about page
    if ( req.method === 'GET' && req.url === '/about' ) {
        res.setHeader( 'Content-Type', 'text.html' );
        fs.createReadStream( './about.html' ).pipe( res );
    }
    
    //* it will parsed url in object form
    let parsedUrl = url.parse(req.url,true)

    //! handel request on user with query string and render all user
    if ( req.method === 'GET' && parsedUrl.pathname === '/user' ) {
        //* username extract from query string
        let username = parsedUrl.query.username;
        //* read file by username to send contact
        fs.readFile(contactDir+username+'.json', (err, user) => {
            //* send the user through response
            console.log(user);
            console.log(err);
        });
    }



}).listen( 5000, ()=>{
    //* sever is listening on localhost:5000
    console.log('server lisrening on port 5000');
} )