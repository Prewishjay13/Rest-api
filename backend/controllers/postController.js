const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const Pagination = require('../pagination');

const getPosts = asyncHandler(async (req, res) => {
    //res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    try {
        const start = (req.query.start === undefined || parseInt(req.query.start) === 0) ? 0 : parseInt(req.query.start);
        const limit = (req.query.limit === undefined || parseInt(req.query.limit) === 0) ? 0 : parseInt(req.query.limit);

        const totalItems = await Post.countDocuments();
        const currentPage = parseInt(Pagination.currentPage(totalItems, start, limit)) || 1;
        const totalPages = parseInt(Pagination.numberOfPages(totalItems, limit)) || 1;

        const posts = await Post.find();
        let items = [];
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i].toJSON();
            post._links = {
                self: { href: "http://" + req.headers.host + "/posts/" + post._id },
                collection: { href: "http://" + req.headers.host + "/posts" }
            };
            items.push(post);
        }
        let collection = {
            items: items,
            _links: {
                self: {
                    href: "http://" + req.headers.host + "/posts"
                }
            },
            pagination: {
                currentPage: currentPage,
                currentItems: items.length,
                totalPages: totalPages,
                totalItems: totalItems,
                _links: {
                    first: {
                        page: 1,
                        href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getFirstQueryString(1, limit)
                    },
                    last: {
                        page: totalPages,
                        href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getLastQueryString(totalItems, limit)
                    },
                    previous: {
                        page: (currentPage - 1 === 0 ? currentPage : currentPage - 1),
                        href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getPreviousQueryString(totalItems, start, limit)
                    },
                    next: {
                        page: (currentPage + 1 >= totalPages ? currentPage : currentPage + 1),
                        href: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + Pagination.getNextQueryString(totalItems, start, limit)
                    }
                }
            }
        };
        res.status(200).json(collection);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single post
const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
});

// POST routes
const postRoutes = asyncHandler(async (req, res) => {
    console.log(req.body);

    // to get body data add the following line:
    // console.log(req.body);
    // error code handle
    if (!req.body.title || !req.body.text || !req.body.adress || !req.body.zipcode || !req.body.cost) {
        // res.status(400).json({message:'add text!'}) //rewriting this to use express error handling
        res.status(400);
        throw new Error('Please fill in all fields');
    }
    const post = await Post.create({
        title: req.body.title,
        text: req.body.text,
        adress: req.body.adress,
        zipcode: req.body.zipcode,
        cost: req.body.cost
    });
    // res.status(200).json({message: 'this is the post controller talking'})

    res.status(200).json(post);
});

// PUT routes
const putRoutes = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    // res.status(200).json({message: `update route for post number ${req.params.id}`})
    res.status(200).json(updatedPost);
});

// OPTIONS
const optionsRoutes = function (req, res) {
    let headers = {};
    headers['Allow'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Content-Length'] = 0;
    headers['Content-Type'] = 'text/html';
    headers["Access-Control-Max-Age"] = '86400';
    res.writeHead(200, headers);
    res.send();
};

// DELETE routes
const deleteRoutes = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(400);
        throw new Error('Post not found for deleting');
    }
    // .deleteOne instead of remove
    await post.deleteOne();
    // res.status(200).json({message: `delete route for post number ${req.params.id}`})
    res.status(200).json({id: req.params.id})
});

// This next line exports the functions so that it can be required(imported) in other files for use
module.exports = {
    getPosts,
    getPost,
    postRoutes,
    putRoutes,
    deleteRoutes,
    optionsRoutes
};
