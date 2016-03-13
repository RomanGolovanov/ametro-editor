var passport = require('passport'),
    Account = require('../models/account'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200).send({ timestamp: new Date(), user:  req.user ? req.user.username : null });
});

router.post('/user/register', function(req, res) {
    var account = new Account({ username : req.body.username });
    Account.register(account, req.body.password, function(err, account) {
        if (err) {
            return res.status(500).send({ error: err });
        }
        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return res.status(500).send({ error: err });
                }
                return res.status(200).send({ user: account.username });
            });
        });
    });
});

router.post('/user/login', passport.authenticate('local'), function(req, res) {
    res.send({ user : req.user.username });
});

router.post('/user/logout', function(req, res) {
    req.logout();
    res.status(204).send({});
});

Account.find({}, function(err, data){
    console.log(data);
});


module.exports = router;