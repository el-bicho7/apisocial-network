const { ObjectId } = require('mongoose').Types;
const { User } = require('../models');

module.exports = {
  // Get All Users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get Single User
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No User with that ID' });
      }

      const userObj = {
        user
      };

      res.json(userObj);

    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Create a User
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Update User
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      )

      if (!user) {
        res.status(404).json({ message: 'No User with that Id' });
      }

      res.status(200).json({ message: "User updated!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete User
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No such user exists." })
      };

      res.status(200).json({ message: "User deleted successfully." })
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Add friend
  async addFriend(req, res) {
    try {
      const { friendId } = req.body;

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID.' });
      }

      res.status(200).json({ message: "Friend added successfully." })
      
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Remove friend
  async removeFriend(req, res) {
    try {
      const friendId = req.params.friendId;
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: {friends: friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json('No user found with that ID.')
      }
      
      res.status(200).json({ message: "Friend deleted successfully." })
    } catch (err) {
      res.status(500).json(err);
    }
  }
};