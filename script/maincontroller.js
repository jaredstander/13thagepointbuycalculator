app.controller('MainController', function($scope) {
  // Variables we'll need.
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

  // Calculates the ability mod provided by a specific score.
  $scope.getAbilityMod = function(abilityScore){ return parseInt(Math.floor((abilityScore / 2) - 5)); };

  /* Updates the ability mod on the page using all contributing factors; the raw ability score, the race bonus,
     and the class bonus. In this way we can call one single function when spending points, selecting a
     racial bonus, or selecting a class bonus instead of having 3 functions to do it for each, or hard-coding
     this function into the increment, decrement, and bonus seletion functions. What a waste of code that would
     be. This also helps avoid innaccurate mod scores because we 'left out' one of the contributing factors
     when making an update. */
  $scope.setAbilityMod = function(index){ $scope.abilityMod[index] = parseInt($scope.getAbilityMod($scope.pointBuyScore[index] + $scope.racialBonus[index] + $scope.classBonus[index])); };

  $scope.getPointValue = function(abilityScore){
    /* "return (parseInt(abilityScore) - 8)" Does not work when calculating the point costs for a stat increase
       starting when an ability score is 15 or higher. I will investigate another formula and in the mean time,
       I shall use literally the worst method available. Simple select case that takes the desired score as input
       and returns the associated cost based on that input. */
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
    // Determine what ability score we're increasing.
    var abilityScore = parseInt(attribute);
    // Only do something if the score is less than 18, because that's as high as you can buy with points.
    if(attribute < 18) {
      // How many points will it cost to go from X to Y?
      var pointDifference = parseInt($scope.getPointValue(abilityScore + 1) - $scope.getPointValue(abilityScore));
      // Using the value from the last step, verify there are enough points left to increase the abilty score.
      if($scope.pointsLeft >= pointDifference) {
        /* If so, increase the ability score by 1, update the abilty mod to reflect any changes,
           and subtract the points spent from the remaining points you have to spend. */
        $scope.pointBuyScore[index] = $scope.pointBuyScore[index] + 1;
        $scope.setAbilityMod(index);
        $scope.pointsLeft = $scope.pointsLeft - pointDifference;
      }
    }
  };

  /* Similar to above. Make sure the stat isn't being dumped below what is allowed by 13th Age rules (min 8),
     and if not, decrease the ability score, update the ability mod if applicable, and refund the point it
     required to buy that stat in the first place. */
  $scope.decrementScore = function(attribute, index){
    var abilityScore = parseInt(attribute);
    if(abilityScore > 8) {
      var pointDifference = parseInt($scope.getPointValue(abilityScore) - $scope.getPointValue(abilityScore - 1));
      $scope.pointBuyScore[index] = $scope.pointBuyScore[index] - 1;
      $scope.setAbilityMod(index);
      $scope.pointsLeft = $scope.pointsLeft + pointDifference;
    }
  };

  /* Race and class bonus cannot be the same.
     Therefore, we remove the ability from the opposite list of options when one is selected.
     Likewise, restore abilities that are deselected by the mechanic of choosing a new one. */
  $scope.selectRacialBonus = function(attribute, optionId){
    /* There are 6 stats plus a 7th "None" placeholder. If the other dropdown has less 7,
       that means one has been selected already. Execute the following code to find out
       whihc one is missing so we can put that stat back into the hash before removing the new choice.*/
    if($scope.classStats.length < 7){
      /* Cycle through all the stats in the OPPOSITE dropdown list. That is, we are removing the stat we selected
         in the RACIAL BONUS dropdown FROM the CLASS BONUS dropdown. */
      for (var i = 0; i < 7; i++){
        /* Preface: In order to determine which stat is missing from the hash of stats, we compare i to the ID value
           of each record in the hash. -1 is "None" so that the IDs of all the stats match perfectly to the arrays of
           stat scores and such that don't contain a placeholder. For example:

            The Array Racial bonus for strength is at $scope.racialBonus[0]
            The ID of the strength record in our hash is 0.
            So the hash record ID == the array index for the strength.

           So, if the ID isn't present in the hash at all OR if we find a point where the hash record's ID at index i
           doesn't match value of i - 1 (remember the IDs in the hash records starts at -1, not 0) we take the stat
           which corresponds to that index in the stat array and we add it back into the other dropdown list
           since that stat has changed and is back on the table. 

           Addendum. About that first if condition... Because of the way we do this, Chrisma can
           be missed by the second if condition that comes after the or. See, we can always count on anything
           before that to be caught, because there will always be an index in the hash that won't match.
           What it's the last item though, and you try to find the ID of the hash record at that index, it won't
           return a record at all. The hash goes from having indexes 0-6 to 0-5. So indexes 0-5 will return true,
           but when it gets to 6, it will not return a boolean value since requesting $scope.classStats[6].id
           basically returns nothing for the operator to compare. But then 6 will be completely missing from the
           hash as an index. So if it gets all the way to 5 and everything matches, instead of trying to do this
           failing comparison that worked before, we ask, does this index even exist in this hash? if the answer is
           no, then the LAST stat is the one missing, charisma. */
        if(!(i in $scope.classStats) || $scope.classStats[i].id != (i - 1)) {
          $scope.classStats.splice(i, 0, {id: (i - 1), label: $scope.statLabels[i - 1], value: 2});
        }
      }
    }
    
    if(attribute !== "None") {
      /* Remove that stat from the arrow of choices for the OTHER dropdown list.
         This is what prevent people from selecting the same stat for both dropdowns.
         Obviously, if they ARE selecting "None" though, we don't want to remove any choice,
         since everything is still on the table.*/
      $scope.classStats.splice(optionId + 1, 1);
    }

    if($scope.racialBonus.indexOf(2) >= 0) {
      /* We basically check the array of racial bonus scores to see what stat already had a bonus.
         If so, we need to reset that before applying the new bonus or else the bonuses will just keep
         stacking instead of replacing.

         UPDATE: So, previously, I did not recalculate the ability mod after we remove the previous bonus.
         Lines 167 and 169 fix this bug. */
      previousBonusIndex = $scope.racialBonus.indexOf(2);
      $scope.racialBonus[previousBonusIndex] = 0;
      $scope.setAbilityMod(previousBonusIndex);
    }
    
    /* Update the racial bonus score using the value property of . The optionId is the value we get from
       the front end, so we can look though our array first without being worried about losing our
       place so to speak. */
    $scope.racialBonus[optionId] = $scope.racialAbilityScoreSelected.value;
    
    // Now that the appropriate score has been updated, go ahead and updated the ability mod on the front end.
    $scope.setAbilityMod(optionId);
  };

  $scope.selectClassBonus = function(attribute, optionId){
    if($scope.racialStats.length < 7){
      for (var i = 0; i < 7; i++){
        if(!(i in $scope.racialStats) || $scope.racialStats[i].id != (i - 1)) {
          $scope.racialStats.splice(i, 0, {id: (i - 1), label: $scope.statLabels[i - 1], value: 2});
        }
      }
    }
    if(attribute !== "None") {
      $scope.racialStats.splice(optionId + 1, 1);
    }
    
    if($scope.classBonus.indexOf(2) >= 0) {
      previousBonusIndex = $scope.classBonus.indexOf(2);
      $scope.classBonus[$scope.classBonus.indexOf(2)] = 0;
      $scope.setAbilityMod(previousBonusIndex);
    }
    
    $scope.classBonus[optionId] = $scope.classAbilityScoreSelected.value;
    $scope.setAbilityMod(optionId);
  };
});