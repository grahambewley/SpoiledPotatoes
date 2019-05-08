'use strict';

var movieReviewsTestApp = angular.module('movieReviewsTestApp', ['ui.router'])
  
//ROUTES
movieReviewsTestApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/app/reviewList.html',
            controller: 'reviewList'
        })
    
        .state('review', {
            url: '/review',
            templateUrl: '/app/review.html',
            controller: 'review'
        })
        
        .state('criticList', {
            url: '/criticList',
            templateUrl: '/app/critics.html',
            controller: 'critics'
        });

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/home');
});

//SERVICES
movieReviewsTestApp.service('selectedReview', function() {
   
    this.title = '';
    this.imageUrl = '';
    this.rating = '';
    this.criticsPick = '';
    this.headline = '';
    this.summary = '';
    this.criticName = '';
    this.articleUrl = ''; 
    
});

movieReviewsTestApp.service('reviewListSettings', function() {
    
    this.filterRating = 'default';
    this.filterPublicationDate = 'default';
    this.filterCriticsPick = '';
    this.filterTitles = '';
    this.reviewsOnPageCount = '20';
    
});

//DIRECTIVES
movieReviewsTestApp.directive("reviewCard", function($location, selectedReview) {
   return {
       templateUrl: 'directives/reviewCard.html',
       replace: true,
       scope: {
           reviewObject: '='
       },
       link: function(scope, elem, attr) {
           //Bind the click event to a function that sets the values of the selectedReview service based on the clicked review card
           elem.bind('click', function(e1) {
               
               selectedReview.title = scope.reviewObject.display_title;
               selectedReview.imageUrl = scope.reviewObject.multimedia.src;
               selectedReview.rating = scope.reviewObject.mpaa_rating;
               selectedReview.criticsPick = scope.reviewObject.critics_pick;
               selectedReview.headline = scope.reviewObject.headline;
               selectedReview.summary = scope.reviewObject.summary_short;
               selectedReview.criticName = scope.reviewObject.byline;
               selectedReview.articleUrl = scope.reviewObject.link.url;               
               
           });
       }
   }
});

movieReviewsTestApp.directive("criticCard", function() {
   return {
       templateUrl: 'directives/criticCard.html',
       replace: true,
       
       scope: {
           criticObject: '='
       }  
   }
});

  