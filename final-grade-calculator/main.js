/* main.js
 * Functions and scripts specific to FGC page (rendering, handlers, etc)
 * (C) 2019 Ryan Zhang. All Rights Reserved. 
 * Interested in anything on here? Contact me at https://ryan778.github.io/about-me/ and we can discuss. 
 */

let globalData = {// Contains all information inputted, makes life easier
  gradeType: 0, // 0=weighted, 1=unweighted
  examType: 0, // 0=final, 1=test
  unequalTests: 0, // whether tests are weighted equally or not
  testPolicy: 0, // 0=none, 1=drop lowest, 2=make up difference, 3=make up half of difference
  calcType: 0, // 0=see what you need, 1=already took test, 2=auto detect
  currentGrade: -1,
  currentGradePts: -1, // for unweighted
  currentGradeTotalPts: -1, // also for unweighted
  finalWorth: -1, // weight of final (weighted)
  finalWorthPts: -1, // weight of final (unweighted)
  targetGrade: -1,
  finalGrade: -1,
  equalTestWeight: 1, // 0=no (use totalTestScore), 1=yes (use totalTests)
  testWorth: -1, // weight of test (or points)
  testAvg: -1, // average grade across all tests
  totalTests: -1,
  testCatPts: -1, 
  testCatTotalPts: -1, 
  lowestTest: -1, // lowest test
  curvePolicy: 0, // 0=none, 1=to highest test, 2=square root, 3=nth root
  curveTo: -1, // highest score (assuming scores curve to this score)
  curveStrength: -1 // for nth root curves
};

let alertMessages = {
  'weight': `<b>Grade Weighting</b><br>Most colleges and many high school classes use a <b>weighted</b> grading system so that different assignments have different "weights" (e.g. final, tests, and homework). If your grade has any kind of categories, then you have a weighted grading system. <br><br>Some classes give point values to assignments instead, usually with the final being worth a lot more than say, homework. If that's your case, then you have an <b>unweighted</b> grading system.`, 
  'examType': `<b>Exam Type</b><br>If your final has its own category (most common for weighted classes, default on RogerHub), select <b>Final</b>.<br>If you're taking a test/exam, select <b>Test/Exam</b>.<br>If you're taking a final but the final is counted as a test/exam (less common, but some classes do this), also select <b>Test/Exam</b>.<br>The difference between the two is that selecting "final" assumes your "final" exam goes into its own category, whereas "test/exam" assumes there's already other tests/exams in the category.`,
  'calcTypes': `<b>Grade Calculation Types</b><br>First of all, there's two main categories for weighted calculations - tests and finals. A final is put <b>into its own category</b> for weighing, whereas a test is put <b>with other tests</b>. <br><br>If you already took the test/final, you'll need to select an option that begins with "<b>I took a...</b>". Otherwise, the calculator will tell you how much you need to get on the test/final in order to <b>maintain a specified grade</b>.`,
  'equalTests': `<b>Equal Test Weights</b><br>If each test is worth the same number of points (e.g., 100 pts per test), then select "yes". If each test is put in as a different number of points (e.g., one test is worth 30 pts, another is 35 pts, etc.) then select "no".<br/><br/>Note that "Test/Exam" does not have to be used on tests; it can be used for any category where you already have tests/assignments. Simply select "no" and enter the point total of the category you want to use grade calculator on.`, 
  'legal': `<b>Legal</b><br/>&copy; 2019 Ryan Zhang.<br/>core.js is written by me and is used for grade calculations. It's licensed under <a href='https://www.gnu.org/licenses/gpl-3.0.en.html' target='_blank'>GPLv3</a>.</br>Everything else unlicensed for the time being (albeit being open source); <a href='https://ryan778.github.io/about-me/'>contact me</a> if interested.`
}

let testAdjInfo = [`Your lowest test grade will be completely removed.`, `If your grade on the final is better than your lowest test, it'll replace your lowest test grade.`, `You'll get half the difference (if applicable) between your lowest test grade and the final.`];

let testReqInputs = ['finalWorth']; // required inputs tied to test adjustment and/or "test/exam" input requirements

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
        return {st: 0, val: convToGrade(val), msg: `<span class='nt-hidden-ltGrd'></span>Using ${val.toUpperCase()} as ${convToGrade(val)}%`}
      }
      return {st: 2, msg: `Invalid input (is it a number/letter grade?)`}
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
    case 'num': // Numerical value (ex: 5)
      if(parseInt(val).toString() === val){
        if(parseInt(val) >= 50){
          return {st: 1, val: parseInt(val), msg: 'This looks rather high. Is there a typo?'};
        }
        else if(parseFloat(val) < 1){
          if(parseFloat(val) < 0){
            return {st: 2, msg: `You need a non-negative integer here!`}
          }
          return {st: 1, val: parseInt(val), msg: 'This looks rather low. Is there a typo?'};
        }
        return {st: 0, val: parseInt(val)}
      }
      return {st: 2, msg: `Invalid input (is it a whole number?)`}
    case 'pts': // Points
    case 'ptsSingle': // Points
      if(val.match(/^\d*\.?\d*$/)){
        if(parseFloat(val) >= 4000 || (type==='ptsSingle' && parseFloat(val) > 400)){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather high. Is there a typo?'};
        }
        else if(parseFloat(val) <= 10){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather low. Is there a typo?'};
        }
        return {st: 0, val: parseFloat(val)}
      }
      return {st: 2, msg: `Invalid input (is it a decimal number?)`}
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
    case 'root': // similar to case "num", but allows decimals - only used in "what is n" question
      if(val.match(/^\d*\.?\d*$/)){
        if(parseFloat(val) >= 5){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather high. Is there a typo?'};
        }
        else if(parseFloat(val) <= 1){
          return {st: 1, val: parseFloat(val), msg: 'This looks rather low. Is there a typo?'};
        }
        return {st: 0, val: parseFloat(val)}
      }
      return {st: 2, msg: `Invalid input (is it a decimal number?)`}
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
  ele.children('span').html(msg);
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
  if (grade > 115){
    return 'Unless your teacher gives that much extra credit, you may have to lower your expectations slightly.'}
  else if (grade > 100){
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
    return globalData.testPolicy===2?"Looks like you'll have no trouble!":"Looks like you'll have no trouble reaching your goal!"}
  else if(grade >= 0){
    return globalData.testPolicy===2?"Well that seems pretty easy to do.":"Maybe you could raise your expectations a little?"}
  else{
    return "Looks like you don't even have to show up!"}
}

function processCalculations(){
  let postCurveGrade = 0; 
  $('.calcRes').hide();
  $('.p-res').hide();
  $('#res_moreInfo').hide();
  $('#res_warn-grdAdj').hide();
  $('#res-warn').hide();
  if($('.nt-hidden-ltGrd').length > 0){ //Letter grade used somewhere
    $('#res-warn-gr').show()}
  else{
    $('#res-warn-gr').hide()}
  // let t = globalData.targetGrade, w = globalData.finalWorth, wp = globalData.finalWorthPts, c = globalData.currentGrade, cp = globalData.currentGradePts, ct = globalData.currentGradeTotalPts, f = globalData.finalGrade, r, vald;
    let f = globalData.finalGrade, c = globalData.currentGrade, t = globalData.targetGrade; 
    if(globalData.gradeType){
      c = 100 * globalData.currentGradePts / globalData.currentGradeTotalPts}
/*  if(globalData.gradeType === 1){
    if(!validateInputs(['currentGradePts', 'currentGradeTotalPts', 'targetGrade', 'finalWorthPts'])){
      $('#calcErr').show();
      return}
    let out =  calcTargetGrade(t); 
    r = out[0]; 
    $('#res-0').show();
    $('#res-an-0').text(detPlu(r));
    $('#res-val-0').text(`${r.toFixed(2)}% (${convToLetter(r)})`);
    postCurveGrade = r; 
    $('#res-an-0b').text(detPlu(t));
    $('#res-val-0b').text(`${t.toFixed(2)}% (${convToLetter(t)})`);
  } */
  if(globalData.testPolicy > 0){
    if(globalData.testPolicy === 1){
      $('#resi').show();
      $('#resi_a').show()}
    else{
      $('#resi_b').show()}
    if(globalData.testPolicy !== 2){
      $('#res_moreInfo').show()}
  }
  switch(globalData.calcType){
    case 0:
      //targetGrade = (finalWorth/100)*whatYouNeed + currentGrade*(1-(finalWorth/100))
      //whatYouNeed = (targetGrade - currentGrade*(1-(finalWorth/100))) / (finalWorth/100)
      vald = globalData.gradeType?validateInputs(['currentGradePts', 'currentGradeTotalPts', 'targetGrade', 'finalWorthPts']):validateInputs(['targetGrade', 'currentGrade'].concat(testReqInputs));
      if(!vald){
        $('#calcErr').show();
        return}
      r = calcTargetGrade(t);
      //r = (t-c*(1-(w/100)))/(w/100); //Algebraic manipulation
      handleQueryAction(1, Math.round(c*100));
      $('#res-0').show();
      $('#res-an-0').text(detPlu(r));
      $('#res-val-0').text(`${r.toFixed(2)}% (${convToLetter(r)})`);
      postCurveGrade = r; 
      $('#res-an-0b').text(detPlu(t));
      $('#res-val-0b').text(`${t.toFixed(2)}% (${convToLetter(t)})`);
      // $('#res_sub').text(getSubtitle(Math.floor(r)));
      if(vald === 2){$('#res-warn').show()}
      break;
    case 1:
      //finalGrade = (finalWorth/100)*finalExamGrade + currentGrade*(1-(finalWorth/100))
      vald = globalData.gradeType?validateInputs(['currentGradePts', 'currentGradeTotalPts', 'finalGrade', 'finalWorthPts']):validateInputs(['finalGrade', 'currentGrade'].concat(testReqInputs));
      if(!vald){
        $('#calcErr').show();
        return}
      r = calcResultingGrade(f);
      if(globalData.testPolicy > 0 && !globalData.gradeType){ // test adjustment policies don't exist for unweighted classes 
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
      handleQueryAction(2, Math.round(c*100));
      $('#res-1').show();
      $('#res-an-1').text(detPlu(r));
      $('#res-val-1').text(`${r.toFixed(2)}% (${convToLetter(r)})`);
      break;
    case 2:
      //whatYouNeed same as case 0, except used multiple times for various targetGrade to find the best one
      vald = globalData.gradeType?validateInputs(['currentGradePts', 'currentGradeTotalPts', 'finalWorthPts']):validateInputs(['currentGrade'].concat(testReqInputs));
      if(!vald){
        $('#calcErr').show();
        return}
      handleQueryAction(3, Math.round(c*100));
      let upper = Math.ceil(c/10)*10, lower = Math.floor(c/10)*10;
      let r1 = calcTargetGrade(upper);
      let r2 = calcTargetGrade(lower);
      //let r1 = (upper-c*(1-(w/100)))/(w/100); //Upper target
      //let r2 = (lower-c*(1-(w/100)))/(w/100); //Lower target
      // let r3 = globalData.gradeType ? ((cp + wp) / (ct + wp) * 100) : ((w) + (c*(1-(w/100)))); //Final grade w/ 100%
      let r3 = calcResultingGrade(100); 
      if(upper == 100 || r1 > 100){ //Show info to keep current grade (if upper is not achievable or grade is already an A)
        calcTargetGrade(upper); //Calling this updates [More Info] section if necessary
        $('#res-0').show();
        $('#res-an-0').text(detPlu(r2));
        $('#res-val-0').text(`${r2.toFixed(2)}% (${convToLetter(r2)})`);
        $('#res-an-0b').text(detPlu(lower));
        $('#res-val-0b').text(`${lower.toFixed(2)}% (${convToLetter(lower)})`);
        postCurveGrade = r2; 
        // $('#res_sub').text(getSubtitle(Math.floor(r2)));
      }
      if(r1 > 100){ //Upper grade is not achievable
        $('#res-1s').show();
        $('#res-an-1s').text(detPlu(r3));
        $('#res-val-1s').text(`${r3.toFixed(2)}% (${convToLetter(r3)})`);
        calcTargetGrade(lower); 
        postCurveGrade = r2;
        if (lower < 90 && (r3 % 10 > 7)) {$('#res_sub').text('Maybe you can get extra credit somewhere to bump it up?')} //Hide message if the lower bound is already an A or if there's a large gap (>3%) until the next letter grade
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
        postCurveGrade = r1; 
        // $('#res_sub').text(getSubtitle(Math.floor(r1)));
      }
      break;
    default:
      alert(`An error occured. \nPlease report this bug!\nError: invalid calcType (${globalData.calcType})`)
  }
  if(globalData.curvePolicy){ // curving the output grade if selected
    $('.res-hasCurve').show(); 
    let g = postCurveGrade; 
    if(globalData.curvePolicy >= 2){
      if(globalData.curvePolicy == 3){
        if(!validateInputs(['curveStrength'])){
          $('#calcErr').show();
          return}
      }
      let curveStrength = (globalData.curvePolicy==2)?2:globalData.curveStrength;
      g = Math.pow(g/100, curveStrength)*100;
    }
    else{ // curvePolicy = 1
      if(!validateInputs(['curveTo'])){
        $('#calcErr').show();
        return}
      g = g * (globalData.curveTo/100);
    }
    $('#res-val-c').html(`${detPlu(g)} <b>${g.toFixed(2)}% (${convToLetter(g)})</b>`);
    if(globalData.gradeType === 1){
      $('#sp-pts-curve').show(); 
      $('#res-val-curvePts').text(`${(g*globalData.finalWorthPts/100).toFixed(1)}/${globalData.finalWorthPts.toFixed(1)} pts`)
    }
    $('#res_sub').text(getSubtitle(Math.floor(g)));
  }
  else{
    $('.res-hasCurve').hide(); 
    $('#res_sub').text(getSubtitle(Math.floor(postCurveGrade)));
  }
  $('#calcRes').show();
}

function registerHandlers(){
  $('#calc').find('button').each((n, ele) => {
    if($(ele).hasClass('btn-opt')){
      $(ele).click(() => {
        $('.'+ele.classList[1]).prop('disabled', false);
        globalData[$(ele).data('for')] = $(ele).data('val'); 
        $(ele).prop('disabled', true); 
        if($(ele).data('for') === 'examType' || $(ele).data('for') === 'unequalTests'){
          updateTestInputs()}
        else if($(ele).data('for') === 'gradeType'){
          if($(ele).data('val') === 1){
            $('.btn-opt.btn-opt-1')[0].click();
            $('#sel_testAdj').val(0);
            $('#sel_testAdj').change();
            $('.p_weightedOnly').hide();
            $('.p_unweightedOnly').show();
            $('#opt_finalOrTest').hide(); 
            $('.opt_testAdj').hide()
          }
          else{
            $('.p_weightedOnly').show();
            $('.p_unweightedOnly').hide();
            $('.opt_testAdj').show();
            $('#opt_finalOrTest').show();
          }
        }
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
    if($(ele).data('vald') === 'grd'){
      ele.inputMode='decimal';
      ele.maxLength = 6}
    else if($(ele).data('vald') === 'weight'){ele.maxLength = 6}
    else if($(ele).data('vald') === 'root'){ele.maxLength = 5}
    else if($(ele).data('vald') === 'pts'){$(ele).css('width', '52px')}
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
      $('#calcRes').hide();
      let val = ele.value;
      if(!isNaN(parseInt(val))){val = parseInt(val)}
      globalData[$(ele).data('for')] = val;
      if(ele.dataset.for==='calcType'){
        $('#info_opt2').hide(); 
        let fg = (globalData.gradeType === 1?'#opt_finalWorthPts':'#opt_finalWorth'); 
        $('#opt_targetGrade').hide();
        $('#opt_finalGrade').hide();
        $('.p_curve').show(); 
        $(fg).show();
        switch(ele.value){
          case '0':
          default:
            $('#opt_targetGrade').show();
            break;
          case '1':
            $('#opt_finalGrade').show();
            $('#sel_curve').val(0); 
            $('#sel_curve').change();
            $('.p_curve').hide(); 
            break;
          case '2':
            $('#info_opt2').show()
            break;
        }
      }
      else if(ele.dataset.for==='testPolicy'){
        updateTestInputs(); 
      }
      else if(ele.dataset.for='curvePolicy'){
        $('#opt_curveTo').hide(); 
        $('#opt_curveStrength').hide(); 
        if(ele.value === '1'){
          $('#opt_curveTo').show()}
        else if(ele.value === '3'){
          $('#opt_curveStrength').show()}
      }
      setBorderClass(ele, 'gr');
      setTimeout(function(){
        setBorderClass(ele, -1);
      }, 1000);
    });
  });
  $('html').find('.infoLink').each((n, ele) => {
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

function updateTestInputs(){
  testReqInputs = []; 

  if(globalData.examType === 1){
    $('.opt_testAdj').hide(); 
    if(globalData.testPolicy){ // test policies don't work 
      $('#sel_testAdj').val(0);
      $('#sel_testAdj').change();
      return;
    }
    $('#opt_unequalTests').show()}
  else{
    $('.opt_testAdj').show();
    $('#opt_unequalTests').hide()}

  if(globalData.unequalTests){
    $('.p_testAdjUnequal').show(); 
    $('.p_testAdjEqual').hide(); 
    testReqInputs = ['testWorth', 'testCatPts', 'testCatTotalPts', 'testWorthPts'];
    return; 
  }
  else{
    $('.p_testAdjUnequal').hide(); 
    $('.p_testAdjEqual').show(); 
  }

  if(globalData.examType === 0 && globalData.testPolicy === 0){ // neither "test" type nor test policy
    $('.p_testAdj').hide();
    $('#opt_finalWorth').show();
    testReqInputs.push('finalWorth');
    return; 
  }
  $('.p_testAdj').show(); //All fields can be used for everything
  testReqInputs.push('testWorth');
  testReqInputs.push('totalTests');
  if(globalData.testPolicy){ // test policy exists
    $('#p_testAdjInfo').show();
    $('#opt_lowestTest').show(); 
    $('#sp_testAdjInfo').text(testAdjInfo[parseInt(globalData.testPolicy)-1]);
    testReqInputs.push('lowestTest');
  } else{
    $('#p_testAdjInfo').hide(); 
    $('#opt_lowestTest').hide(); 
  }
  if(globalData.examType == 1){
    $('#opt_finalWorth').hide()}
  else {
    testReqInputs.push('finalWorth');
    $('#opt_finalWorth').show()}
  if(globalData.testPolicy !== 1 && globalData.examType == 0){
    $('#p_testAvgInfo').hide();
    $('#opt_testAvg').hide()}
  else{
    testReqInputs.push('testAvg');
    $('#p_testAvgInfo').show();
    $('#opt_testAvg').show()}
}

$(document).ready(function () {
  'use strict';
  let h = location.hostname;
  if(['127.0.0.1', '10.10.7.38', 'itsryan.org', 'ryan778.github.io', 'ryan778.herokuapp.com', 'ryan778.azurewebsites.net'].indexOf(h) === -1){
    $('#calc-load').html(`<i class='material-icons'>error</i> <b>Non-Whitelisted Domain</b><br>It looks like you're opening this page somewhere it's not supposed to be.<br>Make sure that you're on <a href='https://ryan778.github.io/final-grade-calculator/'>the official website</a>, and if this error persists, <a href='https://bit.ly/fgc-feedback'>contact us here</a>.`);
    return;
  }
  registerHandlers();
  $('.p_testAdj').hide();
  $('#opt_curveTo').hide(); 
  $('#opt_unequalTests').hide();
  $('.p_unweightedOnly').hide();
  $('.p_testAdjUnequal').hide(); 
  $('#opt_curveStrength').hide(); 
  $('#calc-load').hide();
  $('#calc-inner').show();
});