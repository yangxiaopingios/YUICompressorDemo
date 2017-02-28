$(function() {

    var lineChart = echarts.init(document.getElementById("echarts-line-chart"), "macarons");

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function getDayBefore(num) {
        var day1 = new Date();
        day1.setTime(day1.getTime() - num * 24 * 60 * 60 * 1000);
        return day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
    }

    var shop_info_before7Day = getDayBefore(7);
    var shop_info_yesterday = getDayBefore(1);
    var shop_info_date_s = shop_info_before7Day;
    var shop_info_date_e = shop_info_yesterday;
    var shop_info_did = '';

    var dateChoice_s = $(".dateChoice_s");
    dateChoice_s.attr('placeholder', shop_info_date_s);

    dateChoice_s.click(function() {
        laydate({
            istime: false,
            format: 'YYYY-MM-DD',
            max: shop_info_yesterday,
            start: shop_info_date_s,
            isclear: false,
            istoday: false,
            choose: function(dates) {
                shop_info_date_s = dates;
                shop_info_downlist(shop_info_date_s, shop_info_date_e);
            }
        });
    });

    var dateChoice_e = $(".dateChoice_e");
    dateChoice_e.attr('placeholder', shop_info_date_e);

    dateChoice_e.click(function() {
        laydate({
            istime: false,
            format: 'YYYY-MM-DD',
            max: shop_info_yesterday,
            start: shop_info_date_e,
            isclear: false,
            istoday: false,
            choose: function(dates) {
                shop_info_date_e = dates;
                shop_info_downlist(shop_info_date_s, shop_info_date_e);
            }
        });
    });

    function shop_info_downlist(sDate, eDate) {
        lineChart.showLoading({
            text: '正在努力的读取数据中...', //loading话术
        });
        $.ajax({
            type: "post",
            cache: false,
            data: {
                "did": shop_info_did,
                "sDate": sDate,
                "eDate": eDate
            },
            url: ih.domain + "/measure/downlist",
            dataType: "json",
            success: function(result) {
                lineChart.hideLoading();
                // console.log(JSON.stringify(result));
                if (result.code === '1') {
                    var msg_1 = result.msg;
                    var chart_data = [];
                    var chart_date = [];
                    for (var i = 0; i < msg_1.length; i++) {
                        chart_data.push(msg_1[i].days_num);
                        chart_date.push(msg_1[i].count_date);
                    }
                    lineChart.clear();
                    var lineoption = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            x: 40,
                            x2: 40
                        },
                        calculable: true,
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            data: chart_date
                        }],
                        yAxis: [{
                            type: 'value',
                        }],
                        series: [{
                            name: '测量次数',
                            type: 'line',
                            data: chart_data
                        }]
                    };
                    lineChart.setOption(lineoption);
                }
            },
            error: function(err) {
                jError('请求错误', {
                    HorizontalPosition: "center",
                    VerticalPosition: "center",

                });
                lineChart.hideLoading();
                console.log('err5: ');
                console.log(err);
            }
        });
    }

    lineChart.showLoading({
        text: '正在努力的读取数据中...', //loading话术
    });

    $.ajax({
        type: "post",
        cache: false,
        data: {
            "sid": GetQueryString("sid")
        },
        url: ih.domain + "/store/getinfo",
        dataType: "json",
        success: function(result) {
            // console.log(JSON.stringify(result));
            if (result.code === '1') {
                var msg = result.msg[0];
                $(".ih-shop-name-data").html(msg.name);
                $(".ih-shop-info-1-1").html(msg.name);
                $(".ih-shop-info-1-2").html(msg.contacts);
                $(".ih-shop-info-2-1").html(msg.address);
                $(".ih-shop-info-2-2").html(msg.phone);
                shop_info_did = msg.did;
                shop_info_downlist(shop_info_before7Day, shop_info_yesterday);
            } else {
                lineChart.hideLoading();
                jError(result.msg, {
                    HorizontalPosition: "center",
                    VerticalPosition: "center",

                });
            }
        },
        error: function(err) {
            jError('请求错误', {
                HorizontalPosition: "center",
                VerticalPosition: "center",

            });
            lineChart.hideLoading();
            console.log('err4: ');
            console.log(err);
        }
    });

    $(window).resize(lineChart.resize);
    $('#echarts-line-chart').height($(window).height() - 375);
    $(window).resize();

    $(window).bind('resize', function() {
        $('#echarts-line-chart').height($(window).height() - 375);
    });
});