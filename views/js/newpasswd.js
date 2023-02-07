$(document).ready(() => {
    $("#form2").submit((event) => {
        event.preventDefault();
        url = window.location.href
        $.ajax({
            type: 'POST',
            url: url,
            data: $('#form2').serialize(),
            dataType: "json",
            success: (response) => {
                $('#form2')[0].reset();
                document.getElementById("check").innerHTML = response.Success;
                setTimeout(() => {
                    document.getElementById("check").innerHTML = "";
                }, 3000);
                if (response.Success == "error invalid link") {
                    document.getElementById("check").innerHTML = "erreur lien invalide ou expiré";

                } else if (response.Success == "succes") {
                    document.getElementById("check").innerHTML = "mot de passe changé avec succès";
                }
                else if (response.Success == "error") {
                    document.getElementById("check").innerHTML = "une erreur s'est produite merci de réesayer plus tard";
                }
                else {
                    document.getElementById("check").innerHTML = "une erreur s'est produite merci de réesayer plus tard";
                }
            },
            error: () => {
            }
        })
    });
});