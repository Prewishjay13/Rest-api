module.exports = { 
    numberOfPages: function(total, limit){
        return Math.ceil(total / limit) //ceil naar boven afronden
    },
    currentPage: function(total, start, limit) {
        let totalPages =  Math.ceil(total / limit)
        let pages = (total - start) / limit;
        return Math.ceil(totalPages - pages)
    },
    getFirstQueryString: function(start, limit){
        return `?start=${start}&limit=${limit}`
    },
    getLastQueryString: function(total, limit){
        return `?start=${total}&limit=${limit}`
    },
    getPreviousQueryString: function(total, start, limit){
        return `?start=${(total - limit > 0) ? (start - limit) : start}&limit=${limit}`
    },
    getNextQueryString: function(total,start,limit){
        return `?start=${(total + limit > total) ? (start + limit) : start}&limit=${limit}`
    }
}