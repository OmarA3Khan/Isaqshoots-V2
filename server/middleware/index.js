module.exports.isLoggedIn = (req, res, next) => {
    console.log("in middleware");
    if (!req.isAuthenticated()) {
        return res.status(403).send('You must be signed in first!');
    }
    console.log("req.isAuthenticated", req.isAuthenticated());
    next();
}