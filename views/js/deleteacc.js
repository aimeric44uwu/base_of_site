$(document).ready(() => {
    $("#form").submit((event) => {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/delacc',
            data: $('#form').serialize(),
            dataType: "json",
            success: (response) => {
                $('#form')[0].reset();
                if (response.status != "success") {
                    document.getElementById("check").style.color = "red";
                } else {
                    document.getElementById("check").style.color = "green";
                }
                document.getElementById("check").innerHTML = response.message;
                setTimeout(() => {
                    document.getElementById("check").innerHTML = "";
                    document.getElementById("check").style.color = "";
                }, 6000);
                if (response.status == "success") {
                    document.getElementById("aa").click();
                };
            },
            error: () => {
            }
        })
    });

});