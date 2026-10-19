/* ==========================================
   LINH: ĐẶT PHÒNG VÀ HIỂN THỊ LỊCH HỌC
   ========================================== */

function capNhatDanhSachPhong() {
    var roomSelect = document.getElementById("roomSelect");
    if (!roomSelect) return;

    var giaTriCu = roomSelect.value;
    roomSelect.innerHTML = "";

    var optionDau = document.createElement("option");
    optionDau.value = "";
    optionDau.textContent = "-- Chọn phòng --";
    roomSelect.appendChild(optionDau);

    rooms.forEach(function (room) {
        var option = document.createElement("option");
        option.value = room.id;
        option.textContent = room.code + " - " + room.name + " (" + room.status + ")";
        roomSelect.appendChild(option);
    });

    if (rooms.some(function (room) { return String(room.id) === giaTriCu; })) {
        roomSelect.value = giaTriCu;
    }
}

function xuLyDatPhong() {
    var bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) return;

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!currentUser) {
            alert("Vui lòng đăng nhập trước!");
            return;
        }

        var roomId = Number(document.getElementById("roomSelect").value);
        var date = document.getElementById("bookingDate").value;
        var startTime = document.getElementById("startTime").value;
        var endTime = document.getElementById("endTime").value;
        var purpose = document.getElementById("purpose").value.trim();

        if (!roomId) {
            alert("Vui lòng chọn phòng!");
            return;
        }

        if (date < layNgayHienTai()) {
            alert("Không thể đặt phòng trong quá khứ!");
            return;
        }

        if (startTime >= endTime) {
            alert("Thời gian kết thúc phải sau thời gian bắt đầu!");
            return;
        }

        var room = rooms.find(function (item) { return item.id === roomId; });
        if (!room) {
            alert("Không tìm thấy phòng!");
            return;
        }

        var biTrung = calendar.some(function (item) {
            return item.roomId === roomId &&
                   item.date === date &&
                   startTime < item.endTime &&
                   endTime > item.startTime;
        });

        var choDuyetBiTrung = requests.some(function (item) {
            return item.roomId === roomId &&
                   item.date === date &&
                   item.status === "Đang chờ" &&
                   startTime < item.endTime &&
                   endTime > item.startTime;
        });

        if (biTrung || choDuyetBiTrung) {
            alert("Phòng đã có lịch hoặc yêu cầu trùng thời gian!");
            return;
        }

        var newId = requests.length > 0
            ? Math.max.apply(null, requests.map(function (item) { return Number(item.id) || 0; })) + 1
            : 1;

        requests.push({
            id: newId,
            username: currentUser.username,
            fullName: currentUser.fullName,
            roomId: roomId,
            date: date,
            startTime: startTime,
            endTime: endTime,
            purpose: purpose,
            status: "Đang chờ"
        });

        luuDuLieu();
        if (typeof hienThiYeuCau === "function") hienThiYeuCau();
        if (typeof capNhatThongKe === "function") capNhatThongKe();

        bookingForm.reset();
        alert("Đã gửi yêu cầu đặt phòng thành công!");
    });
}

function layNgayHienTai() {
    var ngay = new Date();
    var nam = ngay.getFullYear();
    var thang = String(ngay.getMonth() + 1).padStart(2, "0");
    var ngayTrongThang = String(ngay.getDate()).padStart(2, "0");
    return nam + "-" + thang + "-" + ngayTrongThang;
}

function hienThiLich() {
    var tbody = document.querySelector("#calendarTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    calendar.sort(function (a, b) {
        if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
    });

    calendar.forEach(function (item) {
        var room = rooms.find(function (r) { return r.id === item.roomId; });
        var row = tbody.insertRow();

        row.insertCell().textContent = item.date;
        row.insertCell().textContent = room ? room.code : (item.roomCode || "Không xác định");
        row.insertCell().textContent = item.startTime;
        row.insertCell().textContent = item.endTime;
        row.insertCell().textContent = item.purpose;
    });

    luuDuLieu();
}