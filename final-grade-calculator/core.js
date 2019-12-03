/* core.js
 * Functions related directly to grade calculation and conversion
 * (C) 2019 Ryan Zhang. 
  This code is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This code is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this code.  If not, see <https://www.gnu.org/licenses/>.

  Note that this license does NOT apply to the entire site. However, if you're interested in anything on here, contact me at https://ryan778.github.io/about-me/ and we can discuss. 
*/


function convToGrade(letter){
  //Returns number: approximate of letter grade, -1 if unknown
  letter = letter.toLowerCase();
  letter = letter.replace(/ /g, '');
  if(letter.length > 3){return -1}
  let val = letter.charCodeAt(0);
  let grade = -1;
  if(val >= 97 && val <= 100){ //A through D
    grade = 105 - 10*(val-96); //Returns middle of grade (ex. A -> 95)
    let mod = letter.slice(1, 3);
    switch(mod){
      case '+':
        grade += 3;
        break;
      case '-':
        grade -= 3;
        break;
      case '++':
        grade += 5;
        break;
      case '--':
        grade -= 5;
        break;
      case '':
        break;
      default:
        grade = -1; //Unknown grade
    }
  }
  else if(letter === 'f'){
    grade = 50}
  else if(letter === 'f-' || letter === 'f--'){
    grade = 0}
  else if(letter === 's'){grade = 100} //"Satisfactory"
  else if(letter === 'u'){grade = 0} //"Unsatisfactory"
  return grade;
}

function convToLetter(grade){
  // Returns string: letter grade, input number
  if(typeof grade !== 'number'){
    return '??'
  }
  grade = Math.round(grade*100)/100 //Fix floating point rounding errors
  if(grade > 100){return 'A++'}
  else if(grade === 100){return 'A+'}
  else if(grade < 60){
    if(grade < 50){
      return 'F-'}
    return 'F'
  }
  let letter = String.fromCharCode(Math.floor((199.9999-grade)/10)+87).toUpperCase();
  if(grade%10 >= 8){letter += '+'}
  else if(grade%10 < 4){letter += '-'}
  return letter;
}

function handleQueryAction(t, n) {
  //Returns undefined, sends event to ga
  ga('send', 'event', {
    eventCategory: 'Interactive',
    eventAction: 'query',
    eventLabel: 'Final Grade Calculator (Type '+(t)+')',
    eventValue: n
  });
}

/* The "Math" section with lots and lots of somewhat complicated equations that even I barely / kinda understand */
function calcTestDrop(){
  //Requires: testWorth, testAvg, totalTests, lowestTest (from globalData)
  //Returns [before (weighted), weighted, overall] rounded to four decimal places
  let w = globalData.testWorth, a = globalData.testAvg, t = globalData.totalTests, l = globalData.lowestTest, s = globalData.totalTests*globalData.testAvg;
  return [Math.round(10000*a*(w/100))/10000, Math.round((1000000*(s-l)/((t-1)*100))*(w/100))/10000, Math.round(1000000*(s-l)/((t-1)*100))/10000]
}

function calcTargetGradeS(t){ // "simple" target grade - standard settings w/o test adjustments
  let c = globalData.currentGrade, f = globalData.finalWorth, w = globalData.testWorth, a = globalData.testAvg, o = globalData.totalTests, l = globalData.lowestTest;
  return (t-c*(1-(f/100)))/(f/100);
}

function calcTargetTestGrade(t){
  /* t = targetGrade
  @requires currentGrade, targetGrade, testsWorth, either (tests taken + test average) or (points in cat + points test is worth)
  // w(i/j) + d = w((i+s)/(j+k))
  */
  let d = (t - globalData.currentGrade)/100;
  let w = globalData.testWorth/100, a, i, j, k; 
  // a = test average (out of 1.00), i = test category points, j = test category total points, k = points this test is worth
  if(globalData.unequalTests){
    // a = globalData.testCatPts / globalData.testCatTotalPts 
    i = globalData.testCatPts; 
    j = globalData.testCatTotalPts; 
    k = globalData.testWorthPts;
  }
  else{
    // a = globalData.testAvg / 100
    i = globalData.totalTests * (globalData.testAvg / 100); 
    j = globalData.totalTests; 
    k = 1;
  }
  if(j === 0){
    // d = a*s
    return 100*d/a}
  let s = (k*d + j*d)/w + i*k/j; // output
  return 100*(s/k);
}

function calcTargetGrade(t){
  /* t = targetGrade
  @requires currentGrade, finalWorth, testPolicy, testWorth, testAvg, totalTests, lowestTest (from globalData)
  @returns Array [Weighted, Full] - Dynamic is only returned for testPolicy one and two, and is a multiplier of finalScore
  */
  //targetGrade = (finalWorth/100)*result + currentGrade*(1-(finalWorth/100))
  
  if(globalData.gradeType === 1){
    // (cur + req) / (total + worth) = goal
    let w = globalData.finalWorthPts, c = globalData.currentGradePts, tp = globalData.currentGradeTotalPts; 
    let r = ((t/100)*(tp+w) - c);
    $('#res-pts').show(); 
    $('#res-val-pts').text(`${r.toFixed(1)}/${w.toFixed(1)} pts`);
    return 100*r/w;
  }
  else if(globalData.examType === 1){
    return calcTargetTestGrade(t); // test grades are done a bit differently so that's done separately 
  }
  
  let c = globalData.currentGrade, f = globalData.finalWorth, w = globalData.testWorth, a = globalData.testAvg, o = globalData.totalTests, l = globalData.lowestTest, s = globalData.totalTests*globalData.testAvg, res; //s = total test score
  if(globalData.testPolicy !== 0){
    $('#resi').find('b')[0].innerText = (a).toFixed(2);
    $('#resi').find('b')[1].innerText = ((a*(w/100)).toFixed(2));
    $('#resi').find('b')[2].innerText = (w).toFixed(2);
  }
  switch(globalData.testPolicy){
    case 0:
      //result = (targetGrade - currentGrade*(1-(finalWorth/100))) / (finalWorth/100)
      return (t-c*(1-(f/100)))/(f/100);
      break;
    case 1: //Lowest test dropped
      let td = calcTestDrop();
      let diff = td[1] - td[0];
      $('#resi_a').find('b')[0].innerText = (td[2]).toFixed(2);
      $('#resi_a').find('b')[1].innerText = (td[1]).toFixed(2);
      $('#resi_c').find('span')[0].innerText = detPlu(diff);
      $('#resi_c').find('b')[0].innerText = (diff).toFixed(2);
      return ((t - diff)-c*(1-(f/100)))/(f/100);
      break;
    case 2:
      //targetGrade = (finalWorth/100)*result + currentGrade*(1-(finalWorth/100)) + testReplacementDifference
      //targetGrade = (finalWorth/100)*result + currentGrade*(1-(finalWorth/100)) + (testWorth/100)*[ [(avgTestGrade * o_totalTests) + (result - lowestTest)]/(o_totalTests) - (avgTestGrade) ]
      //targetGrade = (currentGrade * totalTests * (finalWorth - 100) + ((lowestTest * testWorth) + 100*totalTests*targetGrade) / (finalGrade*totalTests + testWorth)
      //targetGrade = (F/100) * R + C(1 - (F/100)) + (W/100)*(R-L)/O
      //https://www.wolframalpha.com/input/?i=T+%3D+(F%2F100)*R+%2B+C*(1-(F%2F100))+%2B+(W%2F100)*%5B(R-L)%5D%2FO,+solve+for+R
      res = (c*(f - 100)*o + l*w + 100*o*t)/(f*o + w);
      if(res > calcTargetGradeS(t)){
        $('#res_moreInfo').hide();
        $('#res-warn-grdAdj').show();
        return calcTargetGradeS(t);
      }
      $('#res_moreInfo').show();
      $('#res-warn-grdAdj').hide();
      $('#resi_b').find('b')[0].innerText = (res - l).toFixed(2);
      $('#resi_b').find('b')[1].innerText = ((res - l) / o).toFixed(2);
      $('#resi_c').find('span')[0].innerText = detPlu((w / 100) * (res - l) / o);
      $('#resi_c').find('b')[0].innerText = ((w / 100) * (res - l) / o).toFixed(2);
      return res;
      break;
    case 3:
      //Same as case 2 but with (0.5 * (result - lowestTest)) instead of (result - lowestTest)
      //https://www.wolframalpha.com/input/?i=T+%3D+(F%2F100)*R+%2B+C*(1-(F%2F100))+%2B+(W%2F100)*%5B0.5(R-L)%5D%2FO,+solve+for+R
      res = (2*c*(f - 100)*o + l*w + 200*o*t)/(2*f*o + w);
      console.log(res); console.log(calcTargetGradeS(t));
      if(res > calcTargetGradeS(t)){
        $('#res_moreInfo').hide();
        $('#res-warn-grdAdj').show();
        return calcTargetGradeS(t);
      }
      $('#res_moreInfo').show();
      $('#res-warn-grdAdj').hide();
      $('#resi_b').find('b')[0].innerText = (0.5*(res - l)).toFixed(2);
      $('#resi_b').find('b')[1].innerText = (0.5 * (res - l) / o).toFixed(2);
      $('#resi_c').find('span')[0].innerText = detPlu((w / 100) * 0.5 * (res - l) / o);
      $('#resi_c').find('b')[0].innerText = ((w / 100) * 0.5 *  (res - l) / o).toFixed(2);
      return res;
      break;
  }
}

function calcResultingGrade(score) { 
  // simple resulting grade calculation
  // supports weighted and unweighted, but does NOT account for test adjustments 
  let f = score; 
  let w = globalData.finalWorth, wp = globalData.finalWorthPts, c = globalData.currentGrade, cp = globalData.currentGradePts, ct = globalData.currentGradeTotalPts; 
  return globalData.gradeType?(100 * (cp + (f/100*wp)) / (ct + wp)):(f*(w/100)) + (c*(1-(w/100)))
}