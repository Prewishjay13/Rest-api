const express = require('express')
// nieuwe code
const Pagination = require('../pagination')

let routes = function(Post){
    let postRouter = express.Router();

    postRouter.route('/')
    .options(function(req, res) {
        res.header('allow', ['OPTIONS, GET, POST'])
        res.header('Access-Control-Allow-Methods', ['OPTIONS,GET,POST'])
        res.sendStatus(200)
    })
    .post(async function(req, res){
        if(!req.body.name || !req.body.flavor || !req.body.color || !req.body.price) {
            res.sendStatus(400)
        }
        else {
            let post = new Post()
    
            post.name = req.body.name
            post.flavor = req.body.flavor
            post.color = req.body.color
            post.price = req.body.price
    
            post._links.self.href = "http://145.24.222.132:8000/posts" + post._id
            post._links.collection.href = "http://145.24.222.132:8000/posts"
            
            try {
                await post.save();
                res.status(201).send(post);
            } catch (error) {
                res.status(500).send(error);
            }
        }
    })
    .get(async function(req, res) {
        if(req.accepts('json')) {
            try {
                const totalItems = await Post.countDocuments();
                let start = ((req.query.start === undefined || parseInt(req.query.start) === 0) ? 0 : parseInt(req.query.start))
                let limit = ((req.query.limit === undefined || parseInt(req.query.limit) === 0) ? 0 : parseInt(req.query.limit))
        
                let currentPage = parseInt(Pagination.currentPage(totalItems, start, limit)) || 1
                let totalPages = parseInt(Pagination.numberOfPages(totalItems, limit)) || 1
        
                const posts = await Post.find().skip(start).limit(limit);
        
                res.json({
                    items: posts,
                    _links: {
                        self: {
                            href: 'http://145.24.222.132:8000/posts'
                        }
                    },
                    pagination: {
                        currentPage: currentPage,
                        currentItems: posts.length,
                        totalPages: totalPages,
                        totalItems: totalItems,
                        _links: {
                            first: {
                                page: 1,
                                href: 'http://145.24.222.132:8000/posts' + Pagination.getFirstQueryString(1, limit)
                            },
                            last: {
                                page: totalPages,
                                href: 'http://145.24.222.132:8000/posts' + Pagination.getLastQueryString(totalItems, limit)
                            },
                            previous: {
                                page: (currentPage - 1 === 0 ? currentPage : currentPage - 1),
                                href: 'http://145.24.222.132:8000/posts' + Pagination.getPreviousQueryString(totalItems, start, limit)
                            },
                            next: {
                                page: (currentPage + 1 >= totalPages ? currentPage : currentPage + 1),
                                href: 'http://145.24.222.132:8000/posts' + Pagination.getNextQueryString(totalItems, start, limit)
                            }
                        }
                    }
                });
            } catch (error) {
                res.status(500).send(error);
            }
        } else {
            res.sendStatus(400);
        }
    })
    
    postRouter.use('/:postId', function(req, res, next){
        Post.findById(req.params.postId, function(error, post){
            if(error)
              res.status(500).send(error);
            else if (post){
              req.post = post
              next();
            }
            else {
              res.status(404).send('No post found');
            }
          });
    })

    postRouter.route('/:postId')
    .options(function(req, res) {
        res.header('allow', ['OPTIONS, GET, PUT, DELETE'])
        res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,DELETE')
        res.sendStatus(200)
    })
    .get(function(req, res){
        res.json(req.post)
    })
    .put(function(req, res){
        if(!req.body.name || !req.body.flavor || !req.body.color || !req.body.price) {
            res.sendStatus(400)
        }
        else {
            req.post.name = req.body.name;
            req.post.flavor = req.body.flavor;
            req.post.color = req.body.color;
            req.post.price = req.body.price;
            req.post.save(function(error){
                if(error)
                res.status(500).send(error);
                else
                res.json(req.post);
            });
        }
    })
    .patch(function(req, res){
        if(req.body._id){
            delete req.body._id;
        }
        for(let d in req.body){
            req.post[d] = req.body[d];
        }
        req.post.save(function(error){
            if(error)
            res.status(500).send(error);
            else
            res.json(req.post);
        });
    })
    .delete(function(req, res){
        req.post.remove(function(error){
            if (error)
            res.status(500).send(error);
            else
            res.status(204).send('removed');
        });
    });
    return postRouter;
};

module.exports = routes