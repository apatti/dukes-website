$(document).ready(function(){
	var superbowlObj ='';
	$.get("/superbowl",function(data,status){
		superbowlobj=data;
		$('#firstquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'firstquartertotalover', headerText: 'Over',sortable:false},
				      {field:'firstquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#secondquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'secondquartertotalover', headerText: 'Over',sortable:false},
				      {field:'secondquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#thirdquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'thirdquartertotalover', headerText: 'Over',sortable:false},
				      {field:'thirdquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#fourthquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'fourthquartertotalover', headerText: 'Over',sortable:false},
				      {field:'fourthquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#finaltotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'finaltotalover', headerText: 'Over',sortable:false},
				      {field:'finaltotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#firstquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'firstquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'firstquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#secondquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'secondquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'secondquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#thirdquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'thirdquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'thirdquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#fourthquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'fourthquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'fourthquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#finalquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'finalquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'finalquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
	    });
    });