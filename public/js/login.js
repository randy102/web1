function validateForm()  {
             var u = document.getElementById("username").value;
             var p = document.getElementById("password").value;
 
             if(u== "") {
                 alert("Tên đăng nhập không được để trống !");
                 return false;
             }
             if(p == "") {
                 alert("Mật khẩu không được để trống !");
                 return false;
             }
         }