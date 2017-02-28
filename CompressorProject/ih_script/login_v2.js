$(function() {
    $(".btn-login").click(function() {
        var $btn = $(this).button('loading');
        var ih_account = $(".uname").val();
        $.ajax({
            type: "post",
            cache: false,
            data: {
                "username": ih_account,
                "pwd": $(".pword").val()
            },
            url: ih.domain + "/sys/loginin",
            dataType: "json",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.code === '1') {
                    if (document.getElementById("autoLogin").checked) {
                        window.localStorage.setItem('ih_code', '1');
                        window.localStorage.setItem('ih_account', ih_account);
                    } else {
                        window.sessionStorage.setItem('ih_code', '1');
                        window.localStorage.setItem('ih_account', ih_account);
                    }
                    window.location.href = 'index.html';
                } else {
                    jError(result.msg, {
                        HorizontalPosition: "center",
                        VerticalPosition: "center",

                    });
                }
                $btn.button('reset');
            },
            error: function(err) {
                jError("请求有错误", {
                    HorizontalPosition: "center",
                    VerticalPosition: "center",

                });
                $btn.button('reset');
                console.log('err1: ');
                console.log(err);
            }
        });
    });
});