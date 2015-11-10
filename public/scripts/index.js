
var User = React.createClass({

  onSubmit: function(event){
    event.preventDefault();
    var user = this.props.user;
    var password = this.props.children;
    var deleteData =({user: user, password: password});
    $.ajax({
      url: '/api/delete',
      dataType: 'json',
      type: 'POST',
      data: deleteData,
      success: function(data) {
        console.log(data);
        console.log("success!");
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="user large-4 columns">
        <form onSubmit={this.onSubmit} className="MyForm">
          <button type="submit">Delete</button>
        </form>
        <h2 className="UserName">
          {this.props.user}
        </h2>
        {this.props.children} 
      </div>
    );
  }

});

var UserBox = React.createClass({
  loadUsersFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleUserSubmit: function(login) {
    // var log = this.state.data;
    // var newLogins = log.concat([login]);
    // this.setState({data: newLogins}); //For more responsiveness
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: login,
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadUsersFromServer();
    setInterval(this.loadUsersFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="userBox">
        <h1>Users</h1>
        <SubmitForm onUserSubmit={this.handleUserSubmit} />
        <UserList data={this.state.data} />
      </div>
    );
  }
});

var UserList = React.createClass({
  render: function() {
    var loginNodes = this.props.data.map(function(loginInfo, index) {
      return (
        <User user={loginInfo.Login} key={index}>
          First Name : {loginInfo.Fname}
        </User>
      );
    });
    return (
      <div className="userList">
        {loginNodes}
      </div>
    );
  }
});

var SubmitForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var userName = this.refs.Login.value.trim();
    var password = this.refs.Password.value.trim();
    if (!userName || !password) {
      return;
    }
    this.props.onUserSubmit({Login: userName, Password: password});
    this.refs.Login.value = '';
    this.refs.Password.value = '';
  },
  render: function() {
    return (
      <form className="submitForm" onSubmit={this.handleSubmit}>
        <div id='Login'>
          <h3 id = "login">Login: </h3>
          <h4>User Name:</h4>
          <input type="text" placeholder="User Name" ref="Login" />
          <h4>Password:</h4>
          <input type="text" placeholder="Password" ref="Password" />
        </div>
        <input type="submit" value="Login" />
      </form>
    );
  }
});

ReactDOM.render(
  <UserBox url="/login" pollInterval={2000} />,
  document.getElementById('content')
);
