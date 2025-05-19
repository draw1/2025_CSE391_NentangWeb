// Mảng lưu trữ danh sách công việc. Mỗi phần tử là object: { id, text, isDone }
let tasks = [];

// Biến dùng để lọc trạng thái hiển thị công việc: 'all', 'active', 'completed'
let filter = 'all';

// ============================
// HÀM THÊM CÔNG VIỆC MỚI
// ============================
function addTask() {
  const input = document.getElementById("taskInput"); // Lấy ô nhập liệu
  const taskText = input.value.trim(); // Lấy nội dung người dùng nhập, loại bỏ khoảng trắng đầu/cuối

  if (taskText === "") {
    alert("Vui lòng nhập nội dung công việc!"); // Nếu để trống thì cảnh báo
    return;
  }

  // Tạo một công việc mới dưới dạng object
  const task = {
    id: Date.now(),       // Dùng timestamp để làm ID duy nhất
    text: taskText,       // Lưu nội dung nhập vào
    isDone: false         // Mặc định là chưa hoàn thành
  };

  tasks.push(task);             // Thêm công việc vào mảng
  saveTasksToLocalStorage();    // Lưu mảng vào localStorage
  renderTasks();                // Hiển thị lại danh sách
  input.value = "";             // Xóa nội dung trong ô nhập
}

// ============================
// HÀM CHUYỂN TRẠNG THÁI HOÀN THÀNH
// ============================
function toggleDone(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, isDone: !task.isDone } : task
  );
  saveTasksToLocalStorage(); // Cập nhật lại localStorage
  renderTasks();             // Hiển thị lại danh sách
}

// ============================
// HÀM XÓA CÔNG VIỆC
// ============================
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id); // Giữ lại các task không trùng ID
  saveTasksToLocalStorage(); // Cập nhật localStorage
  renderTasks();             // Hiển thị lại danh sách
}

// ============================
// HÀM HIỂN THỊ DANH SÁCH CÔNG VIỆC
// ============================
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Xóa danh sách hiện tại

  // Áp dụng bộ lọc theo trạng thái
  let filteredTasks = tasks;
  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.isDone);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.isDone);
  }

  // Duyệt qua từng công việc để hiển thị
  filteredTasks.forEach(task => {
    const li = document.createElement("li"); // Tạo thẻ <li> cho từng công việc
    li.className = task.isDone ? "completed" : "";

    // Nội dung công việc
    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";

    // Nút "Hoàn thành" (toggle trạng thái)
    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.isDone ? "Hoàn tác" : "Hoàn thành"; // Tùy theo trạng thái
    doneBtn.className = "done-btn";
    doneBtn.onclick = () => toggleDone(task.id); // Gán sự kiện khi click

    // Nút "Xóa"
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Xóa";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(task.id);

    // Thêm các thành phần vào <li>
    li.appendChild(span);
    li.appendChild(doneBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li); // Thêm <li> vào danh sách chính
  });
}

// ============================
// HÀM THAY ĐỔI BỘ LỌC TRẠNG THÁI
// ============================
function setFilter(type) {
  filter = type;         // Gán loại lọc mới (all, active, completed)
  renderTasks();         // Hiển thị danh sách theo lọc

  // Cập nhật nút lọc đang được chọn
  document.querySelectorAll('.filter-section button').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.filter-section button[onclick="setFilter('${type}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// ============================
// HÀM LƯU DỮ LIỆU VÀO localStorage
// ============================
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ============================
// HÀM ĐỌC DỮ LIỆU TỪ localStorage
// ============================
function loadTasksFromLocalStorage() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored); // Chuyển chuỗi JSON thành mảng object
    renderTasks();              // Hiển thị danh sách từ dữ liệu cũ
  }
}

// ============================
// GỌI NGAY SAU KHI LOAD TRANG
// ============================
loadTasksFromLocalStorage(); // Đảm bảo khi reload trang, dữ liệu vẫn còn
