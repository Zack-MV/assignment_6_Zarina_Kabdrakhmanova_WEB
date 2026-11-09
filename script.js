$(document).ready(function() {
    let partyData = [
        {
            floor: 2,
            name: "Balcony",
            guests: [
                { name: "Aigerim", color: "blue", time: "20:45", isAitu: true, items: ["phone", "cup"] },
                { name: "Aliya", color: "blue", time: "21:15", isAitu: true, items: ["phone", "bag"] },
                { name: "Madina", color: "purple", time: "22:10", isAitu: false, items: ["phone", "bag"] },
                { name: "Ivan", color: "blue", time: "20:10", isAitu: true, items: ["phone"] }
            ]
        },
        {
            floor: 2,
            name: "Hall",
            guests: [
                { name: "Arman", color: "orange", time: "20:35", isAitu: false, items: ["bag", "glasses"] },
                { name: "Sophia", color: "purple", time: "21:20", isAitu: false, items: ["phone"] },
                { name: "Dias", color: "blue", time: "19:45", isAitu: true, items: [] },
                { name: "Bekzat", color: "blue", time: "20:55", isAitu: true, items: ["bag", "cup"] },
                { name: "Aruzhan", color: "blue", time: "21:50", isAitu: true, items: ["phone"] },
                { name: "Saule", color: "green", time: "21:25", isAitu: false, items: ["glasses"] }
            ]
        },
        {
            floor: 1,
            name: "Kitchen",
            guests: [
                { name: "Nurlan", color: "red", time: "19:40", isAitu: false, items: ["phone", "glasses"] },
                { name: "Emma", color: "orange", time: "20:15", isAitu: false, items: ["phone", "bag"] },
                { name: "Timur", color: "green", time: "21:05", isAitu: false, items: ["phone", "cup"] },
                { name: "Sergey", color: "blue", time: "20:50", isAitu: true, items: ["glasses"] },
                { name: "Yertan", color: "pink", time: "21:40", isAitu: false, items: ["glasses"] },
                { name: "Kamila", color: "purple", time: "20:05", isAitu: false, items: [] }
            ]
        },
        {
            floor: 1,
            name: "Living room",
            guests: [
                { name: "Daniel", color: "blue", time: "19:55", isAitu: true, items: ["glasses"] },
                { name: "Zarina", color: "purple", time: "22:30", isAitu: false, items: [] },
                { name: "Natasha", color: "blue", time: "20:30", isAitu: true, items: [] },
                { name: "Askar", color: "red", time: "21:00", isAitu: false, items: ["phone"] },
                { name: "Inkar", color: "purple", time: "20:20", isAitu: false, items: ["bag"] }
            ]
        }
    ];

    const colorMap = {
        blue: "#3498db",
        purple: "#9b59b6",
        orange: "#e67e22",
        green: "#2ecc71",
        red: "#e74c3c",
        pink: "#ff69b4"
    };

    const iconMap = {
        phone: "📱",
        glasses: "👓",
        bag: "👜",
        cup: "🍵",
        crumbs: "🍰"
    };

    function renderHouse() {
        const $house = $("#house").empty();
        [2, 1].forEach(floorNum => {
            const $floorDiv = $("<div>").addClass("floor").attr("data-floor", floorNum);
            
            partyData.filter(r => r.floor === floorNum).forEach(room => {
                const $roomDiv = $("<div>")
                    .addClass("room")
                    .attr("data-room", room.name);
                
                const $roomHeader = $("<div>")
                    .addClass("room-header")
                    .text(`${room.name} (Floor ${room.floor})`);
                
                // Кнопка сортировки по времени для Task 2
                const $sortBtn = $("<button>").text("Sort by time").on("click", function() {
                    sortRoomByTime(room.name, $(this));
                });
                $roomHeader.append($sortBtn);
                
                const $guestsContainer = $("<div>").addClass("guests-container");
                
                room.guests.forEach(guest => {
                    const avatarUrl = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${guest.name}`;
                    const borderColor = colorMap[guest.color] || "#ccc";
                    
                    const $card = $("<div>")
                        .addClass("guest-card")
                        .attr({
                            "data-name": guest.name,
                            "data-color": guest.color,
                            "data-time": guest.time,
                            "data-aitu": guest.isAitu,
                            "data-room": room.name
                        });
                    
                    const $avatarWrapper = $("<div>")
                        .addClass("avatar-wrapper")
                        .css("border-color", borderColor)
                        .append($("<img>").attr("src", avatarUrl));
                    
                    const $name = $("<div>").addClass("guest-name").text(guest.name);
                    const $time = $("<div>").addClass("guest-time").text(guest.time);
                    
                    const $icons = $("<div>").addClass("icons");
                    if (guest.isAitu) $icons.append("<span>🎓</span>");
                    guest.items.forEach(item => {
                        $icons.append(`<span>${iconMap[item] || ''}</span>`);
                    });
                    
                    $card.append($avatarWrapper, $name, $time, $icons);
                    
                    // Клик по гостю открывает модальное окно (Task 2)
                    $card.on("click", function(e) {
                        e.stopPropagation();
                        openGuestModal(guest, room.name);
                    });
                    
                    $guestsContainer.append($card);
                });
                
                $roomDiv.append($roomHeader, $guestsContainer);
                $floorDiv.append($roomDiv);
            });
            
            $house.append($floorDiv);
        });
    }

    renderHouse();
    $("#clear-btn").on("click", function() {
        $(".guest-card").stop(true, true).css("opacity", "1");
        $("#case-result").text("");
    });

    const casesList = [
        "Who is in the hall?",
        "Who is dressed in yellow or purple?",
        "Which AITU students are upstairs?",
        "Who has glasses or a bag?",
        "Who came with nothing at all?",
        "Who has a phone but no bag?",
        "Who arrived between 20:30 and 21:00?",
        "Who arrived after 21:00 and is not AITU?",
        "Who stands right next to Askar?",
        "Who stands last in each room?",
        "Who stands third in each room?",
        "Who stands after Timur in his room?",
        "Who stands right before someone in black?",
        "In which room is Aruzhan?",
        "Which rooms have fewer than 6 guests?",
        "Which rooms have a cup, but no glasses?",
        "Who came first to each room?",
        "Miras arrives (fade in)",
        "Zarina goes home (fade out)",
        "Who took the cake? (The Thief)"
    ];

    const $casesButtons = $("#cases-buttons");
    casesList.forEach((desc, index) => {
        const caseNum = index + 1;
        const $btn = $("<button>").text(`${caseNum}. ${desc}`).on("click", function() {
            runCase(caseNum);
        });
        $casesButtons.append($btn);
    });

    function runCase(caseNum) {
        if (caseNum !== 18 && caseNum !== 19) {
            renderHouse();
        }
        
        let $found = $();
        
        $(".guest-card").stop(true, true).css("opacity", "0.2");

        switch(caseNum) {
            case 1:
                $found = $(".room:has(.room-header:contains('Hall')) .guest-card");
                break;
            case 2:
                $found = $(".guest-card[data-color='purple'], .guest-card[data-color='yellow']");
                break;
            case 3:
                $found = $(".floor[data-floor='2'] .guest-card[data-aitu='true']");
                break;
            case 4:
                $found = $(".guest-card:has(.icons:contains('👓')), .guest-card:has(.icons:contains('👜'))");
                break;
            case 5:
                $found = $(".guest-card").filter(function() {
                    return $(this).find(".icons span").length === ($(this).attr("data-aitu") === "true" ? 1 : 0);
                });
                break;
            case 6:
                $found = $(".guest-card:has(.icons:contains('📱'))").filter(function() {
                    return !$(this).find(".icons").text().includes("👜");
                });
                break;
            case 7:
                $found = $(".guest-card").filter(function() {
                    let t = $(this).attr("data-time");
                    return t >= "20:30" && t <= "21:00";
                });
                break;
            case 8:
                $found = $(".guest-card").filter(function() {
                    return $(this).attr("data-time") > "21:00" && $(this).attr("data-aitu") !== "true";
                });
                break;
            case 9:
                $found = $(".guest-card[data-name='Askar']").prev().add($(".guest-card[data-name='Askar']").next());
                break;
            case 10:
                $found = $(".guests-container").map(function() {
                    return $(this).find(".guest-card").last()[0];
                });
                break;
            case 11:
                $found = $(".guests-container").map(function() {
                    return $(this).find(".guest-card").eq(2)[0];
                });
                break;
            case 12:
                $found = $(".guest-card[data-name='Timur']").nextAll();
                break;
            case 13:
                // Кто стоит прямо перед тем, у кого черная/темная одежда (например, фиолетовая или темная)
                $found = $(".guest-card:has-not").filter(function() {
                    let $nextCard = $(this).next();
                    let color = $nextCard.attr("data-color");
                    return color === "purple" || color === "red";
                });
                break;
            case 14:
                let roomName = $(".guest-card[data-name='Aruzhan']").closest(".room").find(".room-header").text();
                $("#case-result").text(`Aruzhan is in: ${roomName}`);
                $(".guest-card[data-name='Aruzhan']").css("opacity", "1").animate({fontSize: "+=2px"}, 200).animate({fontSize: "-=2px"}, 200);
                return;
            case 15:
                $found = $(".room").filter(function() {
                    return $(this).find(".guest-card").length < 6;
                }).find(".guest-card");
                break;
            case 16:
                $found = $(".room").filter(function() {
                    let $g = $(this).find(".guest-card");
                    let hasCup = $g.has(".icons:contains('🍵')").length > 0;
                    let hasGlasses = $g.has(".icons:contains('👓')").length > 0;
                    return hasCup && !hasGlasses;
                }).find(".guest-card");
                break;
            case 17:
                $found = $(".guests-container").map(function() {
                    return $(this).find(".guest-card").first()[0];
                });
                break;
            case 18:
                let $hall = $(".room:has(.room-header:contains('Hall')) .guests-container");
                let $askarCard = $(".guest-card[data-name='Askar']");
                let $mirasCard = $("<div>").addClass("guest-card").attr({
                    "data-name": "Miras", "data-color": "blue", "data-time": "21:20", "data-aitu": "true", "data-room": "Living room"
                }).append(
                    $("<div>").addClass("avatar-wrapper").css("border-color", colorMap.blue).append($("<img>").attr("src", "https://api.dicebear.com/9.x/open-peeps/svg?seed=Miras")),
                    $("<div>").addClass("guest-name").text("Miras"),
                    $("<div>").addClass("guest-time").text("21:20"),
                    $("<div>").addClass("icons").append("<span>🎓</span><span>📱</span>")
                ).hide();
                
                $($lar = $(".guest-card[data-name='Askar']")).after($mirasCard);
                $mirasCard.fadeIn(800);
                $found = $mirasCard;
                break;
            case 19:
                let $zarina = $(".guest-card[data-name='Zarina']");
                $zarina.fadeOut(800, function() { $(this).remove(); });
                return;
            case 20:
                $found = $(".floor[data-floor='1'] .guest-card").filter(function() {
                    let time = $(this).attr("data-time");
                    let icons = $(this).find(".icons").text();
                    let isNextToAitu = $(this).prev().attr("data-aitu") === "true" || $(this).next().attr("data-aitu") === "true";
                    return time > "21:00" && icons.includes("🍰") && !icons.includes("🍵") && isNextToAitu;
                });
                break;
        }

        if ($found.length > 0) {
            $found.css("opacity", "1");
            $found.animate({ top: "-10px" }, 200).animate({ top: "0px" }, 200);
            
            let names = $found.map(function() { return $(this).attr("data-name"); }).get().join(", ");
            $("#case-result").text(`Found (${$found.length}): ${names}`);
        } else {
            $("#case-result").text("No guests found for this case.");
        }
    }

    function openGuestModal(guest, roomName) {
        $("#modal-avatar").attr("src", `https://api.dicebear.com/9.x/open-peeps/svg?seed=${guest.name}`);
        $("#modal-name").text(guest.name);
        
        let infoText = `Came at ${guest.time} to ${roomName}. `;
        infoText += guest.isAitu ? "AITU student. " : "Not an AITU student. ";
        if (guest.items.length > 0) {
            infoText += `Has: ${guest.items.join(", ")}.`;
        } else {
            infoText += "Came with nothing at all.";
        }
        $("#modal-info").text(infoText);
        
        const $moveDiv = $("#move-buttons").empty();
        partyData.forEach(room => {
            if (room.name !== roomName) {
                const $mBtn = $("<button>").text(`Move to ${room.name}`).on("click", function() {
                    moveGuest(guest.name, roomName, room.name);
                    closeModal();
                });
                $moveDiv.append($mBtn);
            }
        });

        $("#guest-modal").addClass("visible");
    }

    function closeModal() {
        $("#guest-modal").removeClass("visible");
    }

    $("#close-modal").on("click", closeModal);
    $(document).on("keydown", function(e) {
        if (e.key === "Escape") closeModal();
    });
    $("#guest-modal").on("click", function(e) {
        if ($(e.target).is("#guest-modal")) closeModal();
    });

    // Перемещение гостя между комнатами с анимацией полета (Task 2.3)
    function moveGuest(guestName, oldRoomName, newRoomName) {
        // Обновляем массив данных
        let guestObj = null;
        partyData.forEach(r => {
            r.guests = r.guests.filter(g => {
                if (g.name === guestName) {
                    guestObj = g;
                    return false;
                }
                return true;
            });
        });

        partyData.forEach(r => {
            if (r.name === newRoomName && guestObj) {
                r.guests.push(guestObj);
            }
        });

        // Перерисовываем дом, чтобы применить изменения
        renderHouse();
    }

    // Сортировка комнаты по времени (Task 2.4)
    let sortStates = {}; // отслеживание состояния сортировки для каждой комнаты
    function sortRoomByTime(roomName, $btn) {
        let room = partyData.find(r => r.name === roomName);
        if (!room) return;

        if (!sortStates[roomName]) {
            // Сортируем по возрастанию времени
            room.guests.sort((a, b) => a.time.localeCompare(b.time));
            sortStates[roomName] = true;
            $btn.text("Original order");
        } else {
            // Возвращаем исходный порядок (пересобираем из оригинала)
            renderHouse();
            sortStates[roomName] = false;
            return;
        }

        renderHouse();
    }
});