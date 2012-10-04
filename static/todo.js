function init() {
	var datas = []
	$.getJSON('/listsJSON', function(json){
		var rawdata = json
		for (var thing in rawdata){
			datas.push([thing, rawdata[thing]])
		}
		if (datas.length===0){
			datas = [['To Do List', ['Start a to do list']]]
		}
		for (var i=0; i<datas.length; i++){
			var title = datas[i][0]
			var items = datas[i][1]
			var divtitle = title.replace(/\s+/g, '');
			$('#listWrapper').append("<div class='list' id='list-"+divtitle+"'><div id='listHeader'><h3>"+title+"</h3><div class='options-button'><p>Options</p></div></div>")
			for (var j=0; j<items.length; j++){
				$('#list-'+divtitle).append("<p class='item'>"+items[j]+"</p>")
			}
			$('#list-'+divtitle).append("<div class='thing button'><p>Add a thing</p></div></div>")
		}

		$('p.item').click(function(event){
			var clicked = event.target
			var olditem = $(clicked).text()
			var title = $(clicked).parent().children('#listHeader').children('h3').text()
			console.log(title)
			$("<input class='itemedit' type='text'></input>").val(olditem).insertAfter(clicked).focus()
			$(clicked).remove()
			$('input.itemedit').blur(function(event){
				$.ajax('/editItem/' + title +'/' + olditem +'/' + $(event.target).val());
			});
		});

		$('h3').click(function(event){
			var clicked = event.target
			var oldtitle = $(clicked).text()
			$("<input class='titleedit' type='text'></input>").val(oldtitle).insertAfter(clicked).focus()
			$(clicked).remove();
			$('input.titleedit').blur(function(event){
				$.ajax('/editTitle/' + oldtitle +'/' + $(event.target).val());
			});
		});

		$('#newList').click(function(){
			$('#listWrapper').append("<div class='list' id='newlist'><div id='listHeader'><input type='text' class='newtitle'></input><div class='options-button'><p>Options</p></div></div>")
			$('#newlist').append("<div class='thing button'><p>Add a thing</p></div></div>")
			$('input.newtitle').blur(function(event){
				$.ajax('/newList/' + $(event.target).val())
			});
		});

		$('div.button.thing').click(function(event){
			$("<input class='newItem' type='text'></input>").insertBefore($(event.target).parent());
			$('input.newItem').blur(function(event){
				var title = $(event.target).parent().children('#listHeader').children('h3').text()
				$.ajax('/newItem/' + title +'/' + $(event.target).val());
			});
		});
	});	
};

init();