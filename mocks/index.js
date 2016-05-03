const fs = require('fs');
const path = require('path');

module.exports = {
    '/genres': function(req, res) {
        fs.readFile(
            path.join(__dirname, './genres.json'),
            { encoding: 'utf8' },
            (err, content) => {
                if (err) {
                    throw err;
                }
                res.end(content);
            }
        );
    },
    '/movies/add': function(req, res) {
        res.end(JSON.stringify({
            success: false,
            errors: {
                title: 'Bad movie, please choose another',
                views: 'Please enter something here'
            },
            errorMsg: 'Please correct fields'
        }));
    },
    '/movies': function(req, res) {
        fs.readFile(
            path.join(__dirname, './movie.json'),
            { encoding: 'utf8' },
            (err, content) => {
                if (err) {
                    throw err;
                }
                res.end(content);
            }
        )

    }
};
