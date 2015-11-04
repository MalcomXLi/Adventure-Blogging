
var UserBox = React.createClass({

  handleUserPost: function(post) {
    var log = this.state.data;
	   console.log("alright man");
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: post,
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
        <SubmitForm onUserSubmit={this.handleUserPost} />
      </div>
    );
  }
});


var SubmitForm = React.createClass({
  handleSubmit: function(e) {
	//this.refs.form.submit();
	console.log("???");
    e.preventDefault();
    var name = this.refs.TripName.value.trim();
    var days = this.refs.daysTravel.value.trim();
	var dest = this.refs.destination.value.trim();
	var descrip = this.refs.description.value.trim();
	var itin = this.refs.itinerary.value.trim();
	var moments = this.refs.favMoments.value.trim();
	var complaints = this.refs.complaints.value.trim();
	var suggestions = this.refs.suggestions.value.trim();
	var souvenirs = this.refs.souvenirs.value.trim();
	console.log("got here for some reason")

    if (!name || !days || !dest || !descrip) {
		console.log("in for some reason");
      return;
    }
	console.log("passed it");
    this.props.onUserSubmit({TripName: name, Days: days, Destination: dest, Description: descrip, Itinerary: itin, Moments: moments, Complaints: complaints, Suggestions: suggestions, Souvenirs: souvenirs});
    this.refs.TripName.value = '';
    this.refs.daysTravel.value = '';
  	this.refs.destination.value = '';
  	this.refs.description.value = '';
  	this.refs.itinerary.value = '';
  	this.refs.favMoments.value = '';
  	this.refs.complaints.value = '';
  	this.refs.suggestions.value = '';
  	this.refs.souvenirs.value = '';
  },
  render: function() {
    return (
      <form className="submitForm" onSubmit={this.handleSubmit} ref="form">
        <div id='Entry'>
          <h4>Trip Name:</h4>
          <input type="text" placeholder="Trip Name" ref="TripName" />
          <h4>Days of Travel:</h4>
          <input type="text" placeholder="Days of Travel" ref="daysTravel" />
		  <h4>Destination:</h4>
          <input type="text" placeholder="Destination" ref="destination" />
		  <h4>Description:</h4>
          <textarea rows={5} cols={40}  type="text" placeholder="Description" ref="description"/>
		  <h4>Itinerary:</h4>
          <textarea rows={5} cols={40} type="text" placeholder="Itinerary" ref="itinerary" />
		  <h4>Favorite Moments:</h4>
          <textarea rows={5} cols={40} type="text" placeholder="Favorite Moments" ref="favMoments" />
		  <h4>Complaints:</h4>
          <textarea rows={5} cols={40} type="text" placeholder="Complaints" ref="complaints" />
		  <h4>Suggestions:</h4>
          <textarea rows={5} cols={40} type="text" placeholder="Suggestions" ref="suggestions" />
		  <h4>Cool Souvenirs:</h4>
          <textarea rows={5} cols={40} type="text" placeholder="Cool Souvenirs" ref="souvenirs" />
        </div>
        <input type="submit" value="Post" href="/"/>
      </form>
    );
  }
});

ReactDOM.render(
  <UserBox url="/postentry" />,
  document.getElementById('entries')
);
