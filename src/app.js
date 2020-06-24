const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function logRequest (request, response, next) {
  const {method, url} = request;
  const label = `[${method.toUpperCase()}] ${url}`

  console.time(label)
  next();
  console.timeEnd(label)

}
function validateId(request, response, next) {
  const {id} = request.params;

  if ( !isUuid(id) ) {
    return response.status(400).json({message:"Invalid project ID!!"})
  }

  return next()
}
app.use(logRequest)
app.use('/repositories/:id', validateId)

/*
* ex de data

{
  id
  content_type
  name
  posts : {
    total
    items: []
  }
  pages?
}


*/ 
const users = [];

// Get all users
app.get("/api/users", (request, response) => {

  const {title} = request.query;
  const result = title
    ? users.filter(projetc => project.title.includes(title))
    : users

  return response.json(result)
});
// Get single users
app.get("/api/users/:id", (request, response) => {

  const { id } = request.params;

  const userIndex = users.findIndex(project => project.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  const result = users[userIndex]

  return response.json(result)
});
// Add new User
app.post("/api/users", (request, response) => {
  const { name, content_type, posts } = request.body

    const _user = {
      id: uuid(),
      name: name,
      content_type: content_type,
      posts: posts,
    }
    users.push(_user)
    response.json(_user)
});
// Add Post to User
app.post("/api/users/:id/post", (request, response) => {
  const { id } = request.params;
  const { title, content, img, refs } = request.body

  const userIndex = users.findIndex(project => project.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  const _post = {
    id: uuid(),
    title: title,
    content: content,
    img: img,
    refs: refs
  }

  _posts = users[userIndex].posts.items_total += 1
  _posts = users[userIndex].posts.items.push(_post)

  response.json(users[userIndex])

});
// Edit User Info
app.put("/api/users/:id", (request, response) => {
  const { id } = request.params;
  const { name, content_type } = request.body;

  const userIndex = users.findIndex(project => project.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  const userUpdated = {
    id,
    name: name == "" ? users[userIndex].name : name,
    content_type: content_type == "" ? users[userIndex].content_type : content_type,
    posts: users[userIndex].posts
  }
  users[userIndex] = userUpdated;

  return response.json(users[userIndex])
});

// Edit User Post
app.put("/api/users/:id/:postId", (request, response) => {
  const { id, postId } = request.params;
  const { title, content, img, refs } = request.body;

  const userIndex = users.findIndex(user => user.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "User not found!!"})
  }

  const postIndex = users[userIndex].posts.items.findIndex( post => post.id === postId )

  if( postIndex < 0 ) {
    return response.status(400)
      .json({error: "Post not found!!"})
  }

  const postUpdated = {
    postId,
    title: title == "" ? users[userIndex].posts.items[postIndex].title : title,
    content: content == "" ? users[userIndex].posts.items[postIndex].content : content,
    img: img == "" ? users[userIndex].posts.items[postIndex].img : img,
    refs: refs == "" ? users[userIndex].posts.items[postIndex].refs : refs
  }
  users[userIndex].posts.items[postIndex] = postUpdated;

  return response.json(users[userIndex])
});

// Delete Users
app.delete("/api/users/:id", (request, response) => {
  const { id } = request.params;

  const userIndex = users.findIndex(project => project.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  users.splice(userIndex, 1)
  return response.status(204).send()
});

module.exports = app;
