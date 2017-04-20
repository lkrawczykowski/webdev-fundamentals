var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config.json');
var url = require('url');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8082;

var router = express.Router();

function find_suggestions(products, query) {
    return products.filter(product => product.toLowerCase().indexOf(query.toLowerCase()) !== -1)
}

//http://localhost:8082/api/search?query=micro
router.get('/*', function (req, res) {
    var query = url.parse(req.url, true).query.query;
    var suggestions = find_suggestions(config.products, query);
    res.json({ suggestions: suggestions });
});

app.use('/api/search', router);
app.listen(port);
console.log('server running on port ' + port);