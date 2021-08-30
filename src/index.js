const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require('colors');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    switch (type) {
        case "PostCreated": {
            const {id, title} = data;
            posts[id] = {id, title, comments: []};
            break;
        }
        case "CommentCreated": {
            const {id, content, postId, status} = data;
            const post = posts[postId];
            post.comments.push({id, content, status})
            break;
        }
        case "CommentUpdated": {
            const {postId, id, status, content} = data;
            const post = posts[postId];
            const comment = post.comments.find(comment => {
                return comment.id === id
            })
            comment.status = status;
            comment.content = content;
            break;
        }
    }
}

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    console.log(`Received event: type: ${type} data: ${JSON.stringify(data)}`.bgYellow.black);
    handleEvent(type, data);
    res.send({});
})

app.get('/posts', async (req, res) => {
    res.send(posts);
})

app.listen(4002, async () => {
    console.info("\n" +
        " ██████  ██    ██ ███████ ██████  ██    ██       ███████ ███████ ██████  ██    ██ ██  ██████ ███████ \n" +
        "██    ██ ██    ██ ██      ██   ██  ██  ██        ██      ██      ██   ██ ██    ██ ██ ██      ██      \n" +
        "██    ██ ██    ██ █████   ██████    ████   █████ ███████ █████   ██████  ██    ██ ██ ██      █████   \n" +
        "██ ▄▄ ██ ██    ██ ██      ██   ██    ██               ██ ██      ██   ██  ██  ██  ██ ██      ██      \n" +
        " ██████   ██████  ███████ ██   ██    ██          ███████ ███████ ██   ██   ████   ██  ██████ ███████ \n" +
        "    ▀▀                                                                                               \n" +
        "                                                                                                     \n");
    console.info('Listening on 4002'.bgGreen.black);
    const res = await axios.get('http://localhost:4005/events');
    res.data.forEach(event => {
        console.info(`Processing event: ${event.type}`.bgGreen.black);
        handleEvent(event.type, event.data);
    })
})
