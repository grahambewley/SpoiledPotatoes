movieReviewsTestApp.controller('critics', function ($scope, $http, $log, $filter) {
    
    //Get the JSON object of critics stored locally
    $http({
  
        method: 'GET',
        url: 'data/critics.json'
    
    }).then(function (response){
        
        //Grab the JSON object from the HTTP response and store it as a Javascript object
        $scope.critics = angular.fromJson(response).data;
        
        //Call the function that reads the reviews list and counts reviews and picks
        $scope.countCriticsPicks();
        
    },function (error){
        
        $log.log(error);
    
    });
    
    /*
        This function pulls down the list of reviews and attributes the number of articles and number of Critic's Picks to the 
        appropriate critic object. 
    */
    $scope.countCriticsPicks = function() {
        
        //Get the JSON object of reviews stored locally
        $http({

            method: 'GET',
            url: 'data/movie-reviews.json'

        }).then(function (response){

            //Grab the JSON object from the HTTP response and store it as a Javascript object
            $scope.reviews = angular.fromJson(response).data;
            
            $scope.criticsPickCounts = {};
            $scope.reviewCounts = {};
            
            $scope.reviews.forEach(function(review) {
                
                //Count total number of REVIEWS and store in a seperate object to refer to later
                if(review.byline in $scope.reviewCounts)
                    $scope.reviewCounts[review.byline] += 1;
                else 
                    $scope.reviewCounts[review.byline] = 1;
                
                //Count total number of CRITIC'S PICKS and store in a seperate object to refer to later
                if(review.critics_pick == '1'){
                    if(review.byline in $scope.criticsPickCounts)
                        $scope.criticsPickCounts[review.byline] += 1;
                     else 
                        $scope.criticsPickCounts[review.byline] = 1;
                }

            });
            
            //Call the function that adds the review_count and critics_pick_count properties to the critic objects
            $scope.attributePicks();

        },function (error){

            $log.log(error);

        });
    }
    
    $scope.attributePicks = function() {
        
        //Attribute the total number of reviews to the appropriate critic object
        $scope.critics.forEach(function(critic) {
            
            var upperName = critic.display_name.toUpperCase();
            
            var revCount = $scope.reviewCounts[upperName];
            
            if(revCount == undefined)
                critic['review_count'] = 0;
            else
                critic['review_count'] = revCount;
            
        });
        
        //Attribute the total number of Critic's Picks to the appropriate critic object
        $scope.critics.forEach(function(critic) {
            
            var upperName = critic.display_name.toUpperCase();
            
            var pickCount = $scope.criticsPickCounts[upperName];
            
            if(pickCount == undefined)
                critic['critics_pick_count'] = 0;
            else
                critic['critics_pick_count'] = pickCount;
            
        });
        
    }
    
});