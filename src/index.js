const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('colors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    console.log(`Received event: type: ${type} data: ${JSON.stringify(data)}`.bgYellow.black);
    switch (type) {
        case "PostCreated":
        {
            const {id, title} = data;
            posts[id] = {id, title, comments: []};
            break;
        }
        case "CommentCreated":
        {
            const {id, comment, postId} = data;
            const post = posts[postId];
            post.comments.push({id,  comment})
            break;
        }
    }

    res.send({});
})

app.get('/posts', async (req, res) => {
    res.send(posts);
})

app.listen(4002, () => {
    console.info("\n" +
        " ██████  ██    ██ ███████ ██████  ██    ██       ███████ ███████ ██████  ██    ██ ██  ██████ ███████ \n" +
        "██    ██ ██    ██ ██      ██   ██  ██  ██        ██      ██      ██   ██ ██    ██ ██ ██      ██      \n" +
        "██    ██ ██    ██ █████   ██████    ████   █████ ███████ █████   ██████  ██    ██ ██ ██      █████   \n" +
        "██ ▄▄ ██ ██    ██ ██      ██   ██    ██               ██ ██      ██   ██  ██  ██  ██ ██      ██      \n" +
        " ██████   ██████  ███████ ██   ██    ██          ███████ ███████ ██   ██   ████   ██  ██████ ███████ \n" +
        "    ▀▀                                                                                               \n" +
        "                                                                                                     \n");
    console.info('Listening on 4002'.bgGreen.black);
})
