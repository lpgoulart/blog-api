const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  const {title} = request.query;
  const result = title
    ? repositories.filter(projetc => project.title.includes(title))
    : repositories

  return response.json(result)
});

app.post("/repositories", (request, response) => {
  const { title, git } = request.body

    const repo = {
      id: uuid(),
      title: title,
      github: git
    }
    repositories.push(repo)
    response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, git } = request.body

  const repoIndex = repositories.findIndex(project => project.id === id)

  if( repoIndex < 0 ) {
    return response.status(400)
      .json({error: "Project not found!!"})
  }

  const project = {
    id,
    title,
    git
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
  // TODO
});

module.exports = app;
