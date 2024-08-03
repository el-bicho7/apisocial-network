const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend, 
  removeFriend,
} = require('../../controllers/userController');

// /api/users
// This routes Get all Users and can create a new user
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
// This route get a single user and can delete and update the user selected
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends
// This routes lets add friend on selected user
router.route('/:userId/friends').post(addFriend);

// /api/users/:userId/friends/:friendId
// This routes deletes friendId
router.route('/:userId/friends/:friendId').delete(removeFriend);

module.exports = router;