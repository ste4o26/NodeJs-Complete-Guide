const renderAddMessage = response => {
    response.write('<html>');
    response.write('<head><title>My First Form</title></head>');
    response.write('<body>');
    response.write('<h1>Hello From My First Node Server!</h1>');
    response.write('<h3>Add Message Page</h3>');
    response.write('<form action="/persist-message" method="POST">');
    response.write('<label for="message">Enter your message:</label>')
    response.write('<input id="message" name="message" type="text"><button type="submit">Send</button>');
    response.write('</form>');
    response.write('</body>')
    response.write('</html>');
    response.end();
}

module.exports = { renderAddMessage };