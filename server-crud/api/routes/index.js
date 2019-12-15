const express = require('express');
const router = express.Router();

// ---split up route handling--- //
router.use('/bolli', require('./bolli'));
router.use('/customers', require('./customers'));
router.use('/users', require('./users'));
router.use('/jplist', require('./jplist'));
// router.use('/galleriaDir', require('./galleriaDir'));

router.get("/err", function(req, res, next){
  next(new Error("Some Error"));
});

// ---API Specific 404 / Error Handlers--- //

// API not found
router.use(function(req, res, next){
  res.status(404);
  res.send();
});

// errors handler
router.use(function(err, req, res, next){
  const status = err.status || 500;
  res.status(status);
  res.json({
    app: "api",
    status: status,
    error: err.message
  });
});

module.exports = router;
