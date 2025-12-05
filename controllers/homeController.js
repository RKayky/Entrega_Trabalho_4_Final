exports.index = (req, res) => { if(req.session && req.session.user) { return res.render('index'); } return res.redirect('/login'); };
