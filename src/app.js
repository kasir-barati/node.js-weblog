const path = require('path');

const csurf = require('csurf');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sequelize = require('./models/index');
const { port, host, coockieSecret } = require("./config");

const ErrorController = require('./middlewares/controllers/error');
const adminContactUsRoutes = require('./routes/admin-contact-us');
const adminCategoryRoutes = require('./routes/admin-category');
const adminCommentRoutes = require('./routes/admin-comment');
const adminPostRoutes = require('./routes/admin-post');
const adminUserRoutes = require('./routes/admin-user');
const adminTagRoutes = require('./routes/admin-tag');
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/post');
const UserRoleModel = require('./models/user-role');

const app = express();
const sessionStore = new SequelizeStore({
    db: sequelize.sequelize,
    tableName: 'userSessions',
    expiration: 12 * 3600000,
    checkExpirationInterval: 3600000
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: coockieSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(connectFlash());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(csurf({ cookie: true }));
app.use(async (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();

    if (req.user) {
        res.locals.userId = req.user.id;
        res.locals.isAdmin = (await UserRoleModel.findByPk(req.user.userRoleId)).accessLevel === 4 ? true : false;
        res.locals.isLoggedIn = true;
        res.locals.userAvatar = req.user.avatar;
    } else {
        res.locals.userId = null;
        res.locals.isAdmin = false;
        res.locals.isLoggedIn = false;
    };
    next();
});

app.use('/', indexRoutes);
app.use('/posts', postRoutes);
app.use('/comments', adminCommentRoutes);

app.use('/admin/tags', adminTagRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/admin/posts', adminPostRoutes);
app.use('/admin/categories', adminCategoryRoutes);
app.use('/admin/contact-us', adminContactUsRoutes);

app.use(ErrorController.notFoundPage);
app.use(ErrorController.internalErrorPage);

sequelize.sync().then(() => {
    app.listen(port, host, () => console.log(`server is started at ${new Date()} on http://${host}:${port}`));
    // require('./jobs');
}).catch(error => { throw error });

module.exports = app;