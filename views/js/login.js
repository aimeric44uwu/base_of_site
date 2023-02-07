$(document).ready(() => {
    $("#form").submit((event) => {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/login',
            data: $('#form').serialize(),
            dataType: "json",
            success: (response) => {
                $('#form')[0].reset();
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
                    document.getElementById("aa").click();
                };
            },
            error: () => {
            }
        })
    });

});