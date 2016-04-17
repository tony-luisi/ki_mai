
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({id: 1, username: 'tluisi', fullname: 'Tony Luisi', google_id: '113165786618622428658', email: 't.luisi@gmail.com', password_salt: 'abc', password: 'abc'}),
    knex('users').insert({id: 2, username: 'test2', fullname: 'AAA AAA', email: 't.luisi@gmail.com', password_salt: 'abc', password: 'abc'}),
    knex('users').insert({id: 3, username: 'test3', fullname: 'BBB BBB', email: 't.luisi@gmail.com', password_salt: 'abc', password: 'abc'})
  );
};
