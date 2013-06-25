//John Cardiff-Winchell
//ASD 1306
// week 2
$('#main').on('pageinit', function(){
	$('#inventory').on('click', getData);
	//$('#jsonData').on('click', autoFill);
	//$('#xmlData').on('click', autoFill);
	//$('#clear').on('click', clearLocal);
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
	getData(false);
});

$('#about').on('pageinit', function (){
	//console.log("test");
	$.ajax({
		url: "_view/newInv",
		dataType: "json",
		success: function(data){
		console.log(data);
			$.each(data.rows, function(index, newInv){
				var newUsed = newInv.value.NewUsed;
				var makeMenu = newInv.value.Make;
				var modelMenu = newInv.value.Model;
				var yearBox = newInv.value.Year;
				var mileBox = newInv.value.Mile;
				var conditionSlider = newInv.value.Condition;
				var myDate = newInv.value.Date;
				var infoBox = newInv.value.Info;
				
				$("#list").append(
					$("<li>").append(
						$("<a>").attr("href", "#")
						.text(modelMenu)
					)
				);
			});
			$("#list").listview("refresh");
		}
	});
	
});

/*var autoFill = function(){
	var type = $(this).attr('id');
	//console.log(type)
	if(type === 'xmlData'){
		$.ajax({
			url: 'data.xml',
			type: 'GET', 
			dataType: 'xml',
			success: function(result){
				$(result).find('vehicle').each(function(){
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
					
					
					var id = Math.floor(Math.random()*999999999);
					localStorage.setItem(id, thingy);
				});
				alert("Xml Loaded");
				},
				error:function(result){
					alert("Error, Xml Not Loaded");
					console.log(result);
					
			}
		});
	}else{
		$.ajax({
			url: 'data.json',
			type:'GET',
			dataType: 'json',
			success: function(result){
				for(var y in result){
					var id = Math.floor(Math.random()*999999999);
					localStorage.setItem(id, JSON.stringify(result[y]));
				}
				alert("Json Loaded");
			},
			error:function(result){
				alert("Error, Json not loaded");
				console.log(result)
			}
		});
	}
};*/
var getData = function(){
	var label = ["New or Used: ", "Make: ", "Model: ", "Year: ", "Mileage: ", "Condition: ", "Date: ", "Info: "];	
	var appendLoc = $('#invContent').html("");
	
	$.couch.db('asd').view('app/newInv', {
		success: function(data){
			//console.log(data);
			$.each(data.rows, function(index,newInv){
				var div = $('<div>')
					.attr('data-role', 'listview')
					.attr('id', newInv.key)
					.appendTo(appendLoc);
					
					
				var ul = $('<ul>').appendTo(div)
				var count = 0;
				for(var r in newInv.value){
					var li = $('<li>')
						.html(label[count] + newInv.value[r])
						.appendTo(ul);
						
						count++
				}
				
				var buttHoldDiv = $('<div>').attr('class','ui-grid-a').appendTo(div);
				var editButtDiv = $('<div>').attr('class', 'ui-block-a').appendTo(buttHoldDiv);
				var delButtDiv = $('<div>').attr('class', 'ui-block-b').appendTo(buttHoldDiv);
				var editButt = $('<a>')
					.attr('data-role', 'button')
					.attr('href', '#addItem')
					.html('Edit')
					.data('key', newInv.key[0])
					.data('rev', newInv.key[1])
					.appendTo(editButtDiv)
					.on('click', editInv);
					
				var delButt = $('<a>')
					.attr('data-role', 'button')
					.attr('href', '#')
					.html('Remove')
					.data('key', newInv.key[0])
					.data('rev', newInv.key[1])
					.appendTo(delButtDiv)
					.on('click', delInv);
					
					//console.log(type.key[0]);
					//console.log(type.key[1]);
					$(div).trigger('create');	
			})
			$(appendLoc).trigger('create');
		}	
	});
};

var storeData = function(data){
	var key = $('#sumbit').data('key');
	var rev = $('#submit').data('rev');
	//console.log('key');
	//console.log('rev');
	var newInv = {};
	
	if(rev){
		newInv._id = key;
		newInv._rev = rev;
	}
		newInv.newUsed = data[0].value;
		newInv.makeMenu = data[1].value;
		newInv.modelMenu = data[2].value;
		newInv.yearBox = data[3].value;
		newInv.mileBox = data[4].value;
		newInv.conditionSlider = data[5].value;
		newInv.myDate = data[6].value;
		newInv.infoBox = data[7].value;
		
		//console.log(type);
		
		$.couch.db('asd').saveDoc(newInv,{
			success: function(newInv){
			alert("Vehicle Saved");
			$('#submit').html('Save Vehicle');
			window.location.reload(true)
			$.mobile.changePage('#main');
			}
		})
};

var editInv = function(){
	var key = $(this).data('key');
	var rev = $(this).data('rev');
	
	$.couch.db('asd').openDoc(key,{
		success: function(newInv){
		console.log('fired')
			$('#newUsed').val(newInv.newUsed).selectmenu("refresh");
			$('#makeMenu').val(newInv.makeMenu).selectmenu("refresh");
			$('#modelMenu').val(newInv.modelMenu).selectmenu("refresh");
			$('#yearBox').val(newInv.yearBox);
			$('#mileBox').val(newInv.mileBox);
			$('#conditionSlider').val(newInv.conditionSlider);
			$('#myDate').val(newInv.myDate);
			$('#infoBox').val(newInv.infoBox);
			$('#submit').attr('value', "Submit Changes").data('key', key).data('rev', rev);
			console.log(newInv)
		}
		
	});
};

var delInv = function(){
	var ask = confirm("Are you sure you want to delete this vehicle?");
		if(ask){
			var doc = {
				'_id': $(this).data('key'),
				'_rev': $(this).data('rev')
			};
			$.couch.db('asd').removeDoc(doc, {
				success: function(data){
					alert("Vehicle Was Removed");
					window.location.reload();
				}
			});
		}else{
			alert("Vehicle not Deleted.");
		}
};		