var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");

var index = require('./routes/index');
var users = require('./routes/users');
var contact = require('./routes/contact');
var events = require('./routes/events');
var team = require('./routes/team');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/contact', contact);
app.use('/events', events);
app.use('/team', team);

//NodeMailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  auth: {
    user: 'ceonotifications@gmail.com', //email is not real; use your own email to test
    pass: 'abc12345@'  //use your own password for email to test
  }
});

app.get('/', function(req,res){
  res.sendfile("./views/partials/footer.ejs");
})

app.post('/postCEO', function(req,res){
  var mailOptions = {
  from: '<ceonotifications@gmail.com>', // sender address- email is not real; use your own email to test
  to: 'info@baruchceo.com', // list of receivers
  subject: 'You have received feedback from Baruch CEO Website!', // Subject line
  text: "User: " + req.body.name + " <" + req.body.email + ">" + "\n\n" + "Comment:" + req.body.message}

  console.log(mailOptions);
  transporter.sendMail(mailOptions,function(error,response){
    if(error){
      res.end("Message could not be sent.");
    }
    else{
      res.end("Message Sent. Thanks!");
    }
  })
  res.redirect("/contact");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
