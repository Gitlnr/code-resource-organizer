from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

# App version 
app.config['APP_VERSION'] = '1.0.0.0'

# In-memory storage for titles and items
titles = ["Data Structure","Algorithm","Tutorial Links"]
items = {
    "Data Structure": ["Array", "Maps", "Linked List", "Binary"],
    "Algorithm": ["Bubble Sort", "Insertion Sort", "Merge Sort"],
    "Tutorial Links": ["CodeChef", "Codecademy", "W3schools"]
}

@app.route('/')
def index():
    return render_template('index.html', titles=titles, items=items)

@app.route('/add_title', methods=['POST'])
def add_title():
    new_title = request.form['newTitle']
    if new_title and new_title not in titles:
        titles.append(new_title)
        items[new_title] = []
    return redirect(url_for('index'))

@app.route('/edit_title', methods=['POST'])
def edit_title():
    old_title = request.form['oldTitle']
    new_title = request.form['newTitle']
    if old_title in titles and new_title:
        titles[titles.index(old_title)] = new_title
        items[new_title] = items.pop(old_title)
    return redirect(url_for('index'))

@app.route('/delete_title', methods=['POST'])
def delete_title():
    title_to_delete = request.form['titleToDelete']
    if title_to_delete in titles:
        titles.remove(title_to_delete)
        items.pop(title_to_delete, None)
    return redirect(url_for('index'))

@app.route('/add_item', methods=['POST'])
def add_item():
    title = request.form['itemTitle']
    new_item = request.form['newItem']
    if title in titles and new_item:
        items[title].append(new_item)
    return redirect(url_for('index'))

@app.route('/edit_item', methods=['POST'])
def edit_item():
    title = request.form['editItemTitle']
    old_item = request.form['oldItem']
    new_item = request.form['newItem']
    if title in titles and old_item in items[title] and new_item:
        items[title][items[title].index(old_item)] = new_item
    return redirect(url_for('index'))

@app.route('/delete_item', methods=['POST'])
def delete_item():
    title = request.form['title']
    item_to_delete = request.form['item']
    if title in titles and item_to_delete in items[title]:
        items[title].remove(item_to_delete)
    return redirect(url_for('index'))

@app.route('/get_items/<title>', methods=['GET'])
def get_items(title):
    if title in items:
        return jsonify({"items": items[title]})
    return jsonify({"items": []})


@app.route('/item/<title>/<item>')
def item_detail(title, item):
    if title in items and item in items[title]:
        return render_template('item_detail.html', title=title, item=item)
    return "Item not found", 404

@app.route('/')
def index():
    return render_template('index.html', version=app.config['APP_VERSION'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
