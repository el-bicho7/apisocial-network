const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const allThoughts = await Thought.find();

      const thoughtObj = {
        allThoughts
      };

      res.json(thoughtObj);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Create a Thought
  async createThought(req, res) {
    try {
      const create = await Thought.create(req.body);
      res.json(create);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Get single Thought
  async getSingleThought(req, res) {
    try {
      const single = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

      if (!single) {
        return res.status(404).json({ message: 'No Thought with that ID' });
      }

      res.json(single);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Update Thought
  async updateThought(req,res) {
    try {
      const update = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      )

      if (!update) {
        return res.status(404).json({ message: "No thought with that Id!" });
      }

      res.json({ message: "Thought updated!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete Thought
  async deleteThought(req,res) {
    try {
      const thoughts = await Thought.findByIdAndDelete({ _id: req.params.thoughtId });

      if (!thoughts) {
        return res.status(404).json({ message: "No Thought with that Id" });
      }

      res.json({ message: "Thought deleted!"});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Create a reaction
  async createReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const reaction = req.body;

      const updateThought = await Thought.findByIdAndUpdate(
        { _id: thoughtId },
        { $push: { reactions: reaction }},
        { runValidators: true, new: true }
      )

      if (!updateThought) {
        return res.status(404).json({ message: "No Thought with that Id"});
      }

      res.json({ message: "Reaction Added!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete Reaction
  async deleteReaction(req, res) {
    try {
      const reactionId  = req.params.reactionId;

      const updateThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $pull: { reactions: { reactionID: reactionId }  }},
        { runValidators: true, new: true }
      )

      if (!updateThought) {
        return res.status(404).json({ message: "No Thought or Reaction with that Id" });
      }

      res.json({ message: "Reaction Deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
