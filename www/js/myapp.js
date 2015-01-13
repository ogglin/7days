angular.module('sevendays', ['ionic','infinite-scroll'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent' :{
          templateUrl: "templates/check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
    .state('eventmenu.attendees', {
      url: "/attendees",
      views: {
        'menuContent' :{
          templateUrl: "templates/attendees.html",
          controller: "AttendeesCtrl"
        }
      }
    })
  
  $urlRouterProvider.otherwise("/event/home");
})

.controller('MainCtrl', function($scope,$http, $ionicSideMenuDelegate) {
        var body = document.body, html = document.documentElement;
        var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );
        $scope.height = height+"px";   
        $scope.news = []; 
        $scope.page = 1;
        $scope.more = true;
        
        $scope.loadMore = function() {
          //if (busy) retrun;
          //busy = true;
          $http.get('http://mobile.7days.us/api/all/page/'+ $scope.page).
            success(function(data, status, headers, config) { 
              $.each(data.posts, function(i, item) {
                   $scope.news.push(generateNews(item)); 
              });
          }).finally(function () {
          $scope.page +=1; 
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }); 
        };
    
  $scope.loadMore();  
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('CheckinCtrl', function($scope) {
  $scope.showForm = true;
  
  $scope.shirtSizes = [
    { text: 'Large', value: 'L' },
    { text: 'Medium', value: 'M' },
    { text: 'Small', value: 'S' }
  ];
  
  $scope.attendee = {};
  $scope.submit = function() {
    if(!$scope.attendee.firstname) {
      alert('Info required');
      return;
    }
    $scope.showForm = false;
    $scope.attendees.push($scope.attendee);
  };
  
})

.controller('AttendeesCtrl', function($scope) {
  
  $scope.activity = [];
  $scope.arrivedChange = function(attendee) {
    var msg = attendee.firstname + ' ' + attendee.lastname;
    msg += (!attendee.arrived ? ' has arrived, ' : ' just left, '); 
    msg += new Date().getMilliseconds();
    $scope.activity.push(msg);
    if($scope.activity.length > 3) {
      $scope.activity.splice(0, 1);
    }
  };
  
});

function generateNews(item) {
       
        var s = new Object();
        var content =  item.content;
        s.id             = item.id;
        s.title          = item.title;
        s.date           = item.date;
        s.image          = item.image;
        s.content        = content.replace(/<[^>]+>/gm, '').substr(0,45);
        s.category       = item.category;
        s.category_name  = item.category_name;
        var insertValues = {
            values: [s.id,s.category,JSON.stringify(item)]
        };
        //addItem(insertValues);
    return s;    
}
