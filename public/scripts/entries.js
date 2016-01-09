var tags = [];


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
        //go back to home
        window.location = '/';
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        alert("Must be logged in to post data!");
        window.location = 'login.html';
      }.bind(this)
    });
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
  
  handleChange: function(e){
    e.preventDefault();
		var self = this;
		var file = e.target.files[0];
		
		var reader = new FileReader();
		reader.onload = function(upload){
			console.log("The file has been read...");
			self.setState({data_uri: upload.target.result});
			console.log("DATA_URI", self.state.data_uri);
		};
		reader.readAsDataURL(file);
	},

	getInitialState: function(){
		return {
			data_uri: null,
		};
	},
  
  handleSubmit: function(e) {
  	//this.refs.form.submit();

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
    this.props.onUserSubmit({
      TripName: name, 
      Days: days, 
      Destination: dest, 
      Description: descrip, 
      Itinerary: itin, 
      Moments: moments, 
      Complaints: complaints, 
      Suggestions: suggestions, 
      Souvenirs: souvenirs,
      Tags: tags,
      Image: this.state.data_uri
    });

    if (!name || !days || !dest || !descrip) {
		console.log("in for some reason");
      return;
    }
	var compressedString = escape(Base64String.compress(this.state.data_uri));
    this.props.onUserSubmit({TripName: name, Days: days, Destination: dest, Description: descrip, Itinerary: itin, Moments: moments, Complaints: complaints, Suggestions: suggestions, Souvenirs: souvenirs, Image: compressedString});

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

  handleTags: function(e){
    e.preventDefault();
    tags.push(this.refs.tags.value.trim());
    this.refs.tags.value = '';
    this.refs.added_tags.value = tags.toString();
    //alert(tags);
  },

  render: function() {
    return (
	<section>
      <form className="submitForm" encType="multipart-formdata" onSubmit={this.handleSubmit} ref="form">
        <div className='row submitForm'>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Trip Name:</h4>
                <input type="text" placeholder="Trip Name" ref="TripName" />
            </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Days of Travel:</h4>
                <input type="text" placeholder="Days of Travel" ref="daysTravel" />
      		  </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Destination:</h4>
                <input type="text" placeholder="Destination" ref="destination" />
      		  </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Description:</h4>
                <textarea rows={5} cols={40}  type="text" placeholder="Description" ref="description"/>
      		  </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Itinerary:</h4>
                <textarea rows={5} cols={40} type="text" placeholder="Itinerary" ref="itinerary" />
      		  </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Favorite Moments:</h4>
                <textarea rows={5} cols={40} type="text" placeholder="Favorite Moments" ref="favMoments" />
      		  </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Complaints:</h4>
                <textarea rows={5} cols={40} type="text" placeholder="Complaints" ref="complaints" />
      		  </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
                <h4>Suggestions:</h4>
                <textarea rows={5} cols={40} type="text" placeholder="Suggestions" ref="suggestions" />
      		  </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
              <h4>Cool Souvenirs:</h4>
              <textarea rows={5} cols={40} type="text" placeholder="Cool Souvenirs" ref="souvenirs" />
            </div>
          </div>
          <div className = 'row'>
            <div className = "small-6 small-centered columns">
                <h4>Tags:</h4>
                <textarea type="text" placeholder="Tags" ref="tags" />
                <button className="small button" onClick ={this.handleTags} > Add Tag</button>
                <textarea type="text" placeholder="Added Tags" ref="added_tags" />
            </div>
          </div>
          <div className = 'row'>
            <div className = "large-6 large-centered small-6 small-centered columns">
              <h4>Upload Images:</h4>
              <input type="file" onChange={this.handleChange}/>
              <input className="small button" type="submit" value="Post" href="/"/>
            </div>
          </div>
        </div>
      </form>
	  </section>
    );
  }
});

ReactDOM.render(
  <UserBox url="/postentry" />,
  document.getElementById('entries')
);
