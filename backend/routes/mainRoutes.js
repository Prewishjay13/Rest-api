//const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const express = require('express')
const router = express.Router()
///const Pagination = require('../pagination');

    router.get('/', async (req, res) => {

        let page = Math.round(req.query.start || 1);
        const totalItems = await Post.estimatedDocumentCount().exec();
        const itemsPerPage = + parseInt(req.query.limit) || totalItems;
        //const totalPages = Math.ceil(totalItems / itemsPerPage);

        try {
          const posts = await Post.find()
            .limit(itemsPerPage)
            .skip((page - 1) * itemsPerPage);
            //const totalItems = await Post.estimatedDocumentCount().exec();
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        // const posts = await Post.find()
        // .limit(parseInt(req.query.limit))
        // .skip(parseInt(req.query.start))
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
      if (!post) {
        return res.status(404).json({ message: 'Cannot find post' })
      } 
      await res.locals.post.remove();
      res.post = post
      next()
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    // res.post = post
    // next()
  }
  
  router.get('/:id', getPost, (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.json(res.post)
  })

// Creating one
router.post('/', async (req, res) => {
  const post = new Post({title: req.body.title,
      text: req.body.text,
      city: req.body.city,
      address: req.body.address,
    zipcode: req.body.zipcode})

      //post._links.self.href = "http://145.24.222.132:8000/posts/" + post._id.toString();
      post._links.self.href = `http://145.24.222.132:8000/posts/${post._id}`;
     post._links.collection.href = "http://145.24.222.132:8000/posts"

  try {
      const sendPost = await post.save()
      res.status(201).json(sendPost)
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
    if (req.body.city != null) {
      res.post.city = req.body.city
    }
    if (req.body.address != null) {
      res.post.address = req.body.address
    }
    if (req.body.zipcode != null) {
      res.post.zipcode = req.body.zipcode
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
      //await res.post.remove()
      await res.locals.post.remove();
      res.status(204).json({ message: 'Deleted post' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })


  router.options('/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Allow', 'GET,POST,OPTIONS');
    res.header('Access-Control-Request-Headers', 'Content-Type, Accept, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept')
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.set('Accept', 'application/json')
    res.set({'Content-Type': 'applicationo/x-www-form-urlencoded'})
    //res.set('Content-Type', 'application/json')
   // res.writeHead(200, headers);
    res.sendStatus(200)
    res.send();
  });
  
  // Retrieve options for posts detail resource
  router.options('/:id', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Allow', 'GET,PUT,PATCH,DELETE,OPTIONS')     
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Length, X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,OPTIONS')
    res.set({'Content-Type': 'applicationo/x-www-form-urlencoded'})
    res.set({'Accept': 'application/json'})
    //res.writeHead(200, headers);
    res.sendStatus(200)
    res.send();
  })
  
  module.exports = router  