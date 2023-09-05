const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

connection.on("Send", function (message) {
    $("#messagesList").append(`<li>${message}</li>`);
});
connection.on("ReceiveMessage", (u, m) => {
    $("#messagesList").append(`<li class="active"><span>${u}</span>: ${m}</li>`);
})

connection.on("LeaveGroupMessage", function (message) {
    $("#messagesList").append(`<li>${message}</li>`);
});

document.getElementById("groupmsg").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    var userName = document.getElementById("user-name").value;
    var groupMsg = document.getElementById("group-message-text").value;
    try {
        await connection.invoke("SendMessageToGroup", groupName, groupMsg, userName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});
document.getElementById("join-group").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    var userName = document.getElementById("user-name").value;
    try {
        await connection.invoke("AddToGroup", groupName, userName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});

document.getElementById("leave-group").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    var userName = document.getElementById("user-name").value;
    try {
        await connection.invoke("RemoveFromGroup", groupName, userName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});

(async () => {
    try {
        await connection.start()
            .then(() => {
                $('#br').click(() => {
                    $("#f").click();
                });

                $('#f').change(() => {
                    var file = document.getElementById("f").files[0];
                    var userName = document.getElementById("user-name").value;
                    var groupName = document.getElementById("group-name").value;
                    console.log(file.name);
                    console.log(file.type);
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var data =
                        {
                            filename: file.name,
                            image: reader.result
                        };
                        connection.invoke("Upload", data, userName, groupName);
                    }
                    reader.readAsDataURL(file);
                });
            });
    }
    catch (e) {
        console.error(e.toString());
    }
})();