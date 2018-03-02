Vue.component('star-rating', VueStarRating.default);
var app = new Vue({
  el: '#app',
  data: {
    number: '',
    max: '',
    current: {},
    loading: true,
    addedName: '',
    addedComment: '',
    comments: {},
    rating: 0,
    averageRatings: {},
  },
  created: function() { //when the vue instance is created, run this function. Wait until it's ready.
  this.xkcd();
},
watch: {
  number: function(value,oldvalue) {
    if (oldvalue === '') {
      this.max = value;
    }
    this.xkcd();
  },
},
methods: {
  xkcd: function() {
    this.loading = true;
    fetch('https://xkcd.now.sh/' + this.number).then(response => {
      return response.json();
    }).then(json => {
      this.current = json;
      this.loading = false;
      this.number = json.num;
      return true;
    }).catch(err => {
      this.number = this.max;
    });
  },
  previousComic: function() {
    this.number = this.current.num - 1;
    this.rating-=5;
  },
  nextComic: function() {
    this.number = this.current.num + 1;
    this.rating-=5;
  },
  getRandom: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
  },
  randomComic: function() {
    this.number = this.getRandom(1, this.max);
  },
  lastComic: function(){
    this.number = '';
  },
  firstComic: function(){
    this.number = 1;
  },
  addComment: function() {
    if (!(this.number in this.comments))
    Vue.set(app.comments, this.number, new Array);
    this.comments[this.number].push({author:this.addedName,text:this.addedComment,
      date:new Date().toLocaleDateString(), time:new Date().toLocaleTimeString()});
    this.addedName = '';
    this.addedComment = '';
  },
  addRating: function(){
    if(!(this.number in this.averageRatings)){
      Vue.set(app.averageRatings, this.number, {totalRatings: 0, numberRatings: 0, averageRating: 0});
    }
    this.averageRatings[this.number].totalRatings = this.averageRatings[this.number].totalRatings + this.rating;
    this.averageRatings[this.number].numberRatings = this.averageRatings[this.number].numberRatings + 1;
    this.averageRatings[this.number].averageRating = this.averageRatings[this.number].totalRatings/this.averageRatings[this.number].numberRatings;
    this.rating-=5;
  },
},
computed: {
  month: function() {
    var month = new Array;
    if (this.current.month === undefined)
    return '';
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[this.current.month - 1];
  },
  avgRat: function(){
    if(!(this.number in this.averageRatings)){
      return 0;
    } else {
      return this.averageRatings[this.number].averageRating;
    }
  }
},
});
