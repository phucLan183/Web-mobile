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

const isLoginLocal = (req, res, next) => {
    if (req.session.userId) return res.redirect('/')
    next()
}

const noneLoginLocal = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login')
    next()
}

module.exports = {
    checkLogin: checkLogin,
    checkAdmin: checkAdmin,
    isLoginLocal: isLoginLocal,
    noneLoginLocal: noneLoginLocal
}