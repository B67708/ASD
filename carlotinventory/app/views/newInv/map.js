function(doc){
	if(doc._id !== "_design/app"){
		emit([doc._id, doc._rev],{
			"NewUsed": doc.newUsed,
			"Make": doc.makeMenu,
			"Model": doc.modelMenu,
			"Year": doc.yearBox,
			"Mileage": doc.mileBox,
			"Condition": doc.conditionSlider,
			"Date": doc.dateBox,
			"Info": doc.infoBox
		});
	}
};
			