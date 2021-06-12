var people = ["Yuki", "Mark", "Suyog"]

function loadPeople() {
    document.getElementById("people").innerHTML = people;
}

function myFunction() {
    var person = prompt("Who do you know?");
    people[people.length] = person;
    document.getElementById("people").innerHTML = people;
}

var grades = [1, 2, 3];
var sum = 0;
if (grades.length > 0) {
    for (i = 0; i < grades.length; i++) {
        sum += grades[i];
    }
    document.write(sum / grades.length);
}

var name = prompt("What is your name?");

if (name.length != 0) {
    document.write("Hello " + name;)
}