app.controller('MainController', function($scope) {
  $scope.pointsLeft = 28;
  $scope.abilityLabels = new Array("STR: ", "DEX: ", "CON: ", "INT: ", "WIS: ", "CHA: ");
  $scope.modLabel = " Mod: "
  $scope.pointBuyScore = new Array(8, 8, 8, 8, 8, 8);
  $scope.racialBonus = new Array(0, 0, 0, 0, 0, 0);
  $scope.classBonus = new Array(0, 0, 0, 0, 0, 0);
  $scope.abilityMod = new Array(-1, -1, -1, -1, -1, -1);
  $scope.statLabels = new Array("Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma");
  $scope.racialStats = [{id: -1, label: "None", value: 0},
                        {id: 0, label: "Strength", value: 2},
                        {id: 1, label: "Dexterity", value: 2},
                        {id: 2, label: "Constitution", value: 2},
                        {id: 3, label: "Intelligence", value: 2},
                        {id: 4, label: "Wisdom", value: 2},
                        {id: 5, label: "Charisma", value: 2}];
  $scope.classStats = [ {id: -1, label: "None", value: 0},
                        {id: 0, label: "Strength", value: 2},
                        {id: 1, label: "Dexterity", value: 2},
                        {id: 2, label: "Constitution", value: 2},
                        {id: 3, label: "Intelligence", value: 2},
                        {id: 4, label: "Wisdom", value: 2},
                        {id: 5, label: "Charisma", value: 2}];
  $scope.racialAbilityScoreSelected = $scope.racialStats[0];
  $scope.classAbilityScoreSelected = $scope.classStats[0];

  $scope.getAbilityMod = function(abilityScore){ return parseInt(Math.floor((abilityScore / 2) - 5)) };
  $scope.setAbilityMod = function(index){ $scope.abilityMod[index] = parseInt($scope.getAbilityMod($scope.pointBuyScore[index] + $scope.racialBonus[index] + $scope.classBonus[index]))};

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
        $scope.setAbilityMod(index);
        $scope.pointsLeft = $scope.pointsLeft - pointDifference;
      }
    }
  };

  $scope.decrementScore = function(attribute, index){
    var abilityScore = parseInt(attribute);
    if(abilityScore > 8) {
      var pointDifference = parseInt($scope.getPointValue(abilityScore) - $scope.getPointValue(abilityScore - 1));
      $scope.pointBuyScore[index] = $scope.pointBuyScore[index] - 1;
      $scope.setAbilityMod(index);
      $scope.pointsLeft = $scope.pointsLeft + pointDifference;
    }
  };

  // Race and class bonus cannot be the same.
  // Therefore, we remove the ability from the opposite list of options.
  // Likewise, restore abilities that are deselected by the mechanic of choosing a new one.
  $scope.selectRacialBonus = function(attribute, optionId){
    if($scope.classStats.length < 7){
      for (var i = 0; i < 7; i++){
        if(!(i in $scope.classStats) || $scope.classStats[i].id != (i - 1)){$scope.classStats.splice(i, 0, {id: (i - 1), label: $scope.statLabels[i - 1], value: 2});      }
      }
    }
    if(attribute !== "None"){$scope.classStats.splice(optionId + 1, 1);}
    if($scope.racialBonus.indexOf(2) >= 0){$scope.racialBonus[$scope.racialBonus.indexOf(2)] = 0}
    $scope.racialBonus[optionId] = $scope.racialAbilityScoreSelected.value;
    $scope.setAbilityMod(optionId);
  };

  $scope.selectClassBonus = function(attribute, optionId){
    if($scope.racialStats.length < 7){
      for (var i = 0; i < 7; i++){
        if(!(i in $scope.racialStats) || $scope.racialStats[i].id != (i - 1)){$scope.racialStats.splice(i, 0, {id: (i - 1), label: $scope.statLabels[i - 1], value: 2});      }
      }
    }
    if(attribute !== "None"){$scope.racialStats.splice(optionId + 1, 1);}
    if($scope.classBonus.indexOf(2) >= 0){$scope.classBonus[$scope.classBonus.indexOf(2)] = 0}
    $scope.classBonus[optionId] = $scope.classAbilityScoreSelected.value;
    $scope.setAbilityMod(optionId);
  };
});