const renderHome = response => {
    response.write('<html>');
    response.write('<head><title>My first Page</title></head>');
    response.write('<body><h1>Home Page!</h1><h3>Home Page</h3></body>');
    response.write('</html>');
    response.end();
}

module.exports = { renderHome };