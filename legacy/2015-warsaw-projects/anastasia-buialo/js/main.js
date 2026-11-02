var selectedCountry;
var selectedMonth;
var selectedWeather;
var selectedTime;

function changeCountry(e) {
	console.log(e);
	selectedCountry = e;
}


function changeMonth(e) {
	console.log(e);
	selectedMonth = e;
}


function changeWeather(e) {
	console.log(e);
	selectedWeather = e;
}


function changeTime(e) {
	console.log(e);
	selectedTime = e;
}

function predictAurora (e) {
    if (!player.project) return;
	console.log(selectedCountry, selectedMonth, selectedWeather, selectedTime);
    player.setValue('filterData2', 'value', selectedCountry);
    player.setValue('filterData3', 'value', selectedMonth);
    player.setValue('filterData4', 'value', selectedWeather);
    player.setValue('filterData5', 'value', selectedTime);
	
	console.log(e);
    //player.setValue('slice1', 'value', e);
	player.ndbx.evalFunction(player.project, player.functionName, function(err, result) { 
		result = result[0];
		var resultElement = document.getElementById('result');
        resultElement.innerHTML = "&#34; ";
		resultElement.innerHTML += result;
        resultElement.innerHTML += " &#34;";
		resultElement.innerHTML += "<br><a style='color:#ffffff;' href=''>Try Again</a>";
		console.log(result);
	});
}



document.addEventListener('DOMContentLoaded', function () {

    window.player = app.embed({
        userId: 'Anastasia',
        projectId: 'auroraForecast',
        canvasId: 'c'
    });

	 window.auroraPlayer = app.embed({
        userId: 'Anastasia',
        projectId: 'auroraForecast',
        functionId: 'perlin',
        canvasId: 'c2',
		 animate: true
    });

	
	
});
