const ProblemModel = require('../models/problemModel');

const getProblems = function() {
    return new Promise((resolve, reject) => {
        ProblemModel.find({}, function(err, problems) {
            if (err) {
                reject(err);
            } else {
                resolve(problems);
            }
        });
    });
}

const getProblem = function(id) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({id: id}, function(err, problem) {
            if (err) {
                reject(err);
            } else {
                resolve(problem);
            }
        });
    });
}

const addProblem = function(newProblem) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({name: newProblem.name}, function(err, data) {
            if (data) {
                // if the problem name already exists, don't add a new problem
                reject('Problem name already exists');
            } else {
                // add a new problem, get the total num of current problems first to assign problem id
                ProblemModel.count({}, function(err, num) {
                     newProblem.id = num + 1;
                     let mongoProblem = new ProblemModel(newProblem);
                     mongoProblem.save();
                     resolve(mongoProblem);
                });
            }
        });
    })
}


module.exports = {
    getProblems,
    getProblem,
    addProblem
}
