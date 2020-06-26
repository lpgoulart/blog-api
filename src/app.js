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
    return response.status(400).json({message:"Invalid ID!!"})
  }

  return next()
}

app.use(logRequest)
app.use('/api/users/:id', validateId)

const users = [];

// Get all users
// OK
app.get("/api/users", (request, response) => {

  const {title} = request.query;
  const result = title
    ? users.filter(user => user.title.includes(title))
    : users

  return response.status(200).json(result)
});


// Get single users
// OK
app.get("/api/users/:id", (request, response) => {

  const { id } = request.params;

  const userIndex = users.findIndex(user => user.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "User not found!!"})
  }

  const result = users[userIndex]

  return response.json(result)
});
// Get Single User Post
// OK
app.get("/api/users/:id/:postId", (request, response) => {
  const { id, postId } = request.params;

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

  post = users[userIndex].posts.items[postIndex]

  return response.json(post);
});


// Add new User
// OK
app.post("/api/users", (request, response) => {
  const { name, blog_name, username, posts, plan_total } = request.body

  let plan

  switch(plan_total) {
    case 'free':
      plan = 10
      break;
    case 'simple':
      plan = 70
      break;
    case 'pro':
      plan = 200
      break;
    case 'enterprise':
      plan = 9999
      break;
    default:
      plan = 10
      break
  }

    const _user = {
      id: uuid(),
      name,
      username,
      plan_total: plan, 
      blog_name,
      posts,
    }
    users.push(_user)
    response.json(_user)
});
// Add Post to User
// OK
app.post("/api/users/:id/post", (request, response) => {
  const { id } = request.params;
  const { title, content, img, brief, type } = request.body

  const userIndex = users.findIndex(user => user.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "User not found!!"})
  }

  const _post = {
    id: uuid(),
    createdAt: Date.now(),
    title,
    content,
    brief,
    img,
    type
  }

  if ( users[userIndex].plan_total == users[userIndex].posts.items_total ) {
    response.json({
      message: "Vc atingiu o numero total de posts"
    })
  }
  else {
    _posts = users[userIndex].posts.items_total += 1
    _posts = users[userIndex].posts.items.push(_post)

    response.json(_post)
  }

});


// Edit User Info
// OK
app.put("/api/users/:id", (request, response) => {
  const { id } = request.params;
  const { name, blog_name, username } = request.body;

  const userIndex = users.findIndex(user => user.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "User not found!!"})
  }

  const userUpdated = {
    id,
    username: username == "" ? users[userIndex].username : username,
    name: name == "" ? users[userIndex].name : name,
    blog_name: blog_name == "" ? users[userIndex].blog_name : blog_name,
    posts: users[userIndex].posts
  }
  users[userIndex] = userUpdated;

  return response.json(users[userIndex])
});
// Edit User Post
// OK
app.put("/api/users/:id/:postId", (request, response) => {
  const { id, postId } = request.params;
  const { title, content, img, brief, type, createdAt } = request.body;

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
    id: postId,
    createdAt,
    title: title == "" ? users[userIndex].posts.items[postIndex].title : title,
    brief: brief == "" ? users[userIndex].posts.items[postIndex].brief : brief,
    content: content == "" ? users[userIndex].posts.items[postIndex].content : content,
    img: img == "" ? users[userIndex].posts.items[postIndex].img : img,
    type: type == "" ? users[userIndex].posts.items[postIndex].type : type
  }
  users[userIndex].posts.items[postIndex] = postUpdated;

  return response.json(users[userIndex])
});


// Delete Users
// OK
app.delete("/api/users/:id", (request, response) => {
  const { id } = request.params;

  const userIndex = users.findIndex(user => user.id === id)

  if( userIndex < 0 ) {
    return response.status(400)
      .json({error: "User not found!!"})
  }

  users.splice(userIndex, 1)
  return response.status(204).send()
});
// Delete User Post
// OK
app.delete("/api/users/:id/:postId", (request, response) => {
  const { id, postId } = request.params;

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

  users[userIndex].posts.items_total -= 1;
  users[userIndex].posts.items.splice(postIndex, 1);
  return response.status(204).send();
});

module.exports = app;
