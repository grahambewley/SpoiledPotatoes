movieReviewsTestApp.controller('reviewList', function ($scope, $http, $log, $filter, selectedReview, reviewListSettings) {
    
    //Set starting filter values using those stored in the reviewListSettings service
    $scope.filterRating = reviewListSettings.filterRating;
    $scope.filterPublicationDate = reviewListSettings.filterPublicationDate;
    $scope.filterCriticsPick = reviewListSettings.filterCriticsPick;
    $scope.filterTitles = reviewListSettings.filterTitles;
    $scope.reviewsOnPageCount = reviewListSettings.reviewsOnPageCount;
    
    //Variables related to pagination
    $scope.startAt = 0;
    $scope.prevAvailable = false;
    $scope.nextAvailable = true;
    
    //Create Date object for Publication Date filtering
    var todaysDate = new Date();todaysDate;
    //Zero-out the time portion of today's date
    todaysDate.setHours(0,0,0,0)
    
    //Get the JSON object stored locally
    $http({
        
        method: 'GET',
        url: 'data/movie-reviews.json'
    
    }).then(function (response){
        
        //Grab the JSON object from the HTTP response and store it as a Javascript object
        $scope.reviews = angular.fromJson(response).data;
        
        //Set initial set of reviewsOnPage to the total list of reviews
        $scope.reviewsOnPage = $scope.reviews;
        
        //Apply initial page filters
        $scope.applyReviewFilters();
        
    },function (error){
        
        $log.log(error);
    
    });
    
    //Watch reviews-per-page selector for changes
    $scope.$watch('reviewsOnPageCount', function(newValue, oldValue) {
        if(newValue != oldValue) {
            //Store new reviewsOnPage value in the reviewListSettings service
            reviewListSettings.reviewsOnPageCount = newValue;
            //Filter the current review list
            $scope.applyReviewFilters();
        }
    });
    
    //Watch Search field for changes
    $scope.$watch('filterTitles', function(newValue, oldValue) {
        if(newValue != oldValue) {
            //Store new filterTitles value in the reviewListSettings service
            reviewListSettings.filterTitles = newValue;
            //Filter the current review list
            $scope.applyReviewFilters();
        }
    })
    
    //Watch Ratings Filter for changes
    $scope.$watch('filterRating', function(newValue, oldValue) {
        if(newValue != oldValue) {
            //Start from the beginning of the list again
            $scope.startAt = 0;
            //Store new filterRating value in the reviewListSettings service
            reviewListSettings.filterRating = newValue;
            //Filter the current review list
            $scope.applyReviewFilters();
        }
    });
    
    //Watch Publication Date filter for changes
    $scope.$watch('filterPublicationDate', function(newValue, oldValue) {  
        if(newValue != oldValue){
            //Start from the beginning of the list again
            $scope.startAt = 0;
            //Store new filterPublicationDate value in the reviewListSettings service
            reviewListSettings.filterPublicationDate = newValue;
            //Filter the current review list
            $scope.applyReviewFilters();
        }
    });
    
    //Watch Ratings Crtic's Pick for changes
    $scope.$watch('filterCriticsPick', function(newValue, oldValue) {
        if(newValue != oldValue) {
            //Start from the beginning of the list again
            $scope.startAt = 0;
            //Store new filterCriticsPick value in the reviewListSettings service
            reviewListSettings.filterCriticsPick = newValue;
            //Filter the current review list
            $scope.applyReviewFilters();   
        }
    });
    
    $scope.applyReviewFilters = function(newValue, oldValue) {
        
        //Start with the full list of reviews
        $scope.reviewsOnPage = $scope.reviews;
        
        //Filter by MPAA Rating
        //If filterRating isn't set to 'Any Rating'
        if($scope.filterRating !== "default") {

            //Filter current list of reviews by current filterRating
            $scope.reviewsOnPage = $scope.reviewsOnPage.filter(function(review) {
                return (review.mpaa_rating == $scope.filterRating);
            });
            
        }
        
        //Filter by Publication Date
        //If filterPublicationDate isn't set to 'Any Publication Date'
        if($scope.filterPublicationDate !== "default") {
            
            //Filter current list of reviews by Publication Date
            $scope.reviewsOnPage = $scope.reviewsOnPage.filter(function(review) {
                
                //Get Publication Date from this article
                var dateParts = review.publication_date.split('-');
                var articleDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);

                //Calculate the difference in this article date and today's date
                var diffTime = Math.abs(todaysDate.getTime() - articleDate.getTime());
                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if($scope.filterPublicationDate == "date_last_week"){
                    if(diffDays <= 7) 
                        return(true);
                }
                
                if($scope.filterPublicationDate == "date_last_month"){
                    if(diffDays <= 30) 
                        return(true);
                }
                
                if($scope.filterPublicationDate == "date_last_year"){
                    if (diffDays <= 365)
                        return(true);
                }
            });
            
        }
        
        //Filter by Critic's Pick
        //If filterCriticsPick is selected
        if($scope.filterCriticsPick == true) {
            
            //Filter current list of reviews for only Critic's Picks
            $scope.reviewsOnPage = $scope.reviewsOnPage.filter(function(review) {
                return (review.critics_pick == 1);
            });
            
        }
        
        //Filter by title search field
        if($scope.filterTitles !== '') {
            
            //Filter current list of reviews for only Crtic's Picks
            $scope.reviewsOnPage = $scope.reviewsOnPage.filter(function(review){
                
                //Set both the input and individual titles to lowercase to make search case-insensitive
                var filterTitlesLower = $filter('lowercase')($scope.filterTitles);
                var displayTitleLower = $filter('lowercase')(review.display_title);
                
                return (displayTitleLower.includes(filterTitlesLower));
            
            });
        }
        
        //Take the filtered results and display the correct amount of reviews on page
        $scope.limitResults();
    
    }
    
    
    //Function that takes the current list of reviews and limits them to the selected reviews-per-page count
    $scope.limitResults = function() {
        
        //Determine whether "Next" button needs to be disabled
        var temp = $scope.startAt + parseInt($scope.reviewsOnPageCount);
        if(temp >= $scope.reviewsOnPage.length) 
            $scope.nextAvailable = false;
        else
            $scope.nextAvailable = true;
        
        //Determine whether the Previous button needs to be disabled
        if($scope.startAt == 0)
            $scope.prevAvailable = false;
        else
            $scope.prevAvailable = true;
        
        $scope.reviewsOnPage = $filter('limitTo')($scope.reviewsOnPage, $scope.reviewsOnPageCount, $scope.startAt);
    }
    
    $scope.prevPage = function() {

        if($scope.startAt - parseInt($scope.reviewsOnPageCount) <= 0)
            $scope.startAt = 0;
        else
            $scope.startAt -= parseInt($scope.reviewsOnPageCount);
        
        $scope.applyReviewFilters();

        
    }
    
    $scope.nextPage = function() {
        
        $scope.startAt += parseInt($scope.reviewsOnPageCount);

        $scope.applyReviewFilters();
    }
    
});