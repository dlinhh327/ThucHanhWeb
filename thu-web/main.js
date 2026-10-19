/* ==========================================
   PHẦN CHUNG: DỮ LIỆU TOÀN WEBSITE & LƯU TRỮ
   ========================================== */

var rooms = [];
var requests = [];
var calendar = [];
var users = [];
var currentUser = null;

function docDuLieu(key, macDinh) {
    try {
        var data = localStorage.getItem(key);
        if (data) {
            var ketQua = JSON.parse(data);
            if (Array.isArray(ketQua)) {
                return ketQua;
            }
        }
    } catch (error) {
        console.error("Lỗi đọc dữ liệu:", key, error);
    }
    return macDinh;
}

function luuDuLieu() {
    localStorage.setItem("rooms", JSON.stringify(rooms));
    localStorage.setItem("requests", JSON.stringify(requests));
    localStorage.setItem("calendar", JSON.stringify(calendar));
    localStorage.setItem("users", JSON.stringify(users));
}

// Khởi tạo dữ liệu mặc định
function khoiTaoDuLieu() {
    rooms = docDuLieu("rooms", []);
    requests = docDuLieu("requests", []);
    calendar = docDuLieu("calendar", []);
    users = docDuLieu("users", []);

    if (rooms.length === 0) {
        rooms = [
            { id: 1, code: "A101", name: "Phòng học A101", building: "Tòa A", capacity: 40, status: "Trống" },
            { id: 2, code: "A102", name: "Phòng học A102", building: "Tòa A", capacity: 50, status: "Trống" }
        ];
    }

    if (!users.some(function (user) { return user.username === "admin"; })) {
        users.push({
            id: 1,
            username: "admin",
            password: "123456",
            fullName: "Quản trị viên",
            email: "admin@example.com",
            role: "Quản trị viên"
        });
    }

    luuDuLieu();

    if (typeof hienThiPhong === "function") hienThiPhong();
    if (typeof hienThiNguoiDung === "function") hienThiNguoiDung();
    if (typeof hienThiYeuCau === "function") hienThiYeuCau();
    if (typeof hienThiLich === "function") hienThiLich();
    if (typeof capNhatThongKe === "function") capNhatThongKe();
    if (typeof capNhatDanhSachPhong === "function") capNhatDanhSachPhong();
}

// Chuyển trang trong SPA
function hienThiTrang(pageId) {
    var pages = document.querySelectorAll(".page");
    var links = document.querySelectorAll(".menu-link");

    pages.forEach(function (page) {
        page.classList.add("hidden");
    });

    var pageCanHien = document.getElementById(pageId);
    if (pageCanHien) {
        pageCanHien.classList.remove("hidden");
    }

    links.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("data-page") === pageId) {
            link.classList.add("active");
        }
    });

    if (pageId === "home" && typeof capNhatThongKe === "function") capNhatThongKe();
    if (pageId === "rooms" && typeof hienThiPhong === "function") hienThiPhong();
    if (pageId === "booking" && typeof capNhatDanhSachPhong === "function") capNhatDanhSachPhong();
    if (pageId === "calendar" && typeof hienThiLich === "function") hienThiLich();
    if (pageId === "requests" && typeof hienThiYeuCau === "function") hienThiYeuCau();
    if (pageId === "users" && typeof hienThiNguoiDung === "function") hienThiNguoiDung();
    if (pageId === "reports" && typeof capNhatThongKe === "function") capNhatThongKe();
}

function xuLyChuyenTrang() {
    var links = document.querySelectorAll(".menu-link");
    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            var pageId = link.getAttribute("data-page");
            hienThiTrang(pageId);
        });
    });
}

// Xử lý tìm kiếm
function xuLyTimKiem() {
    var searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        var tuKhoa = searchInput.value.trim().toLowerCase();
        var trangDangMo = document.querySelector(".page:not(.hidden)");
        if (!trangDangMo) return;

        var rows = trangDangMo.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            var noiDung = row.textContent.toLowerCase();
            if (noiDung.includes(tuKhoa)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
}

// Tự động chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
    khoiTaoDuLieu();
    xuLyChuyenTrang();
    xuLyTimKiem();
});