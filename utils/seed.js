const connection = require('../config/connection');
const { Thought, User } = require('../models');
const { getRandomName, getRandomThought } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  // Delete the collections if they exist
  let postCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (postCheck.length) {
    await connection.dropCollection('thoughts');
  }

  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  const users = [];
  const thoughts = [];

  // Create Thought documents
  for (let i = 0; i < 40; i++) {
    const thoughtText = getRandomThought();
    const username = getRandomName().split(' ')[0]; // Assuming username is first name

    const newThought = await Thought.create({
      thoughtText,
      username,
    });

    thoughts.push(newThought);
  }

  // Create User documents and reference Thought ObjectIds
  for (let i = 0; i < 20; i++) {
    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    const username = `${first} ${last}`;
    const email = `${first}_${last}@mail.com`;
    const userThoughts = thoughts.slice(i * 2, i * 2 + 2).map(thought => thought._id);
    const friends = [];

    users.push({
      username,
      email,
      thoughts: userThoughts,
      friends,
    });
  }

  console.table(users);

  await User.create(users);

  console.info('Seeding complete! 🌱');
  process.exit(0);
});