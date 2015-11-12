
var User = React.createClass({

  // onSubmit: function(event){
  //   event.preventDefault();
  //   var user = this.props.user;
  //   var password = this.props.children;
  //   var deleteData =({user: user, password: password});
  //   $.ajax({
  //     url: '/api/delete',
  //     dataType: 'json',
  //     type: 'POST',
  //     data: deleteData,
  //     success: function(data) {
  //       console.log(data);
  //       console.log("success!");
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },

  render: function() {
    return (
      <div className = "row">
        <div className="user large-4 large-centered small-4 columns">
          <h2 className="UserName">
            {this.props.user}
          </h2>
          {this.props.children} 
        </div>
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
        document.location.href = 'login.html';
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
        <div className = "row">
          <div className="user large-4 large-centered small-4 columns">
            <h1>Users</h1>
          </div>
        </div>
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

ReactDOM.render(
  <UserBox url="/login" pollInterval={2000} />,
  document.getElementById('content')
);
