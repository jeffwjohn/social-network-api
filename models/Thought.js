const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        // must be 1-280 characters
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        require: true
    },
    reactions: [reactionSchema]
},
{
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });
  
const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
