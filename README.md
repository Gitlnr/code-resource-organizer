# Code Resource Organizer

## Introduction
The Code Resource Organizer is a web application designed to help users efficiently organize their coding resources, including titles, items, and links.

## File Structure
1. app.py: Main Flask application script
2. static/: Directory for static assets:
  2.1. css/: Contains CSS files (base_style.css,item_detail_style.css)
  2.2. js/: Contains JavaScript files (base_script.js,item_detail_script.js)
  2.3. media/: Contains media files (planet5.jpg)
3. templates/: Directory for HTML templates (base.html,index.html,item_detail.html)
4.requirements.txt: File listing Python dependencies required by the application

This commit sets up the initial project structure and essential files for a Flask application.
## Installation
1. Clone the repository:
   git clone https://github.com/Gitlnr/code-resource-organizer.git
2. cd code-resource-organizer  
3. Install dependencies: 
   pip install -r requirements.txt

## Usage
1. Run the Flask application:
   python app.py
2. Open your web browser and navigate to http://localhost to access the Code Resource Organizer.

## Features
1. Add Titles: Organize your coding resources into titled categories.
2. Add Items: Populate each title with specific coding items.
3. Add Links: Attach links to items for quick access to resources.

## Troubleshooting
1. If you encounter any issues, check the browser console for errors.
2. Ensure all dependencies are correctly installed as per requirements.txt.
