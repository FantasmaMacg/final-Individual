$(document).ready(function() {
    
    $("#form-login").submit(function(event) {
        event.preventDefault();
        
        const codigo = $("#codigo").val();
        
       
        if (codigo === "1234") {
            
            window.location.href = "ttp://localhost:1234/gerente.html"; 
        } else {
          
            window.location.href = "ttp://localhost:1234/cliente.html"; 
            
        }
    });s
});
