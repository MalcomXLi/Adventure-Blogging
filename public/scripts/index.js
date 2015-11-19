

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
      console.log(entryInfo);
      return (
        //wrap with div because react can only return on thing at a time
        <div className="entries">
           <User user={entryInfo.TripName} 
            trip_name = {entryInfo.TripName}
            days= {entryInfo.Days}
            destination = {entryInfo.Destination}
            description= {entryInfo.Description}
            itinerary = {entryInfo.Itinerary}
            moments= {entryInfo.Moments}
            complaints = {entryInfo.Complaints}
            suggestions= {entryInfo.Suggestions}
            souvenirs= {entryInfo.Souvenirs}
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

      </div>
    );
  }


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

});

ReactDOM.render(
  <UserBox url="/home" pollInterval={2000} />,
  document.getElementById('content')
);
