var grades = [2, 5, , , 9, 8, , 8];
var sum = 0;
var count = 0;

if (grades.length > 0) {
    for (index = 0; index < grades.length; index++) {
        if (grades[index] != undefined) {
            sum += grades[index];
            count = count + 1;
        }
    }
    document.write(sum/count);
}
else
    document.write("Empty Array");

var name = prompt("What is your name?");

if (name.length != 0) {
    if (name == "Yuki") {
        document.write("What a beautiful name");
    }
    else {
        document.write("Hello " + name);
    }
}
else
    document.write("Feeling shy?");