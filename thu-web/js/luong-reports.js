/* ==========================================
   LƯỢNG: THỐNG KÊ TRANG CHỦ, BÁO CÁO & IN ẤN
   ========================================== */

function capNhatThongKe() {
    var tongPhong = rooms.length;

    var phongDangDung = rooms.filter(function (room) {
        return room.status === "Đang sử dụng";
    }).length;

    var phongTrong = rooms.filter(function (room) {
        return room.status === "Trống";
    }).length;

    var yeuCauCho = requests.filter(function (request) {
        return request.status === "Đang chờ";
    }).length;

    var totalRoomsEl = document.getElementById("totalRooms");
    var usedRoomsEl = document.getElementById("usedRooms");
    var emptyRoomsEl = document.getElementById("emptyRooms");
    var pendingRequestsEl = document.getElementById("pendingRequests");

    if (totalRoomsEl) totalRoomsEl.textContent = tongPhong;
    if (usedRoomsEl) usedRoomsEl.textContent = phongDangDung;
    if (emptyRoomsEl) emptyRoomsEl.textContent = phongTrong;
    if (pendingRequestsEl) pendingRequestsEl.textContent = yeuCauCho;

    var reportTotalEl = document.getElementById("reportTotal");
    var reportUsedEl = document.getElementById("reportUsed");
    var reportEmptyEl = document.getElementById("reportEmpty");
    var reportPendingEl = document.getElementById("reportPending");

    if (reportTotalEl) reportTotalEl.textContent = tongPhong;
    if (reportUsedEl) reportUsedEl.textContent = phongDangDung;
    if (reportEmptyEl) reportEmptyEl.textContent = phongTrong;
    if (reportPendingEl) reportPendingEl.textContent = yeuCauCho;
}

function xuLyInBao cáo() {
    var printBtn = document.getElementById("printReportBtn");
    if (!printBtn) return;

    printBtn.addEventListener("click", function () {
        window.print();
    });
}