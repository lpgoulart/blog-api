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

const repositories = [];

app.get("/repositories", (request, response) => {

  const {title} = request.query;
  const result = title
    ? repositories.filter(projetc => project.title.includes(title))
    : repositories

  return response.json(result)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

    const repo = {
      id: uuid(),
      title: title,
      url: url,
      techs: techs,
      likes: 0
    }
    repositories.push(repo)
    response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body

  const repoIndex = repositories.findIndex(project => project.id === id)

  if( repoIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  const project = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }
  repositories[repoIndex] = project;

  return response.json(repositories[repoIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(project => project.id === id)

  if( repoIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  repositories.splice(repoIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(project => project.id === id)

  if( repoIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  repositories[repoIndex].likes += 1;

  return response.json(repositories[repoIndex])
});

module.exports = app;
