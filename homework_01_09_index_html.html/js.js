function changeimage(){
    document.querySelector("img").src = "images/first.png";
}

document.querySelector("#FirstImage").onclick = function(){
    document.querySelector("img").src = "images/first.png";
}

document.querySelector("#LastImage").onclick = function(){
    document.querySelector("img").src = "images/last.png";
}