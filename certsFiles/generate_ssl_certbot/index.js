const express = require('express');

const app = express();

app.use(express.static(__dirname, { dotfiles: 'allow' } ));

app.get('/end_server', function(req, res) {
    process.exit(0);
});

app.listen(80);

setTimeout(() => {
   process.exit(1);
}, 30000);

