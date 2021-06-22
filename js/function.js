function search() {
    var word = document.getElementById("searchInput").value;
    word = word.toLowerCase();
    var lis = document.getElementsByTagName("LI");
    for (i = 0; lis.length; i++) {
        if (!lis[i].innerHTML.toLowerCase().includes(word)) {
            lis[i].style.display = 'none';
        }
        else {
            lis[i].style.display = 'list-item';
        }
    }
}