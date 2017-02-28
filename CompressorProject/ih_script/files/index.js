$(function() {
    //菜单点击
    $(".J_menuItem").on('click', function() {
        var url = $(this).attr('href');
        $("#J_iframe").attr('src', url);
        return false;
    });
    $(".ih_statistics_exit").click(function() {
        window.sessionStorage.removeItem('ih_code');
        window.localStorage.removeItem('ih_code');
        window.localStorage.removeItem('ih_account');
        window.location.href = 'login_v2.html';
    });

    // function GetQueryString(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //     var r = window.location.search.substr(1).match(reg);
    //     if (r != null) return unescape(r[2]);
    //     return null;
    // }

    $(".ih_accout").html(localStorage.getItem('ih_account'));
});