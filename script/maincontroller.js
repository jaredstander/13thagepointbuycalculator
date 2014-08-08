app.controller('MainController', function($scope) {
  $scope.pointsLeft = 28;
  $scope.abilityLabels = new Array("STR: ", "DEX: ", "CON: ", "INT: ", "WIS: ", "CHA: ");
  $scope.modLabel = " | Mod: "
  $scope.pointBuyScore = new Array(8, 8, 8, 8, 8, 8);
  $scope.racialBonus = new Array(0, 0, 0, 0, 0, 0);
  $scope.classBonus = new Array(0, 0, 0, 0, 0, 0);
  $scope.abilityMod = new Array(-1, -1, -1, -1, -1, -1);
  $scope.racialStats = [
                        {id: -1, label: "None"},
                        {id: 0, label: "Strength"},
                        {id: 1, label: "Dexterity"},
                        {id: 2, label: "Constitution"},
                        {id: 3, label: "Intelligence"},
                        {id: 4, label: "Wisdom"},
                        {id: 5, label: "Charisma"}];
  $scope.classStats = [
                        {id: -1, label: "None"},
                        {id: 0, label: "Strength"},
                        {id: 1, label: "Dexterity"},
                        {id: 2, label: "Constitution"},
                        {id: 3, label: "Intelligence"},
                        {id: 4, label: "Wisdom"},
                        {id: 5, label: "Charisma"}];
  $scope.racialAbilityScoreSelected = $scope.racialStats[0];
  $scope.classAbilityScoreSelected = $scope.classStats[0];

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

  $scope.setAbilityMod = function(index){ $scope.abilityMod[index] = parseInt($scope.getAbilityMod($scope.pointBuyScore[index] + $scope.racialBonus[index] + $scope.classBonus[index]))};

  $scope.updateAbilityMods = function(){
    for (var i = 0; i < 6; i++){
      $scope.abilityMod[i] = parseInt($scope.getAbilityMod($scope.pointBuyScore[i] + $scope.racialBonus[i] + $scope.classBonus[i]));
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

  $scope.selectRaceBonus = function(attribute, optionIndex){
    if(attribute != "None"){
      // remove all racial bonuses for all attributes
      for (var i = 0; i < 6; i++){
        $scope.racialBonus[i] = 0;
      }
      // add new racial bonus
      $scope.racialBonus[optionIndex] = 2;
      $scope.updateAbilityMods();
      // search the classBonus array for a missing attribute
      for (var i = 0; i < 7; i++){
        if(!(i in $scope.classStats) || $scope.classStats[i].id != (i - 1)){
          // insert the missing attribute into the options array once found
          $scope.classStats.splice(i, 0, {id: (i - 1), label: $scope.getAttributeById(i - 1)});
        }
      }
      // remove the now racially-selected stat from the class options array
      // we have to do this AFTER inserting the missing one because when the...
      // ...options array is complete we know with certainty what stats are at which position.
      $scope.classStats.splice(optionIndex + 1, 1);
    } else if(attribute == "None"){
      // remove all racial bonuses for all attributes
      for (var i = 0; i < 6; i++){
        $scope.racialBonus[i] = 0;
      }
      $scope.updateAbilityMods();
      // search the classBonus array for a missing attribute
      for (var i = 0; i < 7; i++){
        if(!(i in $scope.classStats) || $scope.classStats[i].id != (i - 1)){
          // insert the missing attribute into the options array once found
          // we are not removing an attribute options since the user has selected no racial bonus
          $scope.classStats.splice(i, 0, {id: (i - 1), label: $scope.getAttributeById(i - 1)});
        }
      }
    }
  };

  $scope.selectClassBonus = function(attribute, optionIndex){
    if(attribute != "None"){
      // remove all class bonuses for all attributes
      for (var i = 0; i < 6; i++){
        $scope.classBonus[i] = 0;
      }
      // add new class bonus
      $scope.classBonus[optionIndex] = 2;
      $scope.updateAbilityMods();
      // search the racialBonus array for a missing attribute
      for (var i = 0; i < 7; i++){
        if(!(i in $scope.racialStats) || $scope.racialStats[i].id != (i - 1)){
          // insert the missing attribute into the options array once found
          $scope.racialStats.splice(i, 0, {id: (i - 1), label: $scope.getAttributeById(i - 1)});
        }
      }
      // remove the now class-selected stat from the racial options array
      // we have to do this AFTER inserting the missing one because when the...
      // ...options array is complete we know with certainty what stats are at which position.
      $scope.racialStats.splice(optionIndex + 1, 1);
    } else if(attribute == "None"){
      // remove all class bonuses for all attributes
      for (var i = 0; i < 6; i++){
        $scope.racialBonus[i] = 0;
      }
      $scope.updateAbilityMods();
      // search the racialBonus array for a missing attribute
      for (var i = 0; i < 7; i++){
        if(!(i in $scope.racialStats) || $scope.racialStats[i].id != (i - 1)){
          // insert the missing attribute into the options array once found
          // we are not removing an attribute options since the user has selected no class bonus
          $scope.racialStats.splice(i, 0, {id: (i - 1), label: $scope.getAttributeById(i - 1)});
        }
      }
    }
  };

  $scope.getAttributeById = function(id){
    switch(id){
      case -1:
        return "None";
        break;
      case 0:
        return "Strength";
        break;
      case 1:
        return "Dexterity";
        break;
      case 2:
        return "Constitution";
        break;
      case 3:
        return "Intelligence";
        break;
      case 4:
        return "Wisdom";
        break;
      case 5:
        return "Charisma";
        break;
    }
  };
});