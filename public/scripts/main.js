/* To Do
Filter buttons- show streamers who are offline or online
Add stream discriptions
add more styling
*/

var AddUser = React.createClass({
  handleChange: function(e) {
    e.preventDefault();
    this.props.onUserInput(
      this.refs.userTextInput.value
    );
    this.ref.userTextInput.value = '';
  },
  render: function() {
    return (
      <form  onSubmit={this.handleChange}>
        <input
          className="form-control"
          type="text"
          placeholder="Add user.."
          value={this.props.filter_text}
          ref="userTextInput"
        />
      </form>
    );
  }
});


var ViewUser = React.createClass({
  getInitialState: function() {
    return {
      not_exists: true,
      streaming: false,
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
    }
  },
  componentDidMount: function() {
    $.ajax({
      dataType: "json",
      url:"https://api.twitch.tv/kraken/channels/"+this.props.name+"?callback=?",
      success: function(data) {
        if(data.status !== 404){
          console.log(data);
          if(data.game === null){
            this.setState({
            streaming: false,
            not_exists: false,
            link:data.url,
            game: "Offline",
            img: (data.logo===null)?
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
            :data.logo,
            status: "offline"
            });
          }
          else if(data === undefined){
            this.setState({
              streaming:false,
              not_exists:true,
              game: "Account Closed",
              status: "offline"
            });
          }
          else{
            this.setState({
              streaming: true,
              not_exists: false,
              link: data.url,
              desciption: data.status,
              game: data.game,
              display_name: data.display_name,
              img: (data.logo===null)?
              'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
              :data.logo,
              status: "online"
            });
          }
        }
      }.bind(this)
    });
  },
  render: function(){
    var display_name = this.state.display_name||this.props.name;
    return(
        <div className="row">
          <div className="col-xs-2 col-sm-1" id="icon">
            <img src={this.state.img} className="logo" />
            </div>
            <div className="col-xs-10 col-sm-3" id="name">
              <a href={this.state.link} target="_blank">{display_name}</a>
            </div>
            <div className="col-xs-10 col-sm-8" id="streaming">
              {this.state.game} <span className="hidden-xs">{this.state.desciption}</span>
            </div>
          </div>



    );
  }
});

var TwitchTv = React.createClass({
  getInitialState: function() {
    return {
      filter_status: 'all',
      filter_text: '',
      list_stream: this.props.people,
    };
  },
  onButtonClick: function(online) {
    this.setState({filter:online});
  },
  addUserInput: function(name) {
    var list_stream = this.state.list_stream;
    list_stream.push(name)
    this.setState({list_stream: list_stream});
  },
  render: function() {
    return(

      <div className="container">
      <h1><i className="fa fa-twitch"></i></h1>
      <div id="display">
        {this.state.list_stream.map(
          function(result){
            return(
              <ViewUser name={result} filter={this.state.filter} />
            )}.bind(this)
        )
      }

        </div>
            <div className="add-user">
               <AddUser
                  onUserInput={this.addUserInput}
              />
          </div>



      </div>
     );
  }
});

var streamers = ["dota2ti","ESL_SC2", "OgamingSC2", "cretetion","freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

ReactDOM.render(
  <TwitchTv people={streamers}/>,
  document.getElementById('content')
);
