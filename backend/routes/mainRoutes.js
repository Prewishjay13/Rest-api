const express = require('express')
//const router = express.Router()
// const {getPosts, getPost, postRoutes, putRoutes, deleteRoutes, optionsRoutes} = require('../controllers/postController') 

// router.route('/').get(getPosts).post(postRoutes);

// router.route('/:id').put(putRoutes).delete(deleteRoutes);
// router.route('/:id').options(optionsRoutes)
// router.route('/:id').get(getPost);
// module.exports = router 

// nieuwe code
const Pagination = require('../pagination')

let routes = function(Drink){
    let drinkRouter = express.Router();

    drinkRouter.route('/')
    .options(function(req, res) {
        res.header('allow', ['OPTIONS, GET, POST'])
        res.header('Access-Control-Allow-Methods', ['OPTIONS,GET,POST'])
        res.sendStatus(200)
    })
    .post(function(req, res){
        if(!req.body.name || !req.body.flavor || !req.body.color || !req.body.price) {
            res.sendStatus(400)
        }
        else {
            let drink = new Drink()

            drink.name = req.body.name
            drink.flavor = req.body.flavor
            drink.color = req.body.color
            drink.price = req.body.price

            drink._links.self.href = "http://145.24.222.58:8000/api/drinks/" + drink._id
            drink._links.collection.href = "http://145.24.222.58:8000/api/drinks"
            
            drink.save();
            res.status(201).send(drink);
        }
    })
    .get(async function(req, res) {

        if(req.accepts('json')) {

            // TODO: PAGINATION
            const totalItems = await Drink.countDocuments()
            let start = ((req.query.start === undefined || parseInt(req.query.start) === 0) ? 0 : parseInt(req.query.start))
            let limit = ((req.query.limit === undefined || parseInt(req.query.limit) === 0) ? 0 : parseInt(req.query.limit))

            let currentPage = parseInt(Pagination.currentPage(totalItems, start, limit)) || 1
            let totalPages = parseInt(Pagination.numberOfPages(totalItems, limit)) || 1

            //Drink.find().skip(start).limit

            Drink.find().skip(start).limit(limit).exec(function(error, drinks) {

                if(error) {
                    res.status(500).send(error);
                }
                else {
                    res.json({
                        items: drinks,
                        _links: {
                            self: {
                                href: 'http://145.24.222.58:8000/api/drinks/'
                            }
                        },
                        pagination: {
                            currentPage: currentPage,
                            currentItems: drinks.length,
                            totalPages: totalPages,
                            totalItems: totalItems,
                            _links: {
                                first: {
                                    page: 1,
                                    href: 'http://145.24.222.58:8000/api/drinks/' + Pagination.getFirstQueryString(1, limit)
                                },
                                last: {
                                    page: totalPages,
                                    href: 'http://145.24.222.58:8000/api/drinks/' + Pagination.getLastQueryString(totalItems, limit)
                                },
                                previous: {
                                    page: (currentPage - 1 === 0 ? currentPage : currentPage - 1),
                                    href: 'http://145.24.222.58:8000/api/drinks/' + Pagination.getPreviousQueryString(totalItems, start, limit)
                                },
                                next: {
                                    page: (currentPage + 1 >= totalPages ? currentPage : currentPage + 1),
                                    href: 'http://145.24.222.58:8000/api/drinks/' + Pagination.getNextQueryString(totalItems, start, limit)
                                }
                            }
                        }
                    })
                }
            });
        }
        else {
            res.sendStatus(400)
        }
    });
    
    drinkRouter.use('/:drinkId', function(req, res, next){
        Drink.findById(req.params.drinkId, function(error, drink){
            if(error)
              res.status(500).send(error);
            else if (drink){
              req.drink = drink
              next();
            }
            else {
              res.status(404).send('No drink found');
            }
          });
    })

    drinkRouter.route('/:drinkId')
    .options(function(req, res) {
        res.header('allow', ['OPTIONS, GET, PUT, DELETE'])
        res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,DELETE')
        res.sendStatus(200)
    })
    .get(function(req, res){
        res.json(req.drink)
    })
    .put(function(req, res){
        if(!req.body.name || !req.body.flavor || !req.body.color || !req.body.price) {
            res.sendStatus(400)
        }
        else {
            req.drink.name = req.body.name;
            req.drink.flavor = req.body.flavor;
            req.drink.color = req.body.color;
            req.drink.price = req.body.price;
            req.drink.save(function(error){
                if(error)
                res.status(500).send(error);
                else
                res.json(req.drink);
            });
        }
    })
    .patch(function(req, res){
        if(req.body._id){
            delete req.body._id;
        }
        for(let d in req.body){
            req.drink[d] = req.body[d];
        }
        req.drink.save(function(error){
            if(error)
            res.status(500).send(error);
            else
            res.json(req.drink);
        });
    })
    .delete(function(req, res){
        req.drink.remove(function(error){
            if (error)
            res.status(500).send(error);
            else
            res.status(204).send('removed');
        });
    });
    return drinkRouter;
};

module.exports = routes