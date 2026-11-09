const msg = document.getElementById("messageS");

msg.addEventListener("input", function () {
    this.style.height = "35px";

    this.style.height = Math.min(
        this.scrollHeight,
        window.innerHeight * 0.18
    ) + "px";
});


console.log(typeof io);


let you = ""

const socket = io({
    transports: ["polling"]
});

socket.on("connect", function () {
    console.log("Connected to Flask!");
});






// localStorage.clear()










// document.getElementById("login").style.display = "none"
// document.getElementById("mainpg").style.display = "block"












let me = ""


function addClient() {
    let nm = document.getElementById("uid").value
    let p = document.getElementById("password").value


    me = nm

    socket.emit("login", JSON.stringify({
        userID: nm,
        password: p
    }))

    console.log(JSON.stringify({
        "userID": nm,
        "password": p
    }))

}



socket.on("stat", (data) => {
    console.log(data)
    if (data === "suspect") {
        document.getElementById("login").style.display = "block"
        document.getElementById("mainpg").style.display = "none"

    }
    else {
        console.log("notloggedin")
    }
})


let currentChat = "none";

let chat = {};


document.getElementById("tt").addEventListener("click", () => {
    addClient()


    socket.on("verification", (data) => {
        if (data === "suspect") {
            console.log("suspect")
        }
        else {
            req()
            document.getElementById("login").style.display = "none"
            document.getElementById("mainpg").style.display = "block"
        }
    })


})


function updateLS() {
    let chatMess = document.querySelectorAll(".cMS");
    let iq = chatMess.length;

    // chat.currm = {};
    chat = {}
    currentChat = document.getElementById("nmeC").innerHTML

    for (let i = 0; i < iq; i++) {
        let message = chatMess[i].innerHTML;
        let cm = `${chatMess[i].classList[1]}${i}`;

        chat[cm] = message;
    }
    localStorage.setItem(currentChat, JSON.stringify(chat))

}



//  <div class="cMS">
//               addddddd
//             </div> 


function addM(t, m) {
    let d = document.createElement("div")
    d.classList.add("cMS", `${t}`)
    d.innerHTML = `${m}`;

    document.getElementById("messs").append(d);
}




fetch("/", {
    headers: {
        "bypass-tunnel-reminder": "true"
    }
});


// addM("s", "hello bhai")
// addM("s", "hello bhai")
// addM("t", "hello bhai")

function send(me, se) {
    console.log(se, me)
}





function updateChat() {
    let fp = document.getElementById("nmeC").innerHTML


    document.getElementById("messs").innerHTML = ""


    try {
        let messges = JSON.parse(localStorage.getItem(fp))
        console.log(messges)

        let o = Object.keys(messges).length
        console.log(o)
        let uM = {}

        for (let i = 0; i < o; i++) {
            let mmm = Object.values(messges)[i]
            let ps = Object.keys(messges)[i]
            console.log(ps)

            let p = ps[0]



            console.log(p)

            if (p === "s") {
                console.log(mmm)
                addM("s", mmm)
            }
            else {
                console.log(mmm)
                addM("f", mmm)
            }
        }
    } catch (error) {
        console.log("eroor")
    }
}

// addM("s", "hello")


//func to make new mess option

//
//  <div class="chat">
//             <div id="lo">log</div>
//             <div id="con">
//               <div id="nm">nAME</div>
//               <div id="mess">MESSAGE</div>
//             </div>
//           </div>


function chtopt(name, message) {


    let existing = document.getElementById(name);

    if (existing) {
        existing.querySelector(".mess").textContent = message;
        return;
    }




    let a = document.createElement("div");
    a.className = "chat";
    a.id = name

    let logo = document.createElement("div");
    logo.className = "lo";

    let cont = document.createElement("div");
    cont.className = "con";

    let nam = document.createElement("div");
    nam.className = "nm";
    nam.innerHTML = name;

    let mess = document.createElement("div");
    mess.innerHTML = message;
    mess.className = "mess";
    // div.className


    cont.append(nam, mess);
    a.append(logo, cont);

    document.getElementById("all").append(a);
}


// chtopt("utkarsh", "hello bhai")
// chtopt("jaadu", "hiii")






function search(name) {
    socket.emit("search", name)
    console.log("emitted")
}

socket.on("results", (data) => {
    pSR(data)
    console.log("got results", data)
})







function pSR(name) {
    let arr = [...new Set(name)]



    let keys = Object.keys(localStorage).sort();

    for (let key of keys) {
        if (key.includes(document.getElementById("serIN").value)) {
            arr.push(key);
        }
    }

    console.log("arr", arr);


    document.getElementById("all").innerHTML = ""

    for (let names of arr) {
        console.log(names);
        console.log("printed", names);
        chtopt(names, "")
    }
}


// document.getElementById("ser").addEventListener("click", () => {
//     let ab = document.createElement("input");

//     ab.id = "serIN";
//     ab.type = "search";
//     ab.placeholder = "Search users";

//     document.getElementById("sI").append(ab);




//     // document.getElementById("serIN").addEventListener("keydown", (event) => {
//     //     if (event.key === "Enter" || event.keyCode === 13) {
//     //         console.log("req sent for results")
//     //         search(document.getElementById("serIN").value)
//     //     }
//     // })

//     ab.addEventListener("keyup", function (event) {

//         if (event.key === "Enter" || event.keyCode === 13) {

//             event.preventDefault();
//             event.stopPropagation();

//             search(this.value.trim());

//             // Keep focus on search input
//             this.focus({ preventScroll: true });

//         }

//     });



// })

document.getElementById("ser").addEventListener("click", () => {

    // Check whether search input already exists
    let existing = document.getElementById("serIN");

    if (existing) {
        existing.focus({ preventScroll: true });
        return;
    }

    // Create search input
    let ab = document.createElement("input");

    ab.id = "serIN";
    ab.type = "search";
    ab.placeholder = "Search users";

    // Append input
    document.getElementById("sI").append(ab);

    // Handle Enter key
    ab.addEventListener("keyup", function (event) {

        if (event.key === "Enter" || event.keyCode === 13) {

            event.preventDefault();
            event.stopPropagation();

            let value = this.value.trim();

            if (value !== "") {
                search(value);
            }

            // Keep focus on search input
            this.focus({ preventScroll: true });

        }

    });

    // Automatically focus after creation
    ab.focus({ preventScroll: true });

});








socket.on("newM", (data) => {
    if (data.from === document.getElementById("nmeC").innerHTML) {
        addM("f", data.messa)
        updateLS()
        updateChat()
    }

    else {
        chtopt(data.from, data.messa)
        let chat = JSON.parse(localStorage.getItem(data.from) || "{}");

        let l = Object.keys(chat).length;

        chat[`f${l}`] = data.messa;

        localStorage.setItem(data.from, JSON.stringify(chat));
    }
})












function currChat(id) {
    let trgt = document.getElementById(currentChat);
    let n = trgt.querySelector(".con");
    let na = n.querySelector(".nm");
    let name = na.innerHTML;




    document.getElementById("nmeC").innerHTML = name;


    updateChat()
}


// document.getElementById("all").addEventListener("click", function (e) {
//     let el = e.target.closest(".chat");





//     console.log("targetted")
//     if (el && this.contains(el)) {
//         currentChat = el.id;
//         currChat(el.id);
//         console.log(el);
//         console.log(document.getElementById("buttonS"));
//         document.getElementById("buttonS").addEventListener("click", async () => {
//             let mm = document.getElementById("messageS").value
//             let box = document.getElementById("messs");
//             console.log("added")
//             box.scrollTop = box.scrollHeight;
//             if (mm === "") {
//                 console.log("nulla")
//             }
//             else {

//                 let result = await sendMes()

//                 console.log("waited")


//                 addM("s", `${document.getElementById("messageS").value}`)
//                 document.getElementById("messageS").value = ""
//                 updateLS()
//                 console.log("fine")
//                 send(mm, `${document.getElementById("nmeC").innerHTML}`)
//             }
//             console.log("fine")

//         })
//         console.log("added shyd")



//     }

//     updateOptions()

//     document.getElementById("serIN").remove()
// });







document.getElementById("all").addEventListener("click", function (e) {
    let el = e.target.closest(".chat");

    console.log("targetted");

    if (el && this.contains(el)) {
        currentChat = el.id;

        currChat(el.id);

        console.log(el);
        console.log(document.getElementById("buttonS"));

        console.log("selected:", currentChat);
    }

    updateOptions();

    let searchInput = document.getElementById("serIN");
    if (searchInput) {
        searchInput.remove();
    }
});


// Send listener: added only ONCE
document.getElementById("buttonS").addEventListener("click", async () => {
    let mm = document.getElementById("messageS").value;
    let box = document.getElementById("messs");

    console.log("added");

    box.scrollTop = box.scrollHeight;

    if (mm === "") {
        console.log("nulla");
    }
    else {
        let result = await sendMes();

        console.log("waited");

        addM("s", mm);

        document.getElementById("messageS").value = "";

        updateLS();

        console.log("fine");

        send(mm, document.getElementById("nmeC").innerHTML);
    }

    console.log("fine");
});













function updateOptions() {

    let n = Object.keys(localStorage)

    let num = n.length

    document.getElementById("all").innerHTML = ""

    for (let i = 0; i < n.length; i++) {

        chtopt(n[i], "")

    }


}

updateOptions()


function req() {
    socket.emit("ur", me)
    let mess = {}
    socket.once("unread", (data) => {
        mess = data




        for (let name of Object.keys(data)) {

            let messages = data[name];

            // Get existing chat history
            let chat = JSON.parse(localStorage.getItem(name) || "{}");

            // Sort incoming messages by their serial number
            let incoming = Object.keys(messages).sort((a, b) =>
                Number(a.slice(1)) - Number(b.slice(1))
            );

            // Add received messages as f0, f1, f2...
            for (let msg of incoming) {
                let num = Object.keys(chat).length;
                chat["f" + num] = messages[msg];
            }

            // Save updated chat
            localStorage.setItem(name, JSON.stringify(chat));

            // Latest message for preview
            let latest = messages[incoming[incoming.length - 1]] || "";

            // Create or update chat option
            let existing = document.getElementById(name);

            if (!existing) {
                chtopt(name, latest);
            } else {
                existing.querySelector(".mess").innerHTML = latest;
            }
        }







        try {
            console.log(mess)
        }
        catch (error) {
            console.log("eror")
        }
    })

}


function sendMes() {
    console.log("sendms called")

    return new Promise((resolve) => {
        let to = document.getElementById("nmeC").innerHTML;
        let text = document.querySelector("textarea").value;

        let mess = {
            "from": me,
            "to": to,
            "message": text
        };

        console.log(mess)

        socket.emit("sendMes", mess);
        console.log("sent")
        socket.once("send_response", (data) => {
            resolve(data);
        });
    });
}






const messageInput = document.getElementById("messageS");

messageInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        document.getElementById("buttonS").click();
    }

});




// Handle Android keyboard viewport changes

if (window.visualViewport) {

    window.visualViewport.addEventListener("resize", () => {

        const sender = document.getElementById("sender");

        if (sender) {
            sender.style.transform = "translateY(0)";
        }

    });

}

// Scroll messages to bottom when opening a chat
function scrollToBottom() {

    const box = document.getElementById("messs");

    requestAnimationFrame(() => {
        box.scrollTop = box.scrollHeight;
    });

}





document.getElementById("messageS").addEventListener("focus", function () {
    console.log("Message textarea focused");
});