$(document).ready(() => {
    $("#form2").submit((event) => {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/forgetpass',
            data: $('#form2').serialize(),
            dataType: "json",
            success: (response) => {
                $('#form2')[0].reset();
                document.getElementById("check").innerHTML = response.Success;
                setTimeout(() => {
                    document.getElementById("check").innerHTML = "";
                }, 3000);
                if (response.status != "Success") {
                    document.getElementById("check").style.color = "red";
                } else {
                    document.getElementById("check").style.color = "green";
                }
                if (response.message == "Wrong email!") {
                    document.getElementById("check").innerHTML = "l'adresse mail fournis ne correspond à aucun compte";
                }
                else if (response.message == "succes") {
                    document.getElementById("check").innerHTML = "email de reinitialisation envoyé avec succes";
                }
                else if (response.message == "error") {
                    document.getElementById("check").innerHTML = "une erreur s'est produite merci de réesayer plus tard";
                } else {
                    document.getElementById("check").innerHTML = "une erreur s'est produite merci de réesayer plus tard";
                }
            },
            error: () => {
            }
        })
    });

});