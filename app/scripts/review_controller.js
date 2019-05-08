movieReviewsTestApp.controller('review', function($scope, $log, selectedReview) {
   
    //Set scope values to display in view using the selectedReview service
    $scope.selectedReviewTitle = selectedReview.title;
    $scope.selectedReviewImageUrl = selectedReview.imageUrl;
    $scope.selectedReviewRating = selectedReview.rating;
    $scope.selectedReviewCriticsPick = selectedReview.criticsPick;
    $scope.selectedReviewHeadline = selectedReview.headline;
    $scope.selectedReviewSummary = selectedReview.summary;
    $scope.selectedReviewCriticName = selectedReview.criticName;
    $scope.selectedReviewArticleUrl = selectedReview.articleUrl;
    
});