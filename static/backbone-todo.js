window.Item = Backbone.Model.extend({
	//stuff that you can do to the lists
	idAttribute: '_id',
	urlRoot: '/items',

	remove: function(){
		this.destroy();
		$(this.view.el).remove();
	}
});

window.AllItems = Backbone.Collection.extend({
	model: Item,
	url: '/items'
});

window.allItems = new AllItems;

window.ItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'itemLine',
	model: Item,

	template: _.template("<input type='checkbox' class='list-check'></input><p class='item'></p><input type='text' class='item-edit' /><span class='delete'>x</span>"),

	events: {
      	"click .item": "edit",
      	"click .delete": "clear",
      	"keypress .item-edit": "updateOnEnter",
      	"blur .item-edit": 'exit'
	},

	initialize: function() {
      _.bindAll(this, 'render', 'exit');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

	setContent: function() {
		var itemText = this.model.get('item');
		this.$('.item').text(itemText);
		this.$('.item-edit').val(itemText)

		this.input = this.$('.item-edit');
	},
  
    render: function() {
     	$(this.el).html(this.template());
      	this.setContent();
      	return this;
    },

	edit: function() {
		$(this.el).addClass("editing");
		this.input.focus();
	},

	exit: function() {
		$(this.el).removeClass("editing");
		this.model.save({item: this.input.val()});
	},

	updateOnEnter: function(e) {
		if (e.keyCode === 13){
      		this.exit();
      	}
    },

    clear: function() {
    	console.log('delete')
    	this.model.remove();
    }
});

window.AppView = Backbone.View.extend({
	el: $('#listWrapper'),

	events: {
      "keypress #new-item" : "addOnEnter",
    },

    initialize: function() {
    	_.bindAll(this, 'addOne', 'addAll', 'render');
    
      	this.input = this.$("#new-item");
      
      	allItems.bind('add', this.addOne);
      	allItems.bind('refresh', this.addAll);
      	allItems.bind('all', this.render);
    
      	allItems.fetch();
    },

    addOne: function(item) {
      	var element = new ItemView({model:item}).render().el;
      	$("#list").append(element);
    },

    addOnEnter: function(e){
    	console.log('hey')
    	if (e.keyCode === 13){
	      	allItems.create({
	        	'item': this.input.val(),
	        	'category': "Placeholder"
	      	});
		    this.input.val("");
		}
    },
    
    addAll: function() {
      allItems.each(this.addOne);
    },

});

window.playItem = new Item;
window.App = new AppView;
window.playItemView = new ItemView({model:playItem})

var element = playItemView.render().el;

playItemView.model.save({'item': 'java', 'category': 'language'})

$("#list").append(element);