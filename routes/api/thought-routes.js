const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    // addReaction,
    // removeReaction
  } = require('../../controllers/thought-controller');


// /api/thoughts
router.route('/')
    .get(getAllThoughts)

// /api/thoughts/<thoughtId>
router
  .route('/:thoughtId')
     .get(getThoughtById)
     .put(updateThought)
     

// /api/thoughts/<userId>
router
  .route('/:userId')
  .post(createThought);
  // (don't forget to push the created thought's _id to the associated user's thoughts array field)
  // example data
// {
//     "thoughtText": "Here's a cool thought...",
//     "username": "lernantino",
//     "userId": "5edff358a0fcb779aa7b118b"
//   }

// /api/thoughts/<userId>/<thoughtId>
router
  .route('/:userId/:thoughtId')
  .delete(deleteThought)
//   .put(addReaction)
//   .delete(removeThought)
// Remember that the callback function of a route method has req and res as parameters, so we don't have to explicitly pass any arguments to addReaction.

// Go ahead and create a DELETE route to handle removeReaction. You'll need to create a new route for this one, because you'll need the id of the individual reaction, not just its parent.
// router.route('/:userId/:thoughtId/:reactionId').delete(removeReaction);
// Again, we're trying to model the routes in a RESTful manner, so as a best practice we should include the ids of the parent resources in the endpoint. It's kind of like saying, "Go to this pizza, then look at this particular thought, then delete this one reaction."

module.exports = router;