var UserBox = React.createClass({

  handleUserSubmit: function(login) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: login,
      success: function(data) {
        console.log(data);
        document.location.href = '/';
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="userBox">
        <SubmitForm onUserSubmit={this.handleUserSubmit} />
      </div>
    );
  }
});

//Logging in
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
        <div className = "row">
            <div className="large-6 large-centered small-6 columns ">
              <h2 id = "login">Login</h2>
            </div>
        </div>
          <div className = "row">
            <div className="large-6 large-centered small-6 columns ">
              <h4>User Name:</h4>
              <input type="text" placeholder="User Name" ref="Login" />
            </div>
          </div>
          <div className = "row">
            <div className="large-6 large-centered small-6 columns ">
              <h4>Password:</h4>
              <input type="text" placeholder="Password" ref="Password" />
              <input type="submit" value="Login"/>
            </div>
          </div>
        </div>
      </form>
    );
  }
});

ReactDOM.render(
  <UserBox url="/login"/>,
  document.getElementById('content')
);