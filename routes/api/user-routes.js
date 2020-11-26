const router = require('express').Router();
// Instead of importing the entire object and having to do userController.getAllUser(), we can simply destructure the method names out of the imported object and use those names directly:
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  } = require('../../controllers/user-controller');

// /api/users
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);
  // See how we simply provide the name of the controller method as the callback? That's why we set up those methods to accept req and res as parameters!

// /api/users/:id
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;