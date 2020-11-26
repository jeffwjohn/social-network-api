const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
      Thought.find({})
      // (When adding thoughts): Even though the thought stored the thought, all we can see is the thought _id. Sound familiar? We also ran into this issue with SQL. There, we joined two tables to resolve the problem, but in MongoDB we'll populate a field. To populate a field, just chain the .populate() method onto your query, passing in an object with the key path plus the value of the field you want populated.
    //   .populate({
    //     path: 'thoughts',
    //     select: '-__v'
    //     // Note that we also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on thoughts either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field.
    //   })
      // Since we're doing that for our populated thoughts, let's update the query to not include the thought's __v field either, as it just adds more noise to our returning data.
        .select('-__v')
        // Lastly, we should set up the query so that the newest thought returns first. Mongoose has a .sort() method to help with this. After the .select() method, use .sort({ _id: -1 }) to sort in DESC order by the _id value. This gets the newest thought because a timestamp value is hidden somewhere inside the MongoDB ObjectId.
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one thought by id
    getThoughtById({ params }, res) {
        // Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled.
      Thought.findOne({ _id: params.thoughtId })
        .then(dbThoughtData => {
          // If no thought is found, send 404
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
    
        // create thought
createThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
             // Note here that we're using the $push method to add the thought's _id to the specific user we want to update. The $push method works just the same way that it works in JavaScript—it adds data to an array. All of the MongoDB-based functions like $push start with a dollar sign ($), making it easier to look at functionality and know what is built-in to MongoDB and what is a custom noun the developer is using.
          { new: true }
             //  Because we passed the option of new: true, we're receiving back the updated user (the user with the new thought included).
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

    // update thought by id
    // With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document. If we don't set that third parameter, { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document.

// update thought by id
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true }) // Notice the new option in place, runValidators: true? We need to include this explicit setting when updating data so that it knows to validate any new information.
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete thought
deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
        }
          return User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { thoughts: params.thoughtId } },
            { new: true }
          );
        })
        .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
    
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true } 
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },
  }

module.exports = thoughtController;
