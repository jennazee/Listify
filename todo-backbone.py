from flask import Flask, render_template, jsonify, request
from pymongo import Connection
import json
from bson.objectid import ObjectId

app = Flask(__name__)
connection = Connection()
db = connection.test
theData = db.list2

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

@app.route('/items')
def findAllItems():
	allData = theData.find()
	toSend = []
	for el in range(allData.count()):
		curr = allData[el]
		curr['_id'] = str(curr['_id'])
		toSend.append(curr)
	return json.dumps(toSend)


@app.route('/items', methods=['POST'])
def putItems():
	returned = request.json
	objID = str(theData.save(returned))
	returned['_id']= objID
	return json.dumps(returned)

@app.route('/items/<idhash>')
def getItem(idhash):
	result = theData.find({'_id': ObjectId(idhash)})[0]
	result['_id'] = str(result['_id'])
	return json.dumps(result)

@app.route('/items/<idhash>', methods=['PUT'])
def changeItem(idhash):
	results = request.json
	results['_id'] = ObjectId(idhash)
	theData.update({'_id': ObjectId(idhash)}, results)
	frommongo = theData.find({'_id': ObjectId(idhash)})[0]
	frommongo['_id'] = str(frommongo['_id'])
	return json.dumps(frommongo)

@app.route('/items/<idhash>', methods=['DELETE'])
def removeItem(idhash):
	toReturn = theData.find({'_id': ObjectId(idhash)})[0]
	theData.remove({'_id': ObjectId(idhash)})
	toReturn['_id'] = str(toReturn['_id'])
	return json.dumps(toReturn)

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