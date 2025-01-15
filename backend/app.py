from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openpyxl import Workbook
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/generate-timetable', methods=['POST'])
def generate_timetable():
    try:
        files = request.files
        if not files:
            print("No files received!")
            return jsonify({'message': 'No files received'}), 400

        # Iterate through the uploaded files and save them
        for key in files:
            file = files[key]
            print(f"Received file: {file.filename}, type: {file.content_type}")

            # Check for allowed file extensions (you can modify this list)
            allowed_extensions = ['.csv', '.xlsx']
            filename = file.filename
            if not any(filename.endswith(ext) for ext in allowed_extensions):
                print(f"Invalid file type: {filename}")
                return jsonify({'message': f"Invalid file type: {filename}"}), 400

            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)
            print(f"File saved at {filepath}")

        # Simulate timetable generation logic (create a new Excel file)
        timetable_filename = 'timetable.xlsx'
        timetable_filepath = os.path.join(UPLOAD_FOLDER, timetable_filename)

        # Create a new workbook and add a sample sheet
        wb = Workbook()
        ws = wb.active
        ws.title = "Generated Timetable"

        # Add headers to the sheet
        ws.append(["Subject", "Start Time", "End Time", "Room", "Date", "Day"])

        # Sample data for timetable
        subjects = ["Math", "Science", "English", "History", "Physics"]
        start_times = ["09:00", "10:00", "11:00", "12:00", "13:00"]
        end_times = ["10:00", "11:00", "12:00", "13:00", "14:00"]
        rooms = ["Room 101", "Room 102", "Room 103", "Room 104", "Room 105"]

        # Generate dates starting from today
        exam_date = datetime.today()

        # Add rows to the sheet
        for i in range(len(subjects)):
            ws.append([
                subjects[i],
                start_times[i],
                end_times[i],
                rooms[i],
                exam_date.strftime("%Y-%m-%d"),
                exam_date.strftime("%A")  # Get the day of the week
            ])
            # Increment the date for the next exam
            exam_date += timedelta(days=1)

        # Save the timetable to the uploads folder
        wb.save(timetable_filepath)
        print(f"Timetable saved at {timetable_filepath}")

        # Return the download URL of the generated timetable
        return jsonify({'message': 'Timetable generated successfully!', 'download_url': f'/uploads/{timetable_filename}'}), 200

    except Exception as e:
        print(f"Error in generate_timetable: {e}")
        return jsonify({'message': 'Failed to generate timetable.'}), 500

@app.route('/uploads/<filename>', methods=['GET'])
def download_file(filename):
    return jsonify({'message': f'File {filename} will be served here.'})

if __name__ == '__main__':
    print("Flask server is starting...")
    app.run(debug=True)
