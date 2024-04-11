const express = require('express')


let routes = function(Project){
    const projectRouter = express.Router()


     projectRouter.route('/')
     .post(function(req, res){
        let project =  new Project(req.body)

        project._links.self.href = "http://145.24.222.132:8000/posts" + project._id
        project._links.collection.href = "http://145.24.222.132:8000/posts"
        if(!req.body.title || !req.body.info || !req.body.completed){
        res.sendStatus(400)
        return
        }else{
            console.log("test")
                project.save(function(err){
                    console.log('testtttt')
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    res.status(201).send(project)
                }
        })}
        console.log(req.body)
    })
    .get(function(req, res){
        const perPage =  10
        const page = req.params.start ||1
        const start = parseInt(req.query.start)
        const limit = parseInt(req.query.limit)
        Project.find({})
        .skip((perPage * page)- perPage)
        .limit(limit)
        .exec(function(err, projects){
           Project.count().exec(function(err, count){
                if(err) return next(err)
                let maxPage = Math.ceil(count/limit)
            let paginate = {
                items: projects,
                _links:{ self: {href: "http://145.24.222.132:8000/posts"}},
                pagination: {
                    currentPage: page,
                    currentItems: limit || count ,
                    totalPages: maxPage,
                    totalItems: count,
                    _links: {
                        first: {
                            page: 1,
                            href: "http://145.24.222.132:8000/posts/?start=" + limit
                        },
                        last: {
                            page: maxPage,
                            href: "http://145.24.222.132:8000/posts/?start="+ ((count-limit)+1) + "&limit=" + limit
                        },
                        previous: {
                            page: (page - 1) ,
                            href: "http://145.24.222.132:8000/posts/?start="+(start - limit) + "&limit=" + limit
                        },
                        next: {
                            page: (page + 1),
                            href: "http://www.jgdeveloper.nl/api/?start="+(start + limit) + "&limit=" + limit
                        }
                    }
                }
            }
            res.json(paginate)
        })
        });

    })
        projectRouter.use('/:itemId',function(req,res,next){
            Project.findById(req.params.itemId,function(err,project){
               if(err)
                    res.status(500).send(err)
                else if(project){
                    req.project = project
                    next()
                }else
                    res.status(404).send('no projects found')
            })
        })
    projectRouter.route('/:itemId')
    .get(function(req, res){

        res.json(req.project);  })
    .put(function(req,res){
        Project.findById(req.params.itemId,function(err,project){
           if(!req.body.title || !req.body.info || !req.body.completed){
                res.sendStatus(400)
                return

              } else{
                project.title = req.body.title
                project.info = req.body.info
                project.date = req.body.date
                project.completed = req.body.completed
                project.save(function(err){
                    if(err)
                        res.status(500).send(err)
                    else{
                        res.json(req.project)
                    }

                } );
       }         })
    })
    .patch(function(req,res){
        if(req.body._id)
            delete req.body._id
        for(let p in req.body){
            req.project[p] = req.body[p]
        }
        req.project.save(function(err){
            if(err)
                res.status(500).send(err)
            else{
                res.json(req.project)
            }
        });
    }).delete(function(req,res){
        req.project.remove(function(err){
            if(err){
                res.status(500).send(err)
            }else
                res.status(204).send('deleted')
        })  })
    return projectRouter
}

module.exports = routes