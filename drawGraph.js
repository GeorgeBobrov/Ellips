function drawGraph(data, param, canvas, start_x, start_y, color='pink', width=100, height=50, format = n => n.toFixed(2)) {
	let ctx = canvas.getContext('2d')

	let max = Math.max(...data)
	let min = Math.min(...data)

	let range = max - min
	if (range < min/1000000) range = min/1000000
	let yscale = height / range
	// let xscale = 1
	let xscale = width / data.length
	//console.log(label, yscale)

	let axis_color = 'black'
	let axisX_y = start_y + Math.trunc(height / 2)

	ctx.lineWidth = 1
	ctx.beginPath() // X axis
	ctx.strokeStyle = axis_color
	ctx.moveTo(start_x, axisX_y)
	ctx.lineTo(start_x + width, axisX_y)
	ctx.stroke()

	ctx.beginPath() // Y axis
	ctx.moveTo(start_x, start_y)
	ctx.lineTo(start_x, start_y + height)
	ctx.stroke()

	// ctx.lineWidth = 2
	ctx.fillStyle = color
	ctx.font = "12px Arial" // label
	ctx.fillText(param, start_x + width / 2, start_y)

	ctx.fillText(format(max), start_x + 5, start_y + 12)
	ctx.fillText(format(min), start_x + 5, height + 12)

	ctx.moveTo(start_x, height)
	ctx.beginPath()
	ctx.strokeStyle = color
	for (let i=0; i<data.length; i++) {
		ctx.lineTo(start_x + i * xscale, height + start_y - (data[i] - min)*yscale)
	}
	ctx.stroke()
}