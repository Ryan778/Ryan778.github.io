/* main.js
 * (C) 2018 Ryan Zhang. All Rights Reserved; please contact me if anything interests you though! (let's be honest, that's not going to happen)
 * Functions and scripts specific to FGC (calculations, handlers, etc)
 */

let globalData = {//Contains all information inputted, makes life easier
  gradeType: 0, //0=weighted, 1=unweighted
  testPolicy: 0, //0=none, 1=drop lowest, 2=make up difference, 3=make up half of difference
  calcType: 0, //0=see what you need, 1=already took test, 2=auto detect
  currentGrade: -1,
  finalWorth: -1, //Weight of final (or points)
  targetGrade: -1,
  finalGrade: -1,
  equalTestWeight: 1, //0=no (use totalTestScore), 1=yes (use totalTests)
  testWorth: -1, //Weight of test (or points)
  testAvg: -1, //Average grade across all tests
  totalTests: -1,
  lowestTest: -1 //Lowest test
};

let alertMessages = {
  'weight': `<b>Grade Weighting</b><br>Most colleges and many high school classes use a <b>weighted</b> grading system so that different assignments have different "weights" (e.g. final, tests, and homework). If your grade has any kind of categories, then you have a weighted grading system. <br><br>Some classes give point values to assignments instead, usually with the final being worth a lot more than say, homework. If that's your case, then you have an <b>unweighted</b> grading system.`
}

let testAdjInfo = [`Your lowest test grade will be completely removed.`, `The higher score between your lowest test and your final will replace your lowest test grade.`, `You'll get half the difference (if applicable) between your lowest test grade and the final.`];

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

function validateInput(val, type){
  //Returns object {st: number, val: number, msg: string}; status 0=success, 1=warn, 2=error
  if(typeof val !== 'string'){return {st: 2, msg: `An error occured and it's not your fault (report this as a bug!) - Invalid Data Type (${typeof val})`}}
  switch(type){
    case 'grd': //Grade (Accepts percents and letters)
      if(parseFloat(val).toString() === val || parseFloat(val).toString() === val.slice(0, val.length-1) && val.slice(-1) === '0'){
        if(parseFloat(val) > 150){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather high. Is there a typo?'};
        }
        else if(parseFloat(val) < 15){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather low. Is there a typo?'};
        }
        return {st: 0, val: parseFloat(val)}
      }
      else if(convToGrade(val) !== -1){
        return {st: 0, val: convToGrade(val), msg: `Using ${val.toUpperCase()} as ${convToGrade(val)}%`}
      }
      return {st: 2, msg: `Invalid input (is it a number/letter grade?)`}
      break;
    case 'weight': //Weight value (ex: 20%)
      if(parseFloat(val).toString() === val){
        if(parseFloat(val) > 65){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather high. Is there a typo?'};
        }
        else if(parseFloat(val) < 5){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather low. Is there a typo?'};
        }
        return {st: 0, val: parseFloat(val)}
      }
      return {st: 2, msg: `Invalid input (is it a number?)`}
      break;
    case 'num': //Numerical value (ex: 5)
      if(parseInt(val).toString() === val){
        if(parseInt(val) >= 50){
          return {st: 1, val: parseInt(val), msg: 'This looks rather high. Is there a typo?'};
        }
        else if(parseFloat(val) < 2){
          return {st: 1, val: parseInt(val), msg: 'This looks rather low. Is there a typo?'};
        }
        return {st: 0, val: parseInt(val)}
      }
      return {st: 2, msg: `Invalid input (is it a whole number?)`}
      break;
    case 'sp:testAvg': //Special: Test Average - Treated as a number, but is weighted depending on the value entered
      if(parseFloat(val).toString() === val || parseFloat(val).toString() === val.slice(0, val.length-1) && val.slice(-1) === '0'){
        if(parseFloat(val) > 150){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather high. Is there a typo?'}
        }
        if(globalData.testWorth === -1){
          $('#inp_testAvg').val('');
          return {st: 2, msg: 'Please enter the test weight first!'}
        }
        if(parseFloat(val) >= 70 || parseFloat(val) > globalData.testWorth * 1.1){
          //Use grade as is
          return {st: 0, val: parseFloat(val), msg: `Using ${parseFloat(val)}% as overall test grade (${(parseFloat(val)*globalData.testWorth/100).toFixed(2)}% weighted)`}
        }
        else{
          //Use grade as weighted to test percentage
          return {st: 0, val: (10000*parseFloat(val)/globalData.testWorth)/100, msg: `Using ${parseFloat(val)}% weighted as ${(100*parseFloat(val)/globalData.testWorth).toFixed(2)}% overall`}
        }
      }
      else if(convToGrade(val) !== -1){
        return {st: 0, val: convToGrade(val), msg: `Using ${convToGrade(val)}% as overall test grade (${(parseFloat(val)*globalData.testWorth/100).toFixed(2)}% weighted)`}
      }
      return {st: 2, msg: `Invalid input (is it a number/letter grade?)`}
      break;
    default:
      return {st: 2, msg: `An error occured and it's not your fault (report this as a bug!) - <type> inputted is invalid (${type})`}
  }
}

function setBorderClass(ele, color){
  //Usage: Remove existing border color to an input field and replace it with another class (input "red", "org", "gr", -1, 0, 1, or 2)
  if(color === 0){color = 'gr'}
  else if(color === 1){color = 'org'}
  else if(color === 2){color = 'red'}
  $(ele).removeClass('red-b org-b gr-b');
  if(color === -1){return;}
  $(ele).addClass(color+'-b');
}

/*function showErrorMsg(prop, msg){
  //Usage: Show an error message

}*/

function setStatusText(eleIn, id, msg){
  //id: -1=clear, 0=green, 1=orange, 2=red
  //eleIn is the input box, and not the input-status box
  //msg is optional
  let ele = $(eleIn).parent().find('.input-status');
  ele.removeClass('red org gr');
  ele.children('span').text(msg);
  if(!msg){ele.children('span').text('');}
  switch(id){
    case 2:
      ele.addClass('red');
      ele.children('i').text('error');
      break;
    case 1:
      ele.addClass('org');
      ele.children('i').text('warning');
      break;
    case 0:
      ele.addClass('gr');
      ele.children('i').text('check');
      if(msg){$(eleIn).parent().find('.percSign').text('')}
      else{$(eleIn).parent().find('.percSign').text('%')}
      break;
    default:
    case -1:
      $(eleIn).parent().find('.percSign').text('%')
      ele.children('i').text('');
      break;
  }
}

function calcTestMod(){
  // Uses under {globalData}:
  // equalTestWeight = 0: totalTestScore, testAvg, lowestTestGrade
  // equalTestWeight = 1: testWorth, totalTests, testAvg, lowestTestGrade
}

function detPlu(n){
  // Returns "an" for 8X, returns "a" for any other number
  if(n >= 80 && n < 90){
    return 'an'
  }
  return 'a'
}

function validateInputs(vars){
  // Checks [array] and makes sure all elements in [array] are valid, returns an error otherwise
  // Only works with input fields (ex. not select fields)
  let valid = true;
  let possibleTypo = false;
  vars.forEach((ele => {
    if(globalData[ele] === -1){
      if(!$('#inp_'+ele).hasClass('red-b')){
        setBorderClass('#inp_'+ele, 'red')
        setStatusText('#inp_'+ele, 2, `This can't be empty.`);
      }
      valid = false;
    }
    else if ($('#inp_'+ele).hasClass('org-b')){
      possibleTypo = true}
  }));
  if(possibleTypo && valid){return 2}
  return valid;
}

function getSubtitle(grade){
  if (grade > 100){
    return 'Maybe there\'s extra credit? Or you can lower your expectations slightly?'}
  else if(grade >= 95){
    return "Looks like it might be a bit challenging, but you got this!"}
  else if(grade >= 90){
    return "Don't worry too much, you'll do great!"}
  else if(grade >= 80){
    return "Looks like it shouldn't be too bad!"}
  else if(grade >= 70){
    return "Maybe study just a little bit...?"}
  else if(grade >= 60) {
    return "Looks like you'll have no trouble reaching your goal!"}
  else if(grade >= 0){
    return "Maybe you could raise your expectations a little?"}
  else{
    return "Looks like you don't even have to show up!"}
}

/* The "Math" section with lots and lots of somewhat complicated equations that even I barely / kinda understand */
function calcTestDrop(){
  //Requires: testWorth, testAvg, totalTests, lowestTest (from globalData)
  //Returns [before (weighted), weighted, overall] rounded to four decimal places
  let w = globalData.testWorth, a = globalData.testAvg, t = globalData.totalTests, l = globalData.lowestTest, s = globalData.totalTests*globalData.testAvg;
  return [Math.round(10000*a*(w/100))/10000, Math.round((1000000*(s-l)/((t-1)*100))*(w/100))/10000, Math.round(1000000*(s-l)/((t-1)*100))/10000]
}

function calcTargetGradeS(t){
  let c = globalData.currentGrade, f = globalData.finalWorth, w = globalData.testWorth, a = globalData.testAvg, o = globalData.totalTests, l = globalData.lowestTest;
  return (t-c*(1-(f/100)))/(f/100);
}

function calcTargetGrade(t){
  /* t = targetGrade
  Requires: currentGrade, finalWorth, testPolicy, testWorth, testAvg, totalTests, lowestTest (from globalData)
  Returns: Array [Weighted, Full] - Dynamic is only returned for testPolicy one and two, and is a multiplier of finalScore
  */
  //targetGrade = (finalWorth/100)*result + currentGrade*(1-(finalWorth/100))
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
/* End of "Math" section */

function processCalculations(){
  $('.calcRes').hide();
  $('.p-res').hide();
  $('#res_moreInfo').hide();
  $('#res_warn-grdAdj').hide();
  $('#res-warn').hide();
  let t = globalData.targetGrade, w = globalData.finalWorth, c = globalData.currentGrade, f = globalData.finalGrade, r, vald;
  if(globalData.testPolicy !== 0){
    let valdArray = ['testWorth', 'totalTests', 'lowestTest'];
    if(globalData.testPolicy === 1){valdArray.push('testAvg')}
    vald = validateInputs(valdArray);
    if(!vald){
        $('#calcErr').show();
        return}
  }
  if(globalData.testPolicy > 0){
    if(globalData.testPolicy === 1){
      $('#resi').show();
      $('#resi_a').show()}
    else{
      $('#resi_b').show()}
    $('#res_moreInfo').show();
  }
  switch(globalData.calcType){
    case 0:
      //targetGrade = (finalWorth/100)*whatYouNeed + currentGrade*(1-(finalWorth/100))
      //whatYouNeed = (targetGrade - currentGrade*(1-(finalWorth/100))) / (finalWorth/100)
      vald = validateInputs(['targetGrade', 'finalWorth', 'currentGrade']);
      if(!vald){
        $('#calcErr').show();
        return}
      r = calcTargetGrade(t);
      //r = (t-c*(1-(w/100)))/(w/100); //Algebraic manipulation
      $('#res-0').show();
      $('#res-an-0').text(detPlu(r));
      $('#res-val-0').text(`${r.toFixed(2)}% (${convToLetter(r)})`);
      $('#res-an-0b').text(detPlu(t));
      $('#res-val-0b').text(`${t.toFixed(2)}% (${convToLetter(t)})`);
      $('#res_sub').text(getSubtitle(Math.floor(r)));
      if(vald === 2){$('#res-warn').show()}
      break;
    case 1:
      //finalGrade = (finalWorth/100)*finalExamGrade + currentGrade*(1-(finalWorth/100))
      vald = validateInputs(['finalWorth', 'finalGrade', 'currentGrade']);
      if(!vald){
        $('#calcErr').show();
        return}
      r = (f*(w/100)) + (c*(1-(w/100)));
      if(globalData.testPolicy > 0){
        let endDiff = 0;
        switch(globalData.testPolicy){
          case 1:
            endDiff = calcTestDrop()[1] - calcTestDrop()[0];
            break;
          case 2:
            endDiff = ((globalData.testWorth/100)*(globalData.finalGrade - globalData.lowestTest)/globalData.totalTests);
            break;
          case 3:
            endDiff = ((globalData.testWorth/100)*0.5*(globalData.finalGrade - globalData.lowestTest)/globalData.totalTests);
            break;
        }
        if (endDiff > 0) {
          r += endDiff;
          $('#res-finalGrade-testAdj').find('b').text(endDiff.toFixed(2));
          $('#res-finalGrade-testAdj').show()}
        else{
          $('#res-finalGrade-noTestAdj').show()}
      };
      $('#res-1').show();
      $('#res-an-1').text(detPlu(r));
      $('#res-val-1').text(`${r.toFixed(2)}% (${convToLetter(r)})`);
      break;
    case 2:
      //whatYouNeed same as case 0, except used multiple times for various targetGrade to find the best one
      vald = validateInputs(['finalWorth', 'currentGrade']);
      if(!vald){
        $('#calcErr').show();
        return}
      let upper = Math.ceil(c/10)*10, lower = Math.floor(c/10)*10;
      let r1 = calcTargetGrade(upper);
      let r2 = calcTargetGrade(lower);
      //let r1 = (upper-c*(1-(w/100)))/(w/100); //Upper target
      //let r2 = (lower-c*(1-(w/100)))/(w/100); //Lower target
      let r3 = (w) + (c*(1-(w/100))); //Final grade w/ 100%
      if(upper == 100 || r1 > 100){ //Show info to keep current grade (if upper is not achievable or grade is already an A)
        calcTargetGrade(upper); //Calling this updates [More Info] section if necessary
        $('#res-0').show();
        $('#res-an-0').text(detPlu(r2));
        $('#res-val-0').text(`${r2.toFixed(2)}% (${convToLetter(r2)})`);
        $('#res-an-0b').text(detPlu(lower));
        $('#res-val-0b').text(`${lower.toFixed(2)}% (${convToLetter(lower)})`);
        $('#res_sub').text(getSubtitle(Math.floor(r2)));
      }
      if(r1 > 100){ //Upper grade is not achievable
        $('#res-1s').show();
        $('#res-an-1s').text(detPlu(r3));
        $('#res-val-1s').text(`${r3.toFixed(2)}% (${convToLetter(r3)})`);
        $('#res_sub').text('Maybe you can get extra credit somewhere to bump it up?');
      }
      else{ //Upper grade is achievable
        calcTargetGrade(upper); //Calling this updates [More Info] section if necessary
        $('#res-0').show();
        $('#res-an-0').text(detPlu(r1));
        $('#res-val-0').text(`${r1.toFixed(2)}% (${convToLetter(r1)})`);
        $('#res-an-0b').text(detPlu(upper));
        $('#res-val-0b').text(`${upper.toFixed(2)}% (${convToLetter(upper)})`);
        $('#res-0s').show();
        $('#res-an-0s').text(detPlu(r2));
        $('#res-val-0s').text(`${r2.toFixed(2)}% (${convToLetter(r2)})`);
        $('#res_sub').text(getSubtitle(Math.floor(r1)));
      }
      break;
    default:
      alert(`An error occured. \nPlease report this bug!\nError: invalid calcType (${globalData.calcType})`)
  }
  $('#calcRes').show();
}

function registerHandlers(){
  $('#calc').find('button').each((n, ele) => {
    if($(ele).hasClass('btn-opt')){
      $(ele).click(() => {
        alertify.alert(`<b>Feature In Progress</b><br>Unweighted grades are still being worked on and aren't ready yet. Check back in a few days!`)
      });
    }
    else if(ele.id === 'calcBtn'){
      $(ele).click(() => {
        processCalculations();
        if(window.innerWidth < 720) {
          zenscroll.to(calcBtn, 500);
        }
      });
    }
  });
  $('#calc').find('input').each((n, ele) => {
    if($(ele).data('vald') === 'grd'){ele.maxLength = 8}
    if($(ele).data('vald') === 'weight'){ele.maxLength = 6}
    $(ele).prop('id', 'inp_'+ele.dataset.for);
    $(ele).change(() => {
      let val = ele.value;
      if(val === '' || val === ' '){
        setBorderClass(ele, -1);
        setStatusText(ele, -1, '');
        globalData[$(ele).data('for')] = -1;
        if(ele.dataset.for === 'testWorth'){
          if($('#inp_testAvg').val() !== ''){
            $('#inp_testAvg').change();
          }
        }
        return}
      let vald = validateInput(val, ele.dataset.vald);
      setBorderClass(ele, vald.st);
      setStatusText(ele, vald.st, vald.msg);
      if(vald.st !== 2){//Input is valid
        globalData[$(ele).data('for')] = vald.val
        if(ele.dataset.for === 'testWorth'){
          if($('#inp_testAvg').val() !== ''){
            $('#inp_testAvg').change();
          }
        }
      }
    });
    $(ele).on('input', () => {
      if($(ele).hasClass('red-b')){
        setBorderClass(ele, -1);
        setStatusText(ele, -1);
      }
    })
  });
  $('#calc').find('select').each((n, ele) => {
    $(ele).change(() => {
      let val = ele.value;
      if(ele.dataset.for==='calcType'){
        $('#info_opt2').hide()
        $('#opt_targetGrade').hide();
        $('#opt_finalGrade').hide();
        switch(ele.value){
          case '0':
          default:
            $('#opt_targetGrade').show();
            break;
          case '1':
            $('#opt_finalGrade').show();
            break;
          case '2':
            $('#info_opt2').show()
            break;
          case '3':
            ele.value = '2';
            $('#info_opt2').show()
            alertify.alert(`<b>Feature Not Supported</b><br>Sorry, this feature is not available yet. Come back again in a few weeks!`)
            break;
        }
      }
      else if(ele.dataset.for==='testPolicy'){
        $('.p_testAdj').hide();
        switch(ele.value){
          case '0':
          default: //Hide everything
            break;
          case '1': //Lowest test dropped
          case '2': //Difference between lowest and final grade
          case '3': //Half of difference between lowest and final grade
            $('.p_testAdj').show(); //All fields can be used for everything
            $('#sp_testAdjInfo').text(testAdjInfo[parseInt(ele.value)-1]);
            if(ele.value !== '1'){
              $('#p_testAvgInfo').hide();
              $('#opt_testAvg').hide()}
            else{
              $('#p_testAvgInfo').show();
              $('#opt_testAvg').show()}
            break;
        }
      }
      if(!isNaN(parseInt(val))){val = parseInt(val)}
      globalData[$(ele).data('for')] = val;
      setBorderClass(ele, 'gr');
      setTimeout(function(){
        setBorderClass(ele, -1);
      }, 1000);
    });
  });
  $('#calc').find('.infoLink').each((n, ele) => {
    $(ele).click(() => {
      alertify.alert(alertMessages[ele.dataset.alertmsg])
    });
  });
  $('#res_moreInfo').click(() => {
    if(!$('#calcRes_moreInfo').is(':visible')){
      $('#calcRes_moreInfo').show();
    }
    else{
      $('#calcRes_moreInfo').hide();
    }
  });
}

$(document).ready(function () {
  'use strict';
  let h = location.hostname;
  if(['127.0.0.1', '67.173.228.237', 'ryan778.github.io', 'ryan778.herokuapp.com', 'ryan778.azurewebsites.net'].indexOf(h) === -1){
    $('#calc-load').html(`<i class='material-icons'>error</i> <b>Non-Whitelisted Domain</b><br>It looks like you're opening this page somewhere it's not supposed to be.<br>Make sure that you're on <a href='https://ryan778.github.io/final-grade-calculator/'>the official website</a>, and if this error persists, <a href='https://bit.ly/fgc-feedback'>contact us here</a>.`);
    return;
  }
  registerHandlers();
  $('.p_testAdj').hide();
  $('#calc-load').hide();
  $('#calc-inner').show();
});
