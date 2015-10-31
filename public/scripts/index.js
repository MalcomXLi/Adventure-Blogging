

var User = React.createClass({

  onSubmit: function(event){
    event.preventDefault();
    var author = this.props.author;
    var children = this.props.children;
    var deleteData =({author: author, text: children});
    $.ajax({
      url: '/api/delete',
      dataType: 'json',
      type: 'POST',
      data: deleteData,
      success: function(data) {
        console.log("success!");
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="user">
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
        this.setState({data: data});
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
          {loginInfo.Password}
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


ReactDOM.render(
  <UserBox url="/user" pollInterval={2000} />,
  document.getElementById('content')
);
