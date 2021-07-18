const checkLogin = (req, res, next) => {
    if(req.session.admin){
       return res.redirect('/admin/dashboard')
    }
    next();
}

const checkAdmin = (req, res, next) => {
    if(!req.session.admin) {
       return res.redirect('/admin/login')
    }
    next();
}

const checkUserLogin = (req, res, next) => {
    if (req.session.userId) return res.redirect('/')
    next()
}

const userNoneLogin = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login')
    next()
}

module.exports = {
    checkLogin: checkLogin,
    checkAdmin: checkAdmin,
    checkUserLogin: checkUserLogin,
    userNoneLogin: userNoneLogin
}