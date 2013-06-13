//John Cardiff-Winchell
//ASD 1306
// week 2
$('#main').on('pageinit', function(){
	$("#inventory").on('click', getData);
	$("#json").on("click", autoFill);
	$("#xml").on("click", autoFill);
	$("#clear").on("click", clearLocal);
});	
		
$('#addItem').on('pageinit', function(){

		var myForm = $('#addItemForm');
		    myForm.validate({
			invalidHandler: function(form, validator) {
			},
			submitHandler: function() {
		var data = myForm.serializeArray();
			storeData(data);
		}
	});
	
});
	

$('#inventory').on('pageinit', function (){
	getData();
});

$('#about').on('pageinit', function (){
	
});

var autoFill = function(){
	var type = $(this).attr('id');
	if(type === 'xml'){
		$.ajax({
			url:'data.xml',
			type: 'GET', 
			dataType: 'xml',
			success: function(data){
				console.log('xml Loaded');
				$(data).find('vehicle').each(function(){
					var item = $(this);
					var thingy = "";
					thingy += '{"New or Used":"' + item.find('newUsed').text()+'",';
					thingy += '"Make":"' + item.find('makeMenu').text()+'",';
					thingy += '"Model":"' + item.find('modelMenu').text()+'",';
					thingy += '"Year":"' + item.find('yearBox').text()+'",';
					thingy += '"Mileage":"' + item.find('mileBox').text()+'",';
					thingy += '"Condition":"' + item.find('conditionSlider').text()+'",'; 
					thingy += '"Date":"' + item.find('myDate').text()+'",';
					thingy += '"Info":"' + item.find('infoBox').text()+'"}';
					
					var id = Math.floor(Math.random()*123456789);
					localStorage.setItem(id, thingy)
				});
				alert("Xml Loaded");
				},
				error:function(data){
					alert("Error, Xml Not Loaded");
			}
		});
	}else{
		$.ajax({
			url:'data.json',
			type:'GET',
			dataType: 'json',
			success: function(data){
				console.log ("json Data Loaded");
				for(var y in Data){
					var id = Math.floor(Math.random()*123456789);
					localStorage.setItem(id, JSON.stringify(data[y]));
				}
				alert("Json Loaded");
			},
			error:function(data){
				alert("Error, Json not loaded");
			}
		});
	}
};

var getData = function(someThing){
	var label = ["New or Used: ", "Make: ", "Model: ", "Year: ", "Mileage: ", "Condition: ", "Date: ", "Info: "];
	
	var appendLoc = $("#invContent").html("");
	someThing = false;
	for(var i=0, j=localStorage.length; i<j; i++){
		var key = localStorage.key(i);
		var value = localStorage.getItem(key);
		var object = JSON.parse(value);
		
		var div = $("<div>")
			.attr ("data-role", "listview")
			.attr ("id", key)
			.appendTo (appendLoc);
			
		var ul = $('<ul>').appendTo(div);
		var count = 0;
		for(var r in object){
			var li =$('<li>')
				.html(label[count] + object[r])
				.appendTo(ul);
				count++;
		}
		var buttHoldDiv = $('<div>').attr('class', 'ui-grid-a').appendTo(div);
		var editButtDiv = $('<div>').attr('class', 'ui-block-b').appendTo(buttHoldDiv);
		var delButtDiv = $('<div>').attr('class', 'ui-block-b').appendTo(buttHoldDiv);
		var editButt = $('<a>')
			.attr('data-role', 'button')
			.attr('href','#addItem')
			.html('Edit')
			.data('key', key)
			.appendTo(editButtDiv)
			.on('click', editInv);
			
		var delButt = $('<a>')
			.attr('data-role', 'button')
			.attr('href', '#')
			.html('Remove')
			.data('key', key)
			.appendTo(delButtDiv)
			.on('click', delInv);
			
		$(div).trigger('create');
	} 
	$(appendLoc).trigger('create');

}

var storeData = function(data){
	key = $('#submit').data('key');
	if(!key){
		var id= Math.floor(Math.random()*123456789);
	}else{
		var id = key;
	}
	var newInv = {};
		newInv.newUsed = data[0].value;
		newInv.makeMenu = data[1].value;
		newInv.modelMenu = data[2].value;
		newInv.yearBox = data[3].value;
		newInv.mileBox = data[4].value;
		newInv.conditionSlider = data[5].value;
		newInv.dateBox = data[6].value;
		newInv.infoBox = data[7].value;
		
		localStorage.setItem(id, JSON.stringify(newInv));
		$('#submit').html('Save Vehicle').removeData('key');
		alert("Vehicle Saved!");
		window.location.reload();
};

var editInv = function(){
	var data = $(this).data("key");
	var invValue = localStorage.getItem(data);
	var inv = JSON.parse(invValue);
	
	$('#newUsed').val(inv.newUsed);
	$('#makeMenu').val(inv.makeMenu);
	$('#modelMenu').val(inv.modelMenu);
	$('#yearBox').val(inv.yearBox);
	$('#mileBox').val(inv.mileBox);
	$('#conditionSlider').val(inv.conditionSlider);
	$('#dateBox').val(inv.dateBox);
	$('#infoBox').val(inv.infoBox);
};

var delInv = function(){
	var ask = confirm("Are you sure you want to delete this vehicle?");
	if(ask){
		localStorage.removeItem($(this).data('key'));
		window.location.reload();
	}else{
		alert("Vehicle wasn't deleted");
	}
};

var clearLocal = function(){
	if(localStorage === 0){
		alert("There isn't anything to clear.")
	}else{
		localStorage.clear();
		alert("Local Storage was cleared.");
	}
};