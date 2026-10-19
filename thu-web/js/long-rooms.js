/* ==========================================
   ĐẶNG THÀNH LONG: QUẢN LÝ PHÒNG & XỬ LÝ YÊU CẦU
   ========================================== */

function hienThiPhong() {
    var tbody = document.querySelector("#roomTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    rooms.forEach(function (room) {
        var row = tbody.insertRow();
        row.insertCell().textContent = room.code;
        row.insertCell().textContent = room.name;
        row.insertCell().textContent = room.building;
        row.insertCell().textContent = room.capacity;
        row.insertCell().textContent = room.status;

        var thaoTac = row.insertCell();

        var suaBtn = document.createElement("button");
        suaBtn.textContent = "Sửa";
        suaBtn.addEventListener("click", function () {
            suaPhong(room.id);
        });

        var xoaBtn = document.createElement("button");
        xoaBtn.textContent = "Xóa";
        xoaBtn.className = "delete-btn";
        xoaBtn.addEventListener("click", function () {
            xoaPhong(room.id);
        });

        thaoTac.appendChild(suaBtn);
        thaoTac.appendChild(xoaBtn);
    });
}

function xuLyThemPhong() {
    var addRoomBtn = document.getElementById("addRoomBtn");
    var roomForm = document.getElementById("roomForm");
    var cancelRoomBtn = document.getElementById("cancelRoomBtn");

    if (!addRoomBtn || !roomForm) return;

    addRoomBtn.addEventListener("click", function () {
        roomForm.reset();
        document.getElementById("roomId").value = "";
        document.getElementById("roomFormTitle").textContent = "Thêm phòng học";
        document.getElementById("saveRoomBtn").textContent = "Thêm phòng";
        roomForm.classList.remove("hidden");
    });

    cancelRoomBtn.addEventListener("click", function () {
        roomForm.reset();
        roomForm.classList.add("hidden");
    });

    roomForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var id = document.getElementById("roomId").value;
        var code = document.getElementById("roomCode").value.trim();
        var name = document.getElementById("roomName").value.trim();
        var building = document.getElementById("roomBuilding").value.trim();
        var capacity = Number(document.getElementById("roomCapacity").value);
        var status = document.getElementById("roomStatus").value;

        if (capacity <= 0) {
            alert("Sức chứa phải lớn hơn 0!");
            return;
        }

        var trungMa = rooms.some(function (room) {
            return room.code.toLowerCase() === code.toLowerCase() && String(room.id) !== String(id);
        });

        if (trungMa) {
            alert("Mã phòng đã tồn tại!");
            return;
        }

        if (id !== "") {
            var room = rooms.find(function (item) { return String(item.id) === String(id); });
            if (room) {
                room.code = code;
                room.name = name;
                room.building = building;
                room.capacity = capacity;
                room.status = status;
            }
            alert("Cập nhật phòng thành công!");
        } else {
            var newId = rooms.length > 0
                ? Math.max.apply(null, rooms.map(function (room) { return Number(room.id) || 0; })) + 1
                : 1;

            rooms.push({
                id: newId,
                code: code,
                name: name,
                building: building,
                capacity: capacity,
                status: status
            });
            alert("Thêm phòng thành công!");
        }

        luuDuLieu();
        hienThiPhong();
        if (typeof capNhatDanhSachPhong === "function") capNhatDanhSachPhong();
        if (typeof capNhatThongKe === "function") capNhatThongKe();

        roomForm.reset();
        roomForm.classList.add("hidden");
    });
}

function suaPhong(id) {
    var room = rooms.find(function (item) { return item.id === id; });
    if (!room) return;

    document.getElementById("roomId").value = room.id;
    document.getElementById("roomCode").value = room.code;
    document.getElementById("roomName").value = room.name;
    document.getElementById("roomBuilding").value = room.building;
    document.getElementById("roomCapacity").value = room.capacity;
    document.getElementById("roomStatus").value = room.status;

    document.getElementById("roomFormTitle").textContent = "Sửa thông tin phòng";
    document.getElementById("saveRoomBtn").textContent = "Lưu thay đổi";
    document.getElementById("roomForm").classList.remove("hidden");
}

function xoaPhong(id) {
    var room = rooms.find(function (item) { return item.id === id; });
    if (!room) return;

    var coYeuCau = requests.some(function (request) {
        return request.roomId === id && request.status === "Đang chờ";
    });

    if (coYeuCau) {
        alert("Không thể xóa phòng đang có yêu cầu chờ duyệt!");
        return;
    }

    if (confirm("Bạn có chắc muốn xóa phòng " + room.code + "?")) {
        rooms = rooms.filter(function (item) { return item.id !== id; });
        luuDuLieu();
        hienThiPhong();
        if (typeof capNhatDanhSachPhong === "function") capNhatDanhSachPhong();
        if (typeof capNhatThongKe === "function") capNhatThongKe();
        alert("Đã xóa phòng!");
    }
}

function hienThiYeuCau() {
    var tbody = document.querySelector("#requestTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    requests.forEach(function (request) {
        var room = rooms.find(function (item) { return item.id === request.roomId; });
        var row = tbody.insertRow();

        row.insertCell().textContent = request.fullName;
        row.insertCell().textContent = room ? room.code : "Đã xóa phòng";
        row.insertCell().textContent = request.date + " " + request.startTime + " - " + request.endTime;
        row.insertCell().textContent = request.purpose;

        var statusCell = row.insertCell();
        statusCell.textContent = request.status;

        if (request.status === "Đang chờ") {
            statusCell.className = "status-pending";
        } else if (request.status === "Đã duyệt") {
            statusCell.className = "status-approved";
        } else {
            statusCell.className = "status-rejected";
        }

        var actionCell = row.insertCell();
        if (request.status === "Đang chờ") {
            var duyetBtn = document.createElement("button");
            duyetBtn.textContent = "Duyệt";
            duyetBtn.className = "approve-btn";
            duyetBtn.addEventListener("click", function () {
                duyetYeuCau(request.id);
            });

            var tuChoiBtn = document.createElement("button");
            tuChoiBtn.textContent = "Từ chối";
            tuChoiBtn.className = "delete-btn";
            tuChoiBtn.addEventListener("click", function () {
                tuChoiYeuCau(request.id);
            });

            actionCell.appendChild(duyetBtn);
            actionCell.appendChild(tuChoiBtn);
        } else {
            actionCell.textContent = "Đã xử lý";
        }
    });
}

function duyetYeuCau(id) {
    var request = requests.find(function (item) { return item.id === id; });
    if (!request) return;

    var biTrung = calendar.some(function (item) {
        return item.roomId === request.roomId &&
               item.date === request.date &&
               request.startTime < item.endTime &&
               request.endTime > item.startTime;
    });

    if (biTrung) {
        alert("Không thể duyệt vì lịch phòng bị trùng!");
        return;
    }

    request.status = "Đã duyệt";
    var room = rooms.find(function (item) { return item.id === request.roomId; });

    calendar.push({
        id: request.id,
        roomId: request.roomId,
        roomCode: room ? room.code : "",
        date: request.date,
        startTime: request.startTime,
        endTime: request.endTime,
        purpose: request.purpose,
        fullName: request.fullName
    });

    luuDuLieu();
    hienThiYeuCau();
    if (typeof hienThiLich === "function") hienThiLich();
    if (typeof capNhatThongKe === "function") capNhatThongKe();
    alert("Đã duyệt yêu cầu đặt phòng!");
}

function tuChoiYeuCau(id) {
    var request = requests.find(function (item) { return item.id === id; });
    if (!request) return;

    if (confirm("Bạn có chắc muốn từ chối yêu cầu này?")) {
        request.status = "Đã từ chối";
        luuDuLieu();
        hienThiYeuCau();
        if (typeof capNhatThongKe === "function") capNhatThongKe();
        alert("Đã từ chối yêu cầu!");
    }
}