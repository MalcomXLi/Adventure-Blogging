

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
        console.log("Did not load properly");
        //document.location.href = 'login.html';
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
        <UserList data={this.state.data} />
      </div>
    );
  }
});

var UserList = React.createClass({
  render: function() {
    var loginNodes = this.props.data.map(function(entryInfo, index) {
      console.log(entryInfo.TripName);
	  var header = "data:image/jpeg;base64,";
	  var decompressed = Base64String.decompress(unescape(entryInfo.Image));
	  if(decompressed.indexOf("jpeg") > -1){
		  var uncompressed = header.concat(decompressed.substring(20));
	  }	  
      return (
        //wrap with div because react can only return on thing at a time
        <div className="entries">
           <User trip_name = {entryInfo.TripName}
            user={entryInfo.UserName}
            days= {entryInfo.Days}
            destination = {entryInfo.Destination}
            description= {entryInfo.Description}
            itinerary = {entryInfo.Itinerary}
            moments= {entryInfo.Moments}
            complaints = {entryInfo.Complaints}
            suggestions= {entryInfo.Suggestions}
            souvenirs= {entryInfo.Souvenirs}
			img= {uncompressed}
            key={index}>
            Days: {entryInfo.Days}
          </User>
          <hr/>
        </div>
      );
    });
    return (

      <div className="entryList">
        {loginNodes}
      </div>
    );
  }
});


var User = React.createClass({

  render: function() {
    return (
      <div className = "row entry">
      <br/>
        <h2 className="TripName small-10 columns">
          {this.props.trip_name}
        </h2>
        <br/>
        <div className="small-2 columns">
            Days: {this.props.days}
        </div>
        <div className="small-12 columns">
          <h4> Destination </h4>
            {this.props.destination}
        </div>
        <div className="small-12 columns">
          <h4> Destination </h4>
            {this.props.description}
        </div>
        <div className="small-12 columns">
          <h4> Itinerary </h4>
            {this.props.itinerary}
        </div>
        <div className="small-12 columns">
          <h4> Favorite Moments </h4>
            {this.props.moments}
        </div>
        <div className="small-12 columns">
          <h4> Complaints </h4>
            {this.props.complaints}
        </div>
        <div className="small-12 columns">
          <h4> Suggestions </h4>
            {this.props.suggestions}
        </div>
        <div className="small-12 columns">
          <h4> Souvenirs </h4>
            {this.props.souvenirs}
        </div>
		<div className="small-12 columns">
          <h4> Image </h4>
			<img src={this.props.img}></img>
        </div>
        <div className="small-4 left columns">
        <br/>
          <form onSubmit={this.onSubmit} className="MyForm">
            <button type="submit" className="small button deletePost">Delete Post</button>
          </form>
        </div>
        <div className="small-2 right columns">
        <br/>
           <i> Posted By: </i>{this.props.user} 
        </div>
      </div>
    );
  },

  onSubmit: function(event){
    event.preventDefault();
    var user = this.props.user;
    var postName = this.props.trip_name;
    var deleteData =({user: user, TripName: postName});
    $.ajax({
      url: '/delete',
      dataType: 'json',
      type: 'POST',
      data: deleteData,
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

});

ReactDOM.render(
  <UserBox url="/home" pollInterval={3000} />,
  document.getElementById('content')
);
