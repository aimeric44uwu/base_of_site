$(document).ready(() => {
    $("#form1").submit((event) => {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/register',
            data: $('#form1').serialize(),
            dataType: "json",
            success: (response) => {
                $('#form1')[0].reset();
                if (response.status != "Success") {
                    document.getElementById("check").style.color = "red";
                } else {
                    document.getElementById("check").style.color = "green";
                }
                document.getElementById("check").innerHTML = response.message;
                setTimeout(() => {
                    document.getElementById("check").innerHTML = "";
                    document.getElementById("check").style.color = "";
                }, 6000);
                if (response.status == "Success") {
                    setTimeout(() => {
                        document.getElementById("aa").click();
                    }, 3000);
                };
            },
            error: () => {
            }
        })
    });
});