// Equation of Time calculation
//     *** No guarantees are implied. Use at your own risk ***

//     Written by E. Sevastyanov, 2017-05-14; clarified by E. Sevastyanov, 2022-01-20

//     Based on "Equation of time" WikiPedia article as of 2016-11-28
//     (which describes angles in a bewildering mixture of degrees and radians)
//     and
//     Del Smith, 2016-11-29

//     It appears to give a good result, but I make no claims for accuracy.

//param numDay is the number of days from 1 January
//param perihelionDay is the number of days from 1 January to the date of the Earth's perihelion
function getEquationOfTimeSecondsShift(numDay, perihelionDay = 2) {
	let inclination = 23.4372 * Math.PI / 180; // Earth's inclination in radians

	let dayFromSolstice = (numDay + 10) % 365
	let dayFromPerihelion = (numDay - perihelionDay) % 365

	let angular_velocity = 2 * Math.PI / 365.25636 // angular velocity of annual revolution (radians/day)
	let angleFromSolstice = dayFromSolstice * angular_velocity // angle in (mean) circular orbit, solar year starts 21. Dec
	let angleFromPerihelion = dayFromPerihelion * angular_velocity // angle in (mean) circular orbit, from perihelion

	let beta = angleFromSolstice + 0.03340560188317 * Math.sin(angleFromPerihelion) // angle in elliptical orbit, from perihelion  (radians)
	let gamma = (angleFromSolstice - Math.atan(Math.tan(beta) / Math.cos(inclination))) / Math.PI // angular correction
	let eot = (43200 * (gamma - Math.round(gamma))) // equation of time in seconds (as The United States Naval Observatory defines it by placing itself at the center of the universe). 
	return eot
}

function getEquationOfTimeSecondsShift2(numDay, perihelionDay = 2) {
	// numDay - порядковый номер дня в году.
	let D = (numDay*360/365) // приращение долготы среднего Солнца от начала года;
	let eot = 7.8*Math.sin((D-perihelionDay)* Math.PI / 180) + 10*Math.sin((2*D+10) * Math.PI / 180)
	return eot * 60
}

function getEquationOfTimeSecondsShift3(numDay, perihelionDay = 2) {
	let dayFromSolstice = (numDay + 10) % 365
	let dayFromPerihelion = (numDay - perihelionDay) % 365

	let angular_velocity = 2 * Math.PI / 365.25636 // angular velocity of annual revolution (radians/day)
	let angleFromSolstice = dayFromSolstice * angular_velocity
	let angleFromPerihelion = dayFromPerihelion * angular_velocity

	let eot = 7.8*Math.sin(angleFromPerihelion) + 10*Math.sin(2*angleFromSolstice)

	return eot * 60
}

function getPerihelionDay(year) {
	let np
	//The number np is the number of days from 1 January to the date of the Earth's perihelion. 
	//(http://www.astroMath.PIxels.com/ephemeris/perap2001.html)
	switch (year) {
	case 2017 : np = 3.59583333333333; break;
	case 2018 : np = 2.23263888888889; break;
	case 2019 : np = 2.22222222222222; break;
	case 2020 : np = 4.325; break;
	case 2021 : np = 1.57708333333333; break;
	case 2022 : np = 2.28819444444444; break;
	case 2023 : np = 3.67847222222222; break;
	case 2024 : np = 2.02708333333333; break;
	case 2025 : np = 3.56111111111111; break;
	case 2026 : np = 2.71944444444444; break;
	case 2027 : np = 2.10625; break;
	case 2028 : np = 4.51944444444444; break;
	case 2029 : np = 1.75902777777778; break;
	case 2030 : np = 2.425 ; break;
	default: np = 2; break;
	}
	return np
}


let now = new Date()
let year = now.getUTCFullYear()
let firstDayOfYear = new Date(`01.01.${year}`)
let numDay = (now - firstDayOfYear ) / 86400 / 1000
let perihelionDay = getPerihelionDay(year)

let eot = getEquationOfTimeSecondsShift(numDay, perihelionDay)
let eot2 = getEquationOfTimeSecondsShift2(numDay, perihelionDay)
let eot3 = getEquationOfTimeSecondsShift3(numDay, perihelionDay)

console.log(`EOT = ${ eot * -1 } секунд`) // (as "how many seconds the clock is ahead (+) or behind (−) the apparent sun")


for (let d = 0; d < 365; d++) {
	let eot = getEquationOfTimeSecondsShift(d, perihelionDay)
	let eot2 = getEquationOfTimeSecondsShift2(d, perihelionDay)
	let eot3 = getEquationOfTimeSecondsShift3(d, perihelionDay)
	console.log(`day=${d}; EOT=${-eot.toFixed(1)}; EOT2=${eot2.toFixed(1)}; EOT3=${eot3.toFixed(1)}; diff=${(eot3+eot).toFixed(1)}`)
}