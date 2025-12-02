from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
import json
import os
import uuid
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename

app = Flask(__name__)
DATA_FILE = "tasks.json"
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {
    'png', 'jpg', 'jpeg', 'gif',  # Images
    'pdf', 'doc', 'docx', 'xls', 'xlsx',  # Documents
    'txt', 'md',  # Text files
    'zip', 'rar'  # Archives
}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Daftar jenis tugas yang available
JENIS_TUGAS = [
    "Tugas 1", "Tugas 2", "Tugas 3", "Tugas 4", "Tugas 5",
    "Tugas 6", "Tugas 7", "Tugas 8", "Tugas 9", "Tugas 10",
    "Tugas 11", "Tugas 12", "Tugas 13", "Tugas 14", "Tugas 15",                                             
    "UTS", "UAS", "Kuis", "Project", "Presentasi",
    "Laporan", "Essay", "Resume", "Other"
]

# Pastikan folder uploads ada
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_icon(filename):
    """Get icon based on file extension"""
    if not filename:
        return "📄"
    
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    icon_map = {
        'png': '🖼️', 'jpg': '🖼️', 'jpeg': '🖼️', 'gif': '🖼️',
        'pdf': '📕', 'doc': '📘', 'docx': '📘', 'xls': '📗', 'xlsx': '📗',
        'txt': '📝', 'md': '📝', 'zip': '🗜️', 'rar': '🗜️'
    }
    
    return icon_map.get(ext, '📄')

def load_tasks():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)
    
    try:
        with open(DATA_FILE, 'r') as f:
            tasks = json.load(f)
            # Calculate priority and remaining days for each task
            for task in tasks:
                task['priority'] = calculate_priority(task)
                task['remaining_days'] = calculate_remaining_days(task)
                
                # Get file icon for each attachment
                if 'attachments' in task:
                    for attachment in task['attachments']:
                        attachment['icon'] = get_file_icon(attachment['filename'])
            return tasks
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_tasks(tasks):
    with open(DATA_FILE, 'w') as f:
        json.dump(tasks, f, indent=2, ensure_ascii=False)

def calculate_priority(task):
    """Calculate priority based on deadline proximity"""
    if not task.get('deadline') or task.get('selesai', False):
        return "low"
    
    try:
        # Parse deadline with time
        deadline = datetime.strptime(task['deadline'], '%Y-%m-%dT%H:%M')
        today = datetime.now()
        
        # Calculate total hours until deadline (more precise)
        hours_until_deadline = (deadline - today).total_seconds() / 3600
        
        if hours_until_deadline <= 48:  # 2 days in hours
            return "high"
        elif hours_until_deadline <= 168:  # 7 days in hours
            return "medium"
        else:
            return "low"
    except:
        return "low"

def calculate_remaining_days(task):
    """Calculate remaining days until deadline (more precise)"""
    if not task.get('deadline') or task.get('selesai', False):
        return None
    
    try:
        # Parse deadline with time
        deadline = datetime.strptime(task['deadline'], '%Y-%m-%dT%H:%M')
        today = datetime.now()
        
        # Calculate remaining time in days (with decimal for precision)
        remaining_time = deadline - today
        remaining_days = remaining_time.total_seconds() / (24 * 3600)
        
        # Return as integer for display, but use decimal for calculation
        return int(remaining_days) if remaining_days > 0 else int(remaining_days)
    except:
        return None

def get_priority_info(priority):
    """Get priority display information"""
    priority_map = {
        "high": {"label": "🔴 Tinggi", "color": "#dc3545", "order": 1},
        "medium": {"label": "🟡 Sedang", "color": "#ffc107", "order": 2},
        "low": {"label": "🟢 Rendah", "color": "#28a745", "order": 3}
    }
    return priority_map.get(priority, priority_map["low"])

def get_remaining_days_info(remaining_days):
    """Get remaining days display information"""
    if remaining_days is None:
        return {"label": "Tidak ada deadline", "color": "#6c757d", "type": "no_deadline"}
    
    if remaining_days < 0:
        return {"label": f"⏰ Terlambat {abs(remaining_days)} hari", "color": "#dc3545", "type": "overdue"}
    elif remaining_days == 0:
        return {"label": "⏰ Deadline hari ini!", "color": "#dc3545", "type": "today"}
    elif remaining_days == 1:
        return {"label": "⏰ 1 hari lagi", "color": "#fd7e14", "type": "tomorrow"}
    elif remaining_days <= 7:
        return {"label": f"⏰ {remaining_days} hari lagi", "color": "#ffc107", "type": "this_week"}
    else:
        return {"label": f"📅 {remaining_days} hari lagi", "color": "#28a745", "type": "future"}

@app.route('/')
def index():
    tasks = load_tasks()
    search_query = request.args.get('search', '')
    filter_priority = request.args.get('priority', '')
    filter_matkul = request.args.get('matkul', '')
    show_completed = request.args.get('show_completed', 'false') == 'true'
    
    # Filter tasks based on search and filters
    filtered_tasks = tasks
    
    if search_query:
        filtered_tasks = [task for task in filtered_tasks 
                         if search_query.lower() in task['matkul'].lower() 
                         or search_query.lower() in task['judul'].lower()
                         or search_query.lower() in task['deskripsi'].lower()
                         or search_query.lower() in task['jenis_tugas'].lower()]
    
    if filter_priority:
        filtered_tasks = [task for task in filtered_tasks 
                         if task['priority'] == filter_priority]
    
    if filter_matkul:
        filtered_tasks = [task for task in filtered_tasks 
                         if task['matkul'] == filter_matkul]
    
    # Separate completed and active tasks
    active_tasks = [task for task in filtered_tasks if not task['selesai']]
    completed_tasks = [task for task in filtered_tasks if task['selesai']]
    
    # Sort active tasks by priority (high first) and then by deadline
    active_tasks.sort(key=lambda x: (
        get_priority_info(x['priority'])['order'],  # High priority first
        x['deadline'] if x['deadline'] else '9999-12-31T23:59'  # Soonest deadline first
    ))
    
    # Sort completed tasks by completion date (newest first)
    completed_tasks.sort(key=lambda x: x.get('completed_at', ''), reverse=True)
    
    # Group active tasks by mata kuliah
    active_tasks_by_matkul = {}
    for task in active_tasks:
        matkul = task['matkul']
        if matkul not in active_tasks_by_matkul:
            active_tasks_by_matkul[matkul] = []
        active_tasks_by_matkul[matkul].append(task)
    
    # Group completed tasks by mata kuliah
    completed_tasks_by_matkul = {}
    for task in completed_tasks:
        matkul = task['matkul']
        if matkul not in completed_tasks_by_matkul:
            completed_tasks_by_matkul[matkul] = []
        completed_tasks_by_matkul[matkul].append(task)
    
    # Get unique mata kuliah for filter
    unique_matkul = sorted(list(set(task['matkul'] for task in tasks)))
    
    return render_template('index.html', 
                         tasks=filtered_tasks,
                         active_tasks_by_matkul=active_tasks_by_matkul,
                         completed_tasks_by_matkul=completed_tasks_by_matkul,
                         active_tasks_count=len(active_tasks),
                         completed_tasks_count=len(completed_tasks),
                         jenis_tugas=JENIS_TUGAS,
                         search_query=search_query,
                         filter_priority=filter_priority,
                         filter_matkul=filter_matkul,
                         show_completed=show_completed,
                         unique_matkul=unique_matkul,
                         get_priority_info=get_priority_info,
                         get_remaining_days_info=get_remaining_days_info,
                         datetime=datetime,
                         allowed_file=allowed_file,
                         get_file_icon=get_file_icon)

@app.route('/add', methods=['POST'])
def add_task():
    matkul = request.form['matkul']
    jenis_tugas = request.form['jenis_tugas']
    judul = request.form['judul']
    deskripsi = request.form['deskripsi']
    deadline_date = request.form['deadline_date']
    deadline_time = request.form['deadline_time']
    
    # Combine date and time
    deadline = f"{deadline_date}T{deadline_time}" if deadline_date and deadline_time else None
    
    tasks = load_tasks()
    
    # Cari ID terbesar
    if tasks:
        max_id = max(task['id'] for task in tasks)
    else:
        max_id = 0
    
    new_task = {
        'id': max_id + 1,
        'matkul': matkul,
        'jenis_tugas': jenis_tugas,
        'judul': judul,
        'deskripsi': deskripsi,
        'deadline': deadline,
        'selesai': False,
        'created_at': datetime.now().strftime("%Y-%m-%d %H:%M"),
        'priority': 'low',
        'remaining_days': None,
        'attachments': []
    }
    
    # Handle file uploads
    if 'attachments' in request.files:
        files = request.files.getlist('attachments')
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                # Generate unique filename
                original_filename = secure_filename(file.filename)
                file_extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
                unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
                
                # Save file
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)
                
                # Add attachment info to task
                new_task['attachments'].append({
                    'id': str(uuid.uuid4()),
                    'filename': original_filename,
                    'unique_filename': unique_filename,
                    'uploaded_at': datetime.now().strftime("%Y-%m-%d %H:%M"),
                    'size': os.path.getsize(file_path)
                })
    
    tasks.append(new_task)
    save_tasks(tasks)
    
    return redirect(url_for('index'))

@app.route('/edit/<int:task_id>', methods=['GET', 'POST'])
def edit_task(task_id):
    tasks = load_tasks()
    task = next((task for task in tasks if task['id'] == task_id), None)
    
    if not task:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        # Update task data
        task['matkul'] = request.form['matkul']
        task['jenis_tugas'] = request.form['jenis_tugas']
        task['judul'] = request.form['judul']
        task['deskripsi'] = request.form['deskripsi']
        
        deadline_date = request.form['deadline_date']
        deadline_time = request.form['deadline_time']
        
        # Combine date and time
        if deadline_date and deadline_time:
            task['deadline'] = f"{deadline_date}T{deadline_time}"
        else:
            task['deadline'] = None
        
        task['updated_at'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        # Handle file uploads for edit
        if 'attachments' in request.files:
            files = request.files.getlist('attachments')
            for file in files:
                if file and file.filename and allowed_file(file.filename):
                    # Generate unique filename
                    original_filename = secure_filename(file.filename)
                    unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
                    
                    # Save file
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                    file.save(file_path)
                    
                    # Add attachment info to task
                    if 'attachments' not in task:
                        task['attachments'] = []
                    
                    task['attachments'].append({
                        'id': str(uuid.uuid4()),
                        'filename': original_filename,
                        'unique_filename': unique_filename,
                        'uploaded_at': datetime.now().strftime("%Y-%m-%d %H:%M"),
                        'size': os.path.getsize(file_path)
                    })
        
        save_tasks(tasks)
        return redirect(url_for('index'))
    
    # Pre-fill form with existing data
    deadline_date = ""
    deadline_time = "23:59"  # Default time
    if task.get('deadline'):
        try:
            deadline_datetime = datetime.strptime(task['deadline'], '%Y-%m-%dT%H:%M')
            deadline_date = deadline_datetime.strftime('%Y-%m-%d')
            deadline_time = deadline_datetime.strftime('%H:%M')
        except:
            pass
    
    return render_template('edit_task.html', 
                         task=task, 
                         jenis_tugas=JENIS_TUGAS,
                         deadline_date=deadline_date,
                         deadline_time=deadline_time,
                         datetime=datetime,
                         get_file_icon=get_file_icon)

@app.route('/complete/<int:task_id>')
def complete_task(task_id):
    tasks = load_tasks()
    for task in tasks:
        if task['id'] == task_id:
            task['selesai'] = True
            task['completed_at'] = datetime.now().strftime("%Y-%m-%d %H:%M")
            break
    
    save_tasks(tasks)
    return redirect(url_for('index'))

@app.route('/delete/<int:task_id>')
def delete_task(task_id):
    tasks = load_tasks()
    task_to_delete = next((task for task in tasks if task['id'] == task_id), None)
    
    if task_to_delete:
        # Delete attached files
        if 'attachments' in task_to_delete:
            for attachment in task_to_delete['attachments']:
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], attachment['unique_filename'])
                if os.path.exists(file_path):
                    os.remove(file_path)
        
        # Remove task from list
        tasks = [task for task in tasks if task['id'] != task_id]
        save_tasks(tasks)
    
    return redirect(url_for('index'))

@app.route('/delete_attachment/<int:task_id>/<attachment_id>')
def delete_attachment(task_id, attachment_id):
    tasks = load_tasks()
    task = next((task for task in tasks if task['id'] == task_id), None)
    
    if task and 'attachments' in task:
        # Find and remove the attachment
        for attachment in task['attachments']:
            if attachment['id'] == attachment_id:
                # Delete the file
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], attachment['unique_filename'])
                if os.path.exists(file_path):
                    os.remove(file_path)
                
                # Remove from list
                task['attachments'] = [a for a in task['attachments'] if a['id'] != attachment_id]
                break
        
        save_tasks(tasks)
    
    return redirect(url_for('edit_task', task_id=task_id))

@app.route('/uploads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/uncomplete/<int:task_id>')
def uncomplete_task(task_id):
    tasks = load_tasks()
    for task in tasks:
        if task['id'] == task_id:
            task['selesai'] = False
            task['completed_at'] = None
            break
    
    save_tasks(tasks)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)