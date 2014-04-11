/**
 * @jsx React.DOM
 */

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
      </div>
    );
  }
});

var ImageList = React.createClass({
  render: function() {
    console.log('data: ', this.props.data);
    var imageNodes = this.props.data.map(function(img) {
      return <ImageBox key={img.url} url={img.url}> </ImageBox>
    });
    var computeDisposition = require('../utils').computeDisposition;
    var viewport = {
      width: 900,
      height: $(window).height()
    };
    var imgs = computeDisposition(this.props.data, viewport);
    console.log('computed images: ', imgs);
    var imageNodes = imgs.map(function(img) {
      return <ImageBox data={img}></ImageBox>;
    });

    return (
      <div className='imageList'>
        {imageNodes}
      </div>
    )
  }
});

var ImageBox = React.createClass({
  render: function() {
    var classes = React.addons.classSet({
      'image': true
    });

    var style = {
      left: this.props.data.left,
      top: this.props.data.top,
      width: this.props.data.width,
      height: this.props.data.height,
    };

    var imgStyle = _.omit(style, 'left', 'top');

    return (
      <div className={classes} style={style}>
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
        </ul>
      </div>
    );
  }
});

React.renderComponent(
  <GalleryBox />,
  document.getElementById('gallery')
);
