document.addEventListener('DOMContentLoaded', function() {
    // Load and display the username
    const username = localStorage.getItem('username') || 'User';
    document.getElementById('usernameDisplay').textContent = username;

    // Initialize data
    initializeData();
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('shifted');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function saveStudent() {
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const studentAddress = document.getElementById('studentAddress').value;
    const studentGender = document.getElementById('studentGender').value;
    const classSelect = document.getElementById('classSelect').value;

    let students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    if (studentId) {
        // Edit existing student
        const studentIndex = students.findIndex(s => s.id === studentId);
        if (studentIndex > -1) {
            students[studentIndex] = { id: studentId, name: studentName, address: studentAddress, gender: studentGender };
        }
    } else {
        // Add new student
        const newStudentId = `student-${Date.now()}`;
        students.push({ id: newStudentId, name: studentName, address: studentAddress, gender: studentGender });
    }

    localStorage.setItem(`students-${classSelect}`, JSON.stringify(students));
    initializeData();
    showPage('students');
}

function updateStudentList() {
    const classSelect = document.getElementById('classSelect').value;
    const studentListContainer = document.getElementById('studentListContainer');
    const students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];

    studentListContainer.innerHTML = `
        <h2>Daftar Siswa Kelas ${classSelect}</h2>
        <input type="text" id="searchStudent" oninput="searchStudent()" placeholder="Cari siswa...">
        <table>
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Alamat</th>
                    <th>Jenis Kelamin</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.address}</td>
                        <td>${student.gender}</td>
                        <td>
                            <button onclick="editStudent('${student.id}')">Edit</button>
                            <button onclick="deleteStudent('${student.id}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function searchStudent() {
    const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
    const classSelect = document.getElementById('classSelect').value;
    const students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    
    const filteredStudents = students.filter(student => student.name.toLowerCase().includes(searchTerm));
    updateStudentTable(filteredStudents);
}

function updateStudentTable(students) {
    const studentListContainer = document.getElementById('studentListContainer');
    studentListContainer.innerHTML = `
        <h2>Daftar Siswa</h2>
        <table>
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Alamat</th>
                    <th>Jenis Kelamin</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.address}</td>
                        <td>${student.gender}</td>
                        <td>
                            <button onclick="editStudent('${student.id}')">Edit</button>
                            <button onclick="deleteStudent('${student.id}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editStudent(studentId) {
    const classSelect = document.getElementById('classSelect').value;
    const students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    const student = students.find(s => s.id === studentId);

    if (student) {
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentAddress').value = student.address;
        document.getElementById('studentGender').value = student.gender;
    }
}

function deleteStudent(studentId) {
    const classSelect = document.getElementById('classSelect').value;
    let students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem(`students-${classSelect}`, JSON.stringify(students));
    updateStudentList();
}

function saveAttendance() {
    const attendanceId = document.getElementById('attendanceId').value;
    const attendanceDate = document.getElementById('attendanceDate').value;
    const attendanceStatus = document.getElementById('attendanceStatus').value;
    const attendanceClassSelect = document.getElementById('attendanceClassSelect').value;
    const attendanceStudent = document.getElementById('attendanceStudent').value;

    let attendances = JSON.parse(localStorage.getItem(`attendances-${attendanceClassSelect}`)) || [];
    if (attendanceId) {
        // Edit existing attendance
        const attendanceIndex = attendances.findIndex(a => a.id === attendanceId);
        if (attendanceIndex > -1) {
            attendances[attendanceIndex] = { id: attendanceId, student: attendanceStudent, date: attendanceDate, status: attendanceStatus };
        }
    } else {
        // Add new attendance
        const newAttendanceId = `attendance-${Date.now()}`;
        attendances.push({ id: newAttendanceId, student: attendanceStudent, date: attendanceDate, status: attendanceStatus });
    }

    localStorage.setItem(`attendances-${attendanceClassSelect}`, JSON.stringify(attendances));
    updateAttendanceList();
}

function updateAttendanceStudentList() {
    const classSelect = document.getElementById('attendanceClassSelect').value;
    const studentSelect = document.getElementById('attendanceStudent');
    const students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    
    studentSelect.innerHTML = students.map(student => `<option value="${student.name}">${student.name}</option>`).join('');
}

function searchAttendance() {
    const searchTerm = document.getElementById('searchAttendance').value.toLowerCase();
    const classSelect = document.getElementById('attendanceClassSelect').value;
    const attendances = JSON.parse(localStorage.getItem(`attendances-${classSelect}`)) || [];
    
    const filteredAttendances = attendances.filter(attendance => 
        attendance.student.toLowerCase().includes(searchTerm) ||
        attendance.date.includes(searchTerm) ||
        attendance.status.toLowerCase().includes(searchTerm)
    );
    updateAttendanceTable(filteredAttendances);
}

function updateAttendanceTable(attendances) {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = attendances.map(attendance => `
        <tr>
            <td>${attendance.student}</td>
            <td>${attendance.date}</td>
            <td>${attendance.status}</td>
            <td>
                <button onclick="editAttendance('${attendance.id}')">Edit</button>
                <button onclick="deleteAttendance('${attendance.id}')">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function editAttendance(attendanceId) {
    const classSelect = document.getElementById('attendanceClassSelect').value;
    const attendances = JSON.parse(localStorage.getItem(`attendances-${classSelect}`)) || [];
    const attendance = attendances.find(a => a.id === attendanceId);

    if (attendance) {
        document.getElementById('attendanceId').value = attendance.id;
        document.getElementById('attendanceStudent').value = attendance.student;
        document.getElementById('attendanceDate').value = attendance.date;
        document.getElementById('attendanceStatus').value = attendance.status;
    }
}

function deleteAttendance(attendanceId) {
    const classSelect = document.getElementById('attendanceClassSelect').value;
    let attendances = JSON.parse(localStorage.getItem(`attendances-${classSelect}`)) || [];
    attendances = attendances.filter(a => a.id !== attendanceId);
    localStorage.setItem(`attendances-${classSelect}`, JSON.stringify(attendances));
    updateAttendanceList();
}

function updateAttendanceList() {
    const classSelect = document.getElementById('attendanceClassSelect').value;
    const attendanceList = JSON.parse(localStorage.getItem(`attendances-${classSelect}`)) || [];
    updateAttendanceTable(attendanceList);
}

function initializeData() {
    updateStudentList();
    updateAttendanceList();
}
function logout() {
    // Clear user-related data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('userData'); // Add any other items you need to clear

    // Redirect to the login page
    window.location.href = 'login.html'; // Change 'login.html' to the actual path of your login page
}



document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const newRole = document.getElementById('newRole').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username: newUsername, password: newPassword, role: newRole });
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('addUserForm').reset();
    loadUsers();
});

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Username: ${user.username}, Role: ${user.role}</span>
            <div>
                <button class="edit-btn" onclick="editUser(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${index})">Hapus</button>
            </div>
        `;
        userList.appendChild(li);
    });
}

function editUser(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users[index];

    const newUsername = prompt("Masukkan username baru:", user.username);
    const newPassword = prompt("Masukkan password baru:", user.password);
    const newRole = prompt("Masukkan peran baru (admin/user):", user.role);

    if (newUsername && newPassword && newRole) {
        users[index] = { username: newUsername, password: newPassword, role: newRole };
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
}

function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
}

function displayWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (currentUser && currentUser.role === 'admin') {
        welcomeMessage.textContent = ` ${currentUser.username}`;
    }
}

window.onload = function() {
    loadUsers();
    displayWelcomeMessage();
}


document.addEventListener('DOMContentLoaded', function() {
    // Load and display the username
    const username = localStorage.getItem('username') || 'User';
    document.getElementById('usernameDisplay').textContent = username;

    // Initialize data
    initializeData();
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('shifted');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function initializeData() {
    updateStudentList();
    updateAttendanceList();
    updateAssessmentList();
}

function saveStudent() {
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const studentAddress = document.getElementById('studentAddress').value;
    const studentGender = document.getElementById('studentGender').value;
    const classSelect = document.getElementById('classSelect').value;

    let students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    if (studentId) {
        // Edit existing student
        const studentIndex = students.findIndex(s => s.id === studentId);
        if (studentIndex > -1) {
            students[studentIndex] = { id: studentId, name: studentName, address: studentAddress, gender: studentGender };
        }
    } else {
        // Add new student
        const newStudentId = `student-${Date.now()}`;
        students.push({ id: newStudentId, name: studentName, address: studentAddress, gender: studentGender });
    }

    localStorage.setItem(`students-${classSelect}`, JSON.stringify(students));
    initializeData();
    showPage('students');
}

function updateStudentList() {
    const classSelect = document.getElementById('classSelect').value;
    const studentListContainer = document.getElementById('studentListContainer');
    const students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];

    studentListContainer.innerHTML = `
        <h2>Daftar Siswa Kelas ${classSelect}</h2>
        <input type="text" id="searchStudent" oninput="searchStudent()" placeholder="Cari siswa...">
        <table>
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Alamat</th>
                    <th>Jenis Kelamin</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.address}</td>
                        <td>${student.gender}</td>
                        <td>
                            <button onclick="editStudent('${student.id}')">Edit</button>
                            <button onclick="deleteStudent('${student.id}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function searchStudent() {
    const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
    const classSelect = document.getElementById('classSelect').value;
    const students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    
    const filteredStudents = students.filter(student => student.name.toLowerCase().includes(searchTerm));
    updateStudentTable(filteredStudents);
}

function updateStudentTable(students) {
    const studentListContainer = document.getElementById('studentListContainer');
    studentListContainer.innerHTML = `
        <h2>Daftar Siswa</h2>
        <table>
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Alamat</th>
                    <th>Jenis Kelamin</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.address}</td>
                        <td>${student.gender}</td>
                        <td>
                            <button onclick="editStudent('${student.id}')">Edit</button>
                            <button onclick="deleteStudent('${student.id}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editStudent(studentId) {
    const classSelect = document.getElementById('classSelect').value;
    const students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    const student = students.find(s => s.id === studentId);

    if (student) {
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentAddress').value = student.address;
        document.getElementById('studentGender').value = student.gender;
    }
}

function deleteStudent(studentId) {
    const classSelect = document.getElementById('classSelect').value;
    let students = JSON.parse(localStorage.getItem(`students-${classSelect}`)) || [];
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem(`students-${classSelect}`, JSON.stringify(students));
    updateStudentList();
}

function saveAttendance() {
    const attendanceId = document.getElementById('attendanceId').value;
    const attendanceDate = document.getElementById('attendanceDate').value;
    const attendanceStatus = document.getElementById('attendanceStatus').value;
    const attendanceClassSelect = document.getElementById('attendanceClassSelect').value;
    const attendanceStudent = document.getElementById('attendanceStudent').value;

    let attendances = JSON.parse(localStorage.getItem(`attendances-${attendanceClassSelect}`)) || [];
    if (attendanceId) {
        // Edit existing attendance
        const attendanceIndex = attendances.findIndex(a => a.id === attendanceId);
        if (attendanceIndex > -1) {
            attendances[attendanceIndex] = { id: attendanceId, date: attendanceDate, status: attendanceStatus, student: attendanceStudent };
        }
    } else {
        // Add new attendance
        const newAttendanceId = `attendance-${Date.now()}`;
        attendances.push({ id: newAttendanceId, date: attendanceDate, status: attendanceStatus, student: attendanceStudent });
    }

    localStorage.setItem(`attendances-${attendanceClassSelect}`, JSON.stringify(attendances));
    initializeData();
    showPage('attendance');
}

function updateAttendanceList() {
    const attendanceClassSelect = document.getElementById('attendanceClassSelect').value;
    const attendanceListContainer = document.getElementById('attendanceListContainer');
    const attendances = JSON.parse(localStorage.getItem(`attendances-${attendanceClassSelect}`)) || [];

    attendanceListContainer.innerHTML = `
        <h2>Daftar Kehadiran Kelas ${attendanceClassSelect}</h2>
        <input type="text" id="searchAttendance" oninput="searchAttendance()" placeholder="Cari kehadiran...">
        <table>
            <thead>
                <tr>
                    <th>Siswa</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${attendances.map(attendance => `
                    <tr>
                        <td>${attendance.student}</td>
                        <td>${attendance.date}</td>
                        <td>${attendance.status}</td>
                        <td>
                            <button onclick="editAttendance('${attendance.id}')">Edit</button>
                            <button onclick="deleteAttendance('${attendance.id}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function searchAttendance() {
    const searchTerm = document.getElementById('searchAttendance').value.toLowerCase();
    const attendanceClassSelect = document.getElementById('attendanceClassSelect').value;
    const attendances = JSON.parse(localStorage.getItem(`attendances-${attendanceClassSelect}`)) || [];
    
    const filteredAttendances = attendances.filter(attendance => attendance.student.toLowerCase().includes(searchTerm));
    updateAttendanceTable(filteredAttendances);
}

function updateAttendanceTable(attendances) {
    const attendanceListContainer = document.getElementById('attendanceListContainer');
    attendanceListContainer.innerHTML = `
        <h2>Daftar Kehadiran</h2>
        <table>
            <thead>
                <tr>
                    <th>Siswa</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${attendances.map(attendance => `
                    <tr>
                        <td>${attendance.student}</td>
                        <td>${attendance.date}</td>
                        <td>${attendance.status}</td>
                        <td>
                            <button onclick="editAttendance('${attendance.id}')">Edit</button>
                            <button onclick="deleteAttendance('${attendance.id}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editAttendance(attendanceId) {
    const attendanceClassSelect = document.getElementById('attendanceClassSelect').value;
    const attendances = JSON.parse(localStorage.getItem(`attendances-${attendanceClassSelect}`)) || [];
    const attendance = attendances.find(a => a.id === attendanceId);

    if (attendance) {
        document.getElementById('attendanceId').value = attendance.id;
        document.getElementById('attendanceDate').value = attendance.date;
        document.getElementById('attendanceStatus').value = attendance.status;
        document.getElementById('attendanceStudent').value = attendance.student;
    }
}

function deleteAttendance(attendanceId) {
    const attendanceClassSelect = document.getElementById('attendanceClassSelect').value;
    let attendances = JSON.parse(localStorage.getItem(`attendances-${attendanceClassSelect}`)) || [];
    attendances = attendances.filter(a => a.id !== attendanceId);
    localStorage.setItem(`attendances-${attendanceClassSelect}`, JSON.stringify(attendances));
    updateAttendanceList();
}

function saveAssessment() {
    const assessmentId = document.getElementById('assessmentId').value;
    const assessmentClassSelect = document.getElementById('assessmentClassSelect').value;
    const assessmentStudent = document.getElementById('assessmentStudent').value;
    const assessmentDate = document.getElementById('assessmentDate').value;
    const assessmentScore = document.getElementById('assessmentScore').value;

    let assessments = JSON.parse(localStorage.getItem(`assessments-${assessmentClassSelect}`)) || [];
    if (assessmentId) {
        // Edit existing assessment
        const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
        if (assessmentIndex > -1) {
            assessments[assessmentIndex] = { id: assessmentId, student: assessmentStudent, date: assessmentDate, score: assessmentScore };
        }
    } else {
        // Add new assessment
        const newAssessmentId = `assessment-${Date.now()}`;
        assessments.push({ id: newAssessmentId, student: assessmentStudent, date: assessmentDate, score: assessmentScore });
    }

    localStorage.setItem(`assessments-${assessmentClassSelect}`, JSON.stringify(assessments));
    updateAssessmentList();
}

function updateAssessmentList() {
    const assessmentClassSelect = document.getElementById('assessmentClassSelect').value;
    const assessmentList = document.getElementById('assessmentList');
    const assessments = JSON.parse(localStorage.getItem(`assessments-${assessmentClassSelect}`)) || [];

    assessmentList.innerHTML = assessments.map(assessment => `
        <tr>
            <td>${assessment.student}</td>
            <td>${assessment.date}</td>
            <td>${assessment.score}</td>
            <td>
                <button onclick="editAssessment('${assessment.id}')">Edit</button>
                <button onclick="deleteAssessment('${assessment.id}')">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function searchAssessment() {
    const searchTerm = document.getElementById('searchAssessment').value.toLowerCase();
    const assessmentClassSelect = document.getElementById('assessmentClassSelect').value;
    const assessments = JSON.parse(localStorage.getItem(`assessments-${assessmentClassSelect}`)) || [];
    
    const filteredAssessments = assessments.filter(assessment => assessment.student.toLowerCase().includes(searchTerm));
    updateAssessmentTable(filteredAssessments);
}

function updateAssessmentTable(assessments) {
    const assessmentList = document.getElementById('assessmentList');
    assessmentList.innerHTML = assessments.map(assessment => `
        <tr>
            <td>${assessment.student}</td>
            <td>${assessment.date}</td>
            <td>${assessment.score}</td>
            <td>
                <button onclick="editAssessment('${assessment.id}')">Edit</button>
                <button onclick="deleteAssessment('${assessment.id}')">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function editAssessment(assessmentId) {
    const assessmentClassSelect = document.getElementById('assessmentClassSelect').value;
    const assessments = JSON.parse(localStorage.getItem(`assessments-${assessmentClassSelect}`)) || [];
    const assessment = assessments.find(a => a.id === assessmentId);

    if (assessment) {
        document.getElementById('assessmentId').value = assessment.id;
        document.getElementById('assessmentStudent').value = assessment.student;
        document.getElementById('assessmentDate').value = assessment.date;
        document.getElementById('assessmentScore').value = assessment.score;
    }
}

function deleteAssessment(assessmentId) {
    const assessmentClassSelect = document.getElementById('assessmentClassSelect').value;
    let assessments = JSON.parse(localStorage.getItem(`assessments-${assessmentClassSelect}`)) || [];
    assessments = assessments.filter(a => a.id !== assessmentId);
    localStorage.setItem(`assessments-${assessmentClassSelect}`, JSON.stringify(assessments));
    updateAssessmentList();
}

function updateAssessmentStudentList() {
    const assessmentClassSelect = document.getElementById('assessmentClassSelect').value;
    const assessmentStudent = document.getElementById('assessmentStudent');
    const students = JSON.parse(localStorage.getItem(`students-${assessmentClassSelect}`)) || [];

    assessmentStudent.innerHTML = students.map(student => `<option value="${student.name}">${student.name}</option>`).join('');
}



document.addEventListener('DOMContentLoaded', () => {
    loadSummary();
});

function loadSummary() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    // Inisialisasi jumlah siswa per kelas
    const classCounts = {
        '7A': 0, '7B': 0, '7C': 0, '7D': 0,
        '8A': 0, '8B': 0, '8C': 0, '8D': 0,
        '9A': 0, '9B': 0, '9C': 0, '9D': 0
    };

    // Hitung jumlah siswa per kelas
    students.forEach(student => {
        if (classCounts[student.class]) {
            classCounts[student.class]++;
        }
    });

    // Update ringkasan jumlah siswa di Dashboard
    for (const [key, count] of Object.entries(classCounts)) {
        const summaryElement = document.getElementById(`summary-${key}`);
        if (summaryElement) {
            summaryElement.textContent = `${count} Siswa`;
        }
    }
}

function clearAllData() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
        localStorage.removeItem('students');
        loadSummary();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = page.id === pageId ? 'block' : 'none';
    });
}

function saveStudent() {
    const id = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const studentAddress = document.getElementById('studentAddress').value;
    const studentGender = document.getElementById('studentGender').value;
    const studentClass = document.getElementById('classSelect').value;

    let students = JSON.parse(localStorage.getItem('students')) || [];
    
    if (id) {
        // Update existing student
        const index = students.findIndex(student => student.id === id);
        if (index > -1) {
            students[index] = { id, name: studentName, address: studentAddress, gender: studentGender, class: studentClass };
        }
    } else {
        // Add new student
        const newStudent = { id: Date.now().toString(), name: studentName, address: studentAddress, gender: studentGender, class: studentClass };
        students.push(newStudent);
    }

    localStorage.setItem('students', JSON.stringify(students));
    loadSummary();
    updateStudentList();
    document.getElementById('studentForm').reset();
}

function searchStudent() {
    const searchValue = document.getElementById('searchStudent').value.toLowerCase();
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const filteredStudents = students.filter(student => student.name.toLowerCase().includes(searchValue));
    updateStudentList(filteredStudents);
}

function updateStudentList(studentsToDisplay = null) {
    const students = studentsToDisplay || JSON.parse(localStorage.getItem('students')) || [];
    const classTables = document.getElementById('classTables');
    classTables.innerHTML = '';

    const classes = ['7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D'];
    
    classes.forEach(className => {
        const studentsInClass = students.filter(student => student.class === className);
        const table = document.createElement('table');
        table.innerHTML = `<thead><tr><th>Nama</th><th>Alamat</th><th>Jenis Kelamin</th><th>Aksi</th></tr></thead><tbody>`;
        
        studentsInClass.forEach(student => {
            table.innerHTML += `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.address}</td>
                    <td>${student.gender}</td>
                    <td>
                        <button onclick="editStudent('${student.id}')">Edit</button>
                        <button onclick="deleteStudent('${student.id}')">Hapus</button>
                    </td>
                </tr>`;
        });

        table.innerHTML += `</tbody>`;
        const classContainer = document.createElement('div');
        classContainer.className = 'class-container';
        classContainer.innerHTML = `<h3>${className}</h3>`;
        classContainer.appendChild(table);
        classTables.appendChild(classContainer);
    });
}

function editStudent(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.id === studentId);
    if (student) {
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentAddress').value = student.address;
        document.getElementById('studentGender').value = student.gender;
        document.getElementById('classSelect').value = student.class;
    }
}

function deleteStudent(studentId) {
    if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.filter(student => student.id !== studentId);
        localStorage.setItem('students', JSON.stringify(students));
        loadSummary();
        updateStudentList();
    }
}

function logout() {
    // Implement logout logic
}
