(function() {
    var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];

    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();

function showInfo(n){
    switch(n){
        case 0: 
            alertify.alert('<b>About</b><br>A personal page for automatically calculating stats on Outlook (helpful when you have 500+ emails), which can then be imported into Excel/Sheets to make graphs. Not configured for specific people, can be used by anyone! :D');
            break;
        case 1: 
            alertify.alert('<b>Legal</b><br>&copy; Ryan Zhang 2017. All rights reserved.<br>Contact me @ryanz778 or rjoker778@gmail.com if you want to use code or just say hi. ');
            break;
        case 2:
            alertify.alert('<b>Contact</b><br>Suggestions? Comments? Contact me!<br>GitHub Issues: <a href="https://github.com/Ryan778/Ryan778.github.io/issues" target="_blank">Issues and/or Suggestions</a><br>Twitter: <a href="https://twitter.com/ryanz778" target="_blank">@ryanz778</a>')
            break;
    }
}

var addFillerDates = true; //If a day in between has zero emails, add "0" for that day
function genStats(){
	var senders = {};
	var emailsByDate = {};
	var earliestEmail = 999999999999999;
	var latestEmail = 0;
	var email = '	\n'+document.getElementById('email').value;
	var mostEmailsOnOneDay = {amount: -1, date: Date.now()};
	var leastEmailsOnOneDay = {amount: 9999999, date: Date.now()};
	email = email.split('\nFrom: '); //Separate emails into an array
	email = email.slice(1); //Remove empty item in array (first item)
	for(var i = 0; i < email.length; i++){
		var sender = email[i].slice(0, email[i].indexOf('\n'));
		if(sender.indexOf('<') > 2){
			sender = sender.replace(/\W<.+>/g, ''); //Remove the <bob@example.com> part of emails
		}
		if(sender.slice(-10) === ' - Student'){sender = sender.slice(0, -10)}
		if(senders[sender] === undefined){
			senders[sender] = 1; //If sender doesn't exist, create sender
		}
		else{
			senders[sender] ++; //If sender exists, add one to email count
		}
		email[i] = email[i].slice(email[i].indexOf('\n')+1);
		var time = new Date(email[i].slice(6, email[i].indexOf('\n')).replace('at ', ''));
		time.setHours(0);
		time.setMinutes(0);
		time.setSeconds(0);
		time.setMilliseconds(0);
		if(time.getTime() < earliestEmail){earliestEmail = time.getTime()}
		if(time.getTime() > latestEmail){latestEmail = time.getTime()}
		var t = time.toISOString();
		if(emailsByDate[t] === undefined){
			emailsByDate[t] = {
				formatted: time.getDayName()+' '+(time.getMonth()+1)+'/'+time.getDate(),
				emails: 1, 
				senders: {}
			}
			emailsByDate[t]['senders'][sender] = 1;
		}
		else{
			emailsByDate[t]['emails'] ++; 
			if(emailsByDate[t]['senders'][sender] === undefined){
				emailsByDate[t]['senders'][sender] = 1;
			}
			else{
				emailsByDate[t]['senders'][sender] ++;
			}
		}
	}
	//console.log(email);
	var t = earliestEmail; 
	while(t < latestEmail){
		t += 86400000;
		var tm = new Date(t).toISOString();
		if(emailsByDate[tm] !== undefined){
			if(emailsByDate[tm]['emails'] > mostEmailsOnOneDay.amount){
					mostEmailsOnOneDay.amount = emailsByDate[tm]['emails'];
					mostEmailsOnOneDay.date = tm;
				}
				if(emailsByDate[tm]['emails'] < leastEmailsOnOneDay.amount){
					leastEmailsOnOneDay.amount = emailsByDate[tm]['emails'];
					leastEmailsOnOneDay.date = tm;
				}
		}
		if(emailsByDate[tm] === undefined && addFillerDates){
			emailsByDate[tm] = {
				formatted: tm.getDayName()+' '+(tm.getMonth()+1)+'/'+tm.getDate(),
				emails: 0, 
				senders: {}
			}
		}
	}
	
	results.innerHTML = '';
	var res = '';
	res += '<b>Email Senders</b>: <br>';
		for(var i in senders){
			res += `${i}: ${senders[i]} emails<br>`
		}
	res += '<br><b>Emails by Date</b>: <table id="restbl"><tr><th>Date</th><th>Total Emails</th>';
	var tbl_senders = [];
	for(var i in senders){
		tbl_senders[tbl_senders.length] = i;
		res += `<th>From ${i}</th>`
	}
	res += '</tr>';
	var cnt = 0;
	var emailsByDate_sorted = Object.keys(emailsByDate).sort();
	console.log(emailsByDate_sorted);
	for(var k = 0; k < emailsByDate_sorted.length; k++){
		var i = emailsByDate_sorted[k];
		res += `<tr><td>${emailsByDate[i]['formatted']}</td><td>${emailsByDate[i]['emails']}</td>`;
		for(var j = 0; j < tbl_senders.length; j++){
			console.log(i);
			console.log(emailsByDate[i]);
			if(emailsByDate[i]['senders'][tbl_senders[j]] === undefined){
				res += '<td>0</td>';
			}
			else{
				res += `<td>${emailsByDate[i]['senders'][tbl_senders[j]]}</td>`;
			}
		}
		res += '</tr>';
	}
	results.innerHTML = res;
}