const validate = {};

validate.isLoggedIn = function(req){
    if(req.user){
        return true;
    }
    return false;
};

module.exports = validate;