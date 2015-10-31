
var UserBox = React.createClass({

  handleUserSubmit: function(login) {
    var log = this.state.data;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: login,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    //go back to home
    window.location = '/';
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      <div className="signupBox">
        <SubmitForm onUserSubmit={this.handleUserSubmit} />
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
          <h4>User Name:</h4>
          <input type="text" placeholder="User Name" ref="Login" />
          <h4>Password:</h4>
          <input type="text" placeholder="Password" ref="Password" />
        </div>
        <input type="submit" value="Post" href="/"/>
      </form>
    );
  }
});

ReactDOM.render(
  <UserBox url="/signup" />,
  document.getElementById('signup')
);
