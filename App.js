import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from './redux/userSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  return (
    <div>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <Link to={`/users/${user.id}`}>View</Link>
                <Link to={`/users/${user.id}/edit`}>Edit</Link>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/users/add">Add User</Link>
    </div>
  );
};

const UserForm = ({ match, history }) => {
  const dispatch = useDispatch();
  const userId = match.params.userId;
  const editing = userId !== 'add';

  const user = useSelector(state => state.users.find(user => user.id === parseInt(userId)));

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  useEffect(() => {
    if (editing && user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [editing, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = { name, email, phone };

    if (editing) {
      dispatch(updateUser({ id: user.id, userData }));
    } else {
      dispatch(createUser(userData));
    }

    history.push('/');
  };

  return (
    <div>
      <h1>{editing ? 'Edit User' : 'Add User'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

const UserDetails = ({ match }) => {
  const user = useSelector(state => state.users.find(user => user.id === parseInt(match.params.userId)));

  return (
    <div>
      <h1>User Details</h1>
      {user ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={UserList} />
        <Route exact path="/users/add" component={UserForm} />
        <Route exact path="/users/:userId/edit" component={UserForm} />
        <Route exact path="/users/:userId" component={UserDetails} />
      </Switch>
    </Router>
  );
};

export default App;
