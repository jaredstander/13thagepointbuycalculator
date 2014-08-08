app.controller('MainController', function($scope) {
  $scope.pointsLeft = 28;
  $scope.abilityLabels = new Array("STR: ", "DEX: ", "CON: ", "INT: ", "WIS: ", "CHA: ");
  $scope.modLabel = " | Mod: "
  $scope.pointBuyScore = new Array(8, 8, 8, 8, 8, 8);
  $scope.raceOrClassBonus = new Array(0, 0, 0, 0, 0, 0);
  $scope.abilityMod = new Array(-1, -1, -1, -1, -1, -1);

  $scope.getAbilityMod = function(abilityScore){ return parseInt(Math.floor((abilityScore / 2) - 5)) };

  $scope.getPointValue = function(abilityScore){
    // return (parseInt(abilityScore) - 8) Does not work starting at 15, will investigate another formula
    // And in the mean time, I shall use literally the worst method available.
    switch(abilityScore) {
      case 8:
        return 0;
        break;
      case 9:
        return 1;
        break;
      case 10:
        return 2;
        break;
      case 11:
        return 3;
        break;
      case 12:
        return 4;
        break;
      case 13:
        return 5;
        break;
      case 14:
        return 6;
        break;
      case 15:
        return 8;
        break;
      case 16:
        return 10;
        break;
      case 17:
        return 13;
        break;
      case 18:
        return 16;
        break;
    }
  };

  $scope.incrementScore = function(attribute, index){
    var abilityScore = parseInt(attribute);
    if(attribute < 18) {
      var pointDifference = parseInt($scope.getPointValue(abilityScore + 1) - $scope.getPointValue(abilityScore));
      if($scope.pointsLeft >= pointDifference) {
        $scope.pointBuyScore[index] = $scope.pointBuyScore[index] + 1;
        $scope.abilityMod[index] = parseInt($scope.getAbilityMod($scope.pointBuyScore[index] + $scope.raceOrClassBonus[index]));
        $scope.pointsLeft = $scope.pointsLeft - pointDifference;
      }
    }
  };

  $scope.decrementScore = function(attribute, index){
    var abilityScore = parseInt(attribute);
    if(abilityScore > 8) {
      var pointDifference = parseInt($scope.getPointValue(abilityScore) - $scope.getPointValue(abilityScore - 1));
      $scope.pointBuyScore[index] = $scope.pointBuyScore[index] - 1;
      $scope.abilityMod[index] = $scope.getAbilityMod($scope.pointBuyScore[index] + $scope.raceOrClassBonus[index]);
      $scope.pointsLeft = $scope.pointsLeft + pointDifference;
    }
  };
});