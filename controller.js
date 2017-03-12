module.exports = {
    getHomepage : (req, res) => {
        res.send(['/idea/generate', '/idea/generateOne']);
    },
    getMovies : function(req, res){
       //do something
    },
    postMovie : function(req, res){
       //do something
    }
}