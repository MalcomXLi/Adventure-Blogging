
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
    var email = this.refs.Email.value.trim();
    var fname = this.refs.fname.value.trim();
    var lname = this.refs.lname.value.trim();
    var password = this.refs.Password.value.trim();
    var userName = this.refs.Log.value.trim();
    var gender = this.refs.Gender.value.trim();
    if (!userName || !password || !email || !fname || !lname || !gender) {
      return;
    }
    this.props.onUserSubmit({
      Login: userName, 
      Password: password,
      Email: email, 
      Fname: fname,
      Lname: lname, 
      Gender: gender,
    });
    this.refs.Login.value = '';
    this.refs.Password.value = '';
    this.refs.Email.value = '';
    this.refs.fname.value = '';
    this.refs.lname.value = '';
    this.refs.Gender.value = '';
  },
  render: function() {
    return (
      <form className="submitForm" onSubmit={this.handleSubmit}>
        <div id='Login'>
          <h4>User Name:</h4>
          <input type="text" placeholder="User Name" ref="Log" />
        </div>
       <div id='Login'>
          <h4>Password:</h4>
          <input type="text" placeholder="Password" ref="Password" />
        </div>
        <div id='Login'>
          <h4>Email:</h4>
          <input type="text" placeholder="Email" ref="Email" />
        </div>
        <div id='Login'>
          <h4>First Name:</h4>
          <input type="text" placeholder="First Name" ref="fname" />
        </div>
        <div id='Login'>
          <h4>Last Name:</h4>
          <input type="text" placeholder="Last Name" ref="lname" />
        </div>
        <div id='Login'>
          <h4>Gender:</h4>
          <select name="Gender" ref="Gender">
            <option value="Male" >Male</option>
            <option value="Female" >Female</option>
          </select>
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
