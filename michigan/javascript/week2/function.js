function message(msg) {
    document.getElementById('output').innerHTML = msg + " event";
}

function displayDate() {
    document.getElementById("demo").innerHTML = Date();
}

function closeMe() {
    x = document.getElementById("demo2");
    x.style.display = "none";
}

function openMe() {
    x = document.getElementById("demo2");
    x.style.display = "block";
}