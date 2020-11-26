const { User } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
      User.find({})
      // (When adding comments): Even though the user stored the comment, all we can see is the comment _id. Sound familiar? We also ran into this issue with SQL. There, we joined two tables to resolve the problem, but in MongoDB we'll populate a field. To populate a field, just chain the .populate() method onto your query, passing in an object with the key path plus the value of the field you want populated.
    //   .populate({
    //     path: 'comments',
    //     select: '-__v'
    //     // Note that we also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on comments either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field.
    //   })
      // Since we're doing that for our populated comments, let's update the query to not include the user's __v field either, as it just adds more noise to our returning data.
        .select('-__v')
        // Lastly, we should set up the query so that the newest user returns first. Mongoose has a .sort() method to help with this. After the .select() method, use .sort({ _id: -1 }) to sort in DESC order by the _id value. This gets the newest user because a timestamp value is hidden somewhere inside the MongoDB ObjectId.
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one user by id
    getUserById({ params }, res) {
        // Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled.
      User.findOne({ _id: params.id })
      .populate(
          // fixed error by enclosing objects in array
          [{
        path: 'thoughts',
        select: '-__v'
      },
      {
        path: 'friends',
        select: '-__v'
      }]
      )
    //   .select('-__v')
        .then(dbUserData => {
          // If no user is found, send 404
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
    
        // create user
createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  
    },

    // update user by id
    // With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document. If we don't set that third parameter, { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document.

// update user by id
updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) // Notice the new option in place, runValidators: true? We need to include this explicit setting when updating data so that it knows to validate any new information.
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete user
  // BONUS: Remove a user's associated thoughts when deleted.
deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  }
  }

module.exports = userController;
