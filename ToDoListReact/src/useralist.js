import React from 'react';

function Users({ users }) {
  return (
    <section className="user-list">
      <header className="header">
        <h1>Users</h1>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default Users;
