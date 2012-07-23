$(document).ready(function() {
	//google code prettyfier
    prettyPrint();

	//ascensor
$('#content').ascensor({
	AscensorName:'house',
	WindowsFocus:true,
	WindowsOn:0,
	
	NavigationDirection:'xy',
	Direction: 'y',
	Navig:true,
	Link:false,
	ReturnURL:true,
	PrevNext:true,
	CSSstyles:true,
	
	KeyArrow:true,
	keySwitch:true,
	ReturnCode:false,
	
	ChocolateAscensor:true,
	AscensorMap: '4|4',
	ContentCoord: '1|1 & 1|2 & 1|3 & 1|4 & 2|4 & 3|4 & 3|3 & 3|2 & 3|1 & 4|1'
});

});
