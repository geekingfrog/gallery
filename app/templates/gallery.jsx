/**
 * @jsx React.DOM
 */

var computeDisposition = require('../utils').computeDisposition;
var GalleryBox = React.createClass({
  getInitialState: function() {
    return { data: [] }
  },

  componentWillMount: function() {
    var fetching = $.getJSON('/api/ponies');
    var that = this;
    fetching.then(function(data) {
      console.log('got data from server: %d ponies', data.length);
      that.setState({data: data});
    });
  },

  render: function() {
    return (
      <div className='galleryBox'>
        <ImageList data={this.state.data} />
        <h1> Should be after </h1>
      </div>
    );
  }
});

var ImageList = React.createClass({
  render: function() {
    var viewport = {
      width: $(window).width()*.95,
      // height: $(window).height()
      height: window.innerHeight
    };

    var imgs = computeDisposition(this.props.data, viewport);
    var imageNodes = imgs.map(function(img) {
      return <ImageBox key={img.url} data={img}></ImageBox>;
    });
    var height=0;
    var lastImage = imgs[imgs.length-1];
    if(lastImage) height = lastImage.top + lastImage.height;

    var style = { height: height };
    return (
      <div style={style} className='imageList'>
        {imageNodes}
      </div>
    )
  }
});

var ImageBox = React.createClass({
  getInitialState: function() {
    return { clicked: false };
  },

  handleClick: function() {
    this.setState({ clicked: !this.state.clicked });
  },

  render: function(sev) {
    var classes = React.addons.classSet({
      'image': true,
      'details': this.state.clicked
    });

    var style = {
      left: Math.floor(this.props.data.left),
      top: Math.floor(this.props.data.top),
      width: Math.ceil(this.props.data.width),
      height: Math.ceil(this.props.data.height)
    };

    var imgStyle = _.omit(style, 'left', 'top');

    return (
      <div onClick={this.handleClick} className={classes} style={style}>
        <img src={this.props.data.url} style={imgStyle}/>
        <ImageLegend data={this.props.data} />
      </div>
    )
  }
});

var ImageLegend = React.createClass({
  render: function() {
    return (
      <div className='legend'>
        <div className='banner'>
          {this.props.data.name}
        </div>
        <ul>
          <li> Kind: {this.props.data.kind} </li>
          <li> Eyes: {this.props.data.eyes} </li>
        </ul>
      </div>
    );
  }
});

React.renderComponent(
  <GalleryBox />,
  document.getElementById('gallery')
);
