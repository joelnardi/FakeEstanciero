class ErrorHandler{
	
showError(title,msg,cb){
let div = document.createElement("div");
div.className = "error-window";
div.innerHTML = 
'<div class="error-title"><h2>'+title+'</h2></div>'+
'<hr>'+
'<div class="error-msg"><p>'+msg+'</p>'+
'<button class="error-btn">Cerrar</button></div>' 
document.body.append(div);
$(".error-btn").on("click",()=>{this.destroyErrorWindow();cb();});
}

destroyErrorWindow(){
	$(".error-window").remove();
}



}