const express = require("express");

const server = express();

server.use(express.json()); //libera o uso de json


let nRequests = 0;
const projects = [];


function logRequests(req, res, next) {
    nRequests++;
  
    console.log(`Número de requisições: ${nRequests}`);
  
    return next();
}


function verificaProjectId(req, res, next){

    const { id } = req.params;
    
    const project = projects.find(p => p.id == id);

    if (!project) {
        return res.status(400).json({
            error: 'Project not found'
        });
    }

    return next();
}

function verificaProjectExists(req, res, next){

    const { id } = req.body;
    const project = projects.find(p => p.id == id);

    if (!project) {
        return next();       
    }else{
        return res.status(400).json({
            error: 'ID Project exists'
        });
    }
}

server.post('/projects', verificaProjectExists, logRequests, (req, res) => {
    const { id } = req.body;
    const { title } = req.body;
    const { tasks } = req.body;

    projects.push({
        id: id,
        title: title,
        tasks: tasks 
    });

    return res.json(projects);
});

server.post('/projects/:id/tasks', verificaProjectId, logRequests, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const { tasks } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(tasks);
    project.title = title;

    return res.json(projects);
});

server.get('/projects', logRequests, (req, res) => {
    return res.json(projects);
});

server.get('/projects/:id', verificaProjectId, logRequests, (req, res) => {
    const { id } = req.params;
  
    const project = projects.find(p => p.id == id);

    return res.json(project);
});

server.put('/projects/:id', verificaProjectId, logRequests, (req, res) => {

    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title; //pega o projeto pelo id dentro do array projects

    return res.json(projects);
});

server.delete('/projects/:id', verificaProjectId, logRequests, (req, res) => {

    const { id } = req.params;

    const project = projects.find(p => p.id == id);
    
    const index = projects.indexOf(project); //verica se tem o id dentro do array de projects

    projects.splice(index,1); //remove project do array

    return res.send();
});

server.listen(3001);