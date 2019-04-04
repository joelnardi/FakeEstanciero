<%@page import="
terrateniente.game.GameManager,terrateniente.game.User"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="UTF-8"> 
<title>Game</title>
<script src="js/thirdparty/easeljs-0.8.2.min.js"></script>
<script src="js/thirdparty/tweenjs-0.6.2.min.js"></script>
<script src="js/thirdparty/jquery-3.2.1.min.js"></script>

<script src="js/HandDisplayer.js"></script>
<!-- <script src="js/Game.js"></script> -->
<script src="js/DeckDisplayer.js"></script>
<script src="js/Card.js"></script>
<script src="js/msgHandler.js"></script>

<script src="js/views/View.js"></script>
<script src="js/views/ViewManager.js"></script>
<script src="js/views/menuView.js"></script>
<script src="js/views/gameView.js"></script>
<script src="js/views/listarSalasView.js"></script>
<script src="js/managers/CardManager.js"></script>




<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
 <link rel="stylesheet" type="text/css" href="lista.css">
 <link rel="stylesheet" type="text/css" href="error.css">
<style>


#container{
width:1024px;
height:768px;
margin: 0px auto;
overflow:hidden;
}

#mycanvas{
z-index:-2;
width:100%;
height:100%;
background:url("img/bg.jpg"); 
}



</style>
 <link rel="stylesheet" type="text/css" href="style.css">
 <script>
var TARGET_WIDTH = 1500;
var TARGET_HEIGHT = 1000;
let ws;
</script>
</head>
<body>
<div id="container">
<canvas id="mycanvas"></canvas>
<script src="js/main.js"></script>

<% if(session.getAttribute("user") == null){ %>

 <%@include  file="login.html" %>
 <% }else{%>
	<script>
	init();
	</script> 
 <% } %>
 <%

// if(session.getAttribute("user") != null){
	 
	 %>
<!--  	 
<script>
$("#formContainer").toggleClass("show");
 //currentView = new mainMenu();
//mainStage.addChild(currentView.getView());
vm.setView(new menuView());

ws = new WebSocket("ws://" + location.host + "/App/game");



ws.onmessage = function(data){
	handle(data);
}

//Server reconnect handler
-->
 <% 
 //GameManager.getInstance().userReconnect(session);
 //}%>
 
		
 <!--  </script> -->
</div>
<script>




</script>

</body>
</html>