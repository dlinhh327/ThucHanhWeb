/* ==========================================
   MINH QUÂN: ĐĂNG NHẬP & QUẢN LÝ NGƯỜI DÙNG
   ========================================== */

function xuLyDangNhap() {
    var loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("username").value.trim();
        var password = document.getElementById("password").value;
        var loginMessage = document.getElementById("loginMessage");

        var user = users.find(function (item) {
            return item.username === username && item.password === password;
        });

        if (user) {
            currentUser = user;
            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("app").classList.remove("hidden");
            document.getElementById("currentUser").textContent = user.fullName + " - " + user.role;
            loginMessage.textContent = "";
            loginForm.reset();

            hienThiTrang("home");
            capNhatThongKe();
        } else {
            loginMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
        }
    });
}

function xuLyDangXuat() {
    var logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function () {
        currentUser = null;
        document.getElementById("app").classList.add("hidden");
        document.getElementById("loginPage").classList.remove("hidden");
        document.getElementById("loginForm").reset();
        document.getElementById("loginMessage").textContent = "";
        document.getElementById("username").focus();
    });
}

function hienThiNguoiDung() {
    var tbody = document.querySelector("#userTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    users.forEach(function (user) {
        var row = tbody.insertRow();
        row.insertCell().textContent = user.id;
        row.insertCell().textContent = user.fullName;
        row.insertCell().textContent = user.email;
        row.insertCell().textContent = user.role;

        var actionCell = row.insertCell();
        if (user.username !== "admin") {
            var xoaBtn = document.createElement("button");
            xoaBtn.textContent = "Xóa";
            xoaBtn.className = "delete-btn";
            xoaBtn.addEventListener("click", function () {
                xoaNguoiDung(user.id);
            });
            actionCell.appendChild(xoaBtn);
        } else {
            actionCell.textContent = "Tài khoản mặc định";
        }
    });
}

function xuLyThemNguoiDung() {
    var addUserBtn = document.getElementById("addUserBtn");
    var userForm = document.getElementById("userForm");
    var cancelUserBtn = document.getElementById("cancelUserBtn");

    if (!addUserBtn || !userForm) return;

    addUserBtn.addEventListener("click", function () {
        userForm.reset();
        userForm.classList.remove("hidden");
    });

    cancelUserBtn.addEventListener("click", function () {
        userForm.reset();
        userForm.classList.add("hidden");
    });

    userForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("newUsername").value.trim();
        var fullName = document.getElementById("newFullName").value.trim();
        var email = document.getElementById("newEmail").value.trim();
        var role = document.getElementById("newRole").value;
        var password = document.getElementById("newPassword").value;

        var trungTen = users.some(function (user) {
            return user.username.toLowerCase() === username.toLowerCase();
        });

        if (trungTen) {
            alert("Tên đăng nhập đã tồn tại!");
            return;
        }

        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        var newId = users.length > 0
            ? Math.max.apply(null, users.map(function (user) { return Number(user.id) || 0; })) + 1
            : 1;

        users.push({
            id: newId,
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            role: role
        });

        luuDuLieu();
        hienThiNguoiDung();

        userForm.reset();
        userForm.classList.add("hidden");
        alert("Thêm người dùng thành công!");
    });
}

function xoaNguoiDung(id) {
    var user = users.find(function (item) { return item.id === id; });
    if (!user) return;

    if (user.username === "admin") {
        alert("Không thể xóa tài khoản admin!");
        return;
    }

    if (currentUser && currentUser.id === id) {
        alert("Không thể xóa tài khoản đang đăng nhập!");
        return;
    }

    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
        users = users.filter(function (item) { return item.id !== id; });
        luuDuLieu();
        hienThiNguoiDung();
        alert("Đã xóa người dùng!");
    }
}