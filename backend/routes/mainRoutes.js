//const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const express = require('express')
const router = express.Router()
///const Pagination = require('../pagination');

    router.get('/', async (req, res) => {

        let page = Math.round(req.query.start || 1);
        const totalItems = await Post.estimatedDocumentCount().exec();
        const itemsPerPage = + parseInt(req.query.limit) || totalItems;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        try {
            const totalItems = await Post.estimatedDocumentCount().exec();
      
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        const posts = await Post.find()
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.start))
        res.json({
            "items": posts, 
            "_links": {
                "self": {
                    "href": 'http://145.24.222.132:8000/posts/'
                }
            },
            pagination: {
                currentPage: page,
                currentItems: posts.length,
                totalPages: totalPages,
                totalItems: totalItems,
                _links: {
                    first: {
                        //page: 1,
                        page:"http://145.24.222.132:8000/posts",
                        href: `http://145.24.222.132:8000/posts/?start=1&limit=${itemsPerPage}`
                        //href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getFirstQueryString(1, limit)
                    },
                    last: {
                        //page: totalPages,
                        page:"http://145.24.222.132:8000/posts",
                        href: `http://145.24.222.132:8000/posts/?start=${totalPages}&limit=${itemsPerPage}`
                        //href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getLastQueryString(totalItems, limit)
                    },
                    previous: {
                        //page: (currentPage - 1 === 0 ? currentPage : currentPage - 1),
                        page:"http://145.24.222.132:8000/posts",
                        href: `http://145.24.222.132:8000/posts/?start=${page == 1 ? 1 : page - 1}&limit=${itemsPerPage}`
                        //href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getPreviousQueryString(totalItems, start, limit)
                    },
                    next: {
                        //page: (currentPage + 1 >= totalPages ? currentPage : currentPage + 1),
                        page:"http://145.24.222.132:8000/posts",
                        href: `http://145.24.222.132:8000/posts/?start=${page == 1 ? 1 : page + 1}&limit=${itemsPerPage}`
                        //href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getNextQueryString(totalItems, start, limit)
                    }
                }
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// // GET single post
// const getPost = asyncHandler(async (req, res) => {
//     const post = await Post.findById(req.params.id);
//     res.status(200).json(post);
// });

async function getPost(req, res, next) {
    let post
    try {
      post = await Post.findById(req.params.id)
      if (post == null) {
        return res.status(404).json({ message: 'Cannot find post' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.post = post
    next()
  }
  
  router.get('/:id', getPost, (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.json(res.post)
  })

// Creating one
router.post('/', async (req, res) => {
    const post = new Post({
      title: req.body.name,
      text: req.body.clothingType,
      address: req.body.creator
    })
    try {
      const newPost = await post.save()
      res.status(201).json(newPost)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })


  router.put('/:id', getPost, async (req, res) => {
    if (req.body.title != null) {
      res.post.title = req.body.title
    }
    if (req.body.text != null) {
      res.post.text = req.body.text
    }
    if (req.body.address != null) {
      res.post.address = req.body.address
    }
    try {
      const updatedPost = await res.post.save()
      res.json(updatedPost)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  
  // Deleting One
  router.delete('/:id', getPost, async (req, res) => {
    try {
      await res.post.remove()
      res.status(204).json({ message: 'Deleted post' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })


  router.options('/', async (req, res) => {
    let headers = [];
  
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Content-Type'] = 'Content-Type', 'application/json';
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    headers['Allow'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Content-Length'] = '0';
    headers["Access-Control-Max-Age"] = '86400';
  
    res.writeHead(200, headers);
    res.send();
  });
  
  // Retrieve options for posts detail resource
  router.options('/:id', function (req, res) {
    let headers = [];
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Content-Type'] = 'Content-Type', 'text/html; charset=UTF-8';
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    headers['Allow'] = 'GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Methods'] = 'GET, PUT, DELETE, OPTIONS';
    headers['Content-Length'] = '0';
    headers["Access-Control-Max-Age"] = '86400';
  
    res.writeHead(200, headers);
    res.send();
  })
  
  module.exports = router  