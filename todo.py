from flask import Flask, render_template, jsonify, request
from pymongo import Connection

app = Flask(__name__)
connection = Connection()
db = connection.test
theData = db.lists

@app.route('/', methods=['GET', 'POST'])

# """
# Methods:
# - make new category
# - delete a category
# - add new element
# - delete element
# - cross off the element, but leave it there
# - email the list to myself
# """

def start():
	return render_template('index.html')

@app.route('/newItem/<category>/<item>')
def newItem(item, category):
	theData.update({'name': category}, {'$push': {'items': item}})
	return 'success'

@app.route('/editTitle/<oldtitle>/<newtitle>')
def editTitle(oldtitle, newtitle):
	items = theData.find({'name': oldtitle}, {'items': 1}).distinct('items')
	theData.update({'name': oldtitle}, {'name': newtitle, 'items': items})
	return 'success'

@app.route('/editItem/<category>/<olditem>/<newitem>')
def editItem(olditem, newitem, category):
	theData.update({'name': category}, {'$pull': {'items': olditem}})
	theData.update({'name': category}, {'$push': {'items': newitem}})
	return 'success'

@app.route('/deleteItem/<category>/<item>')
def deleteItem(item, category):
	theData.update({'name': category}, {'$pull': {'items': item}})
	return 'success'

@app.route('/newList/<title>')
def newList(title):
	theData.save({'name': title}, {'items': []})
	return 'success'

@app.route('/deleteList/<title>')
def deleteList(title):
	theData.remove({'name': title});
	return 'success'

@app.route('/listsJSON')
def getLists():
	IDs = theData.find().distinct('_id')

	list_names = []
	list_of_lists = { }

	for id in IDs:
		name = theData.find({'_id': id}).distinct('name')[0]
		list_names.append(name)
		list_of_lists[name] = theData.find({'_id': id}).distinct('items')

	return jsonify(list_of_lists)

if __name__ == '__main__':
    app.run(debug=True)