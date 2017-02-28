$(function() {
    function getYesterday() {
        var day1 = new Date();
        day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
        return day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
    }
    var yesterday = getYesterday();
    var ih_city_code = 0;
    var ih_date = yesterday;
    var index_content_downlist_first = true;
    var dayNumOrder = -1;
    var countNumOrder = -1;

    $(".dateChoice").attr('placeholder', yesterday);

    $(".export_excel").click(function() {
        // console.log(123);
        $.ajax({
            type: "post",
            cache: false,
            data: {
                "countDate": ih_date,
                "cityCode": ih_city_code,
                "dayNumOrder": dayNumOrder,
                "countNumOrder": countNumOrder
            },
            url: ih.domain + "/store/exportExcel",
            dataType: "json",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.code === '1') {
                    window.location.href = result.url;
                } else {
                    jError("测量总次数请求code有错误", {
                        HorizontalPosition: "center",
                        VerticalPosition: "center",

                    });
                }
            },
            error: function(err) {
                jError("请求有错误", {
                    HorizontalPosition: "center",
                    VerticalPosition: "center",

                });
                console.log('err10: ');
                console.log(err);
            }
        });
    });

    $.ajax({
        type: "post",
        cache: false,
        data: {},
        url: ih.domain + "/measure/count",
        dataType: "json",
        success: function(result) {
            // console.log(JSON.stringify(result));
            if (result.code === '1') {
                $('.ih_count').html(result.msg.count);
                $('.ih_scanCount').html(result.msg.scanCount);
            } else {
                jError("测量总次数请求code有错误", {
                    HorizontalPosition: "center",
                    VerticalPosition: "center",

                });
            }
        },
        error: function(err) {
            jError("请求有错误", {
                HorizontalPosition: "center",
                VerticalPosition: "center",

            });
            console.log('err1: ');
            console.log(err);
        }
    });

    function downShopList(cityCode, countDate) {
        $.ajax({
            type: "post",
            cache: false,
            data: {
                "cityCode": cityCode,
                "countDate": countDate
            },
            url: ih.domain + "/store/downlist",
            dataType: "json",
            success: function(result) {
                // console.log(JSON.stringify(result));
                if (result.code === '1') {

                    if (index_content_downlist_first) {
                        index_content_downlist_first = false;
                        $.jgrid.defaults.styleUI = 'Bootstrap';

                        $("#table_list_1").jqGrid({
                            data: result.msg,
                            datatype: "local",
                            height: 350,
                            autowidth: true,
                            shrinkToFit: true,
                            rowNum: 25,
                            rowList: [25, 50, 75],
                            colNames: ['门店名称', '门店联系方式', '当日测量次数', '累计测量次数', '操作'],
                            colModel: [{
                                name: 'name',
                                index: 'name',
                                width: 150,
                                align: "center",
                                sortable: false
                            }, {
                                name: 'phone',
                                index: 'phone',
                                width: 90,
                                align: "center",
                                sortable: false
                            }, {
                                name: 'days_num',
                                index: 'days_num',
                                width: 60,
                                align: "center",
                                sorttype: "int"
                            }, {
                                name: 'count_num',
                                index: 'count_num',
                                width: 60,
                                align: "center",
                                sorttype: "int",
                            }, {
                                name: 'sid',
                                index: 'sid',
                                width: 80,
                                align: "center",
                                sortable: false,
                                formatter: function(cellvalue, options, rowObj) {
                                    return "<a href='shop-info.html?sid=" + cellvalue + "'>查看详情</a>"
                                }
                            }],
                            pager: "#pager_list_1",
                            viewrecords: true,
                            hidegrid: false,
                            onSortCol: function(index, iCol, sortorder) {
                                if (index === 'days_num') {
                                    countNumOrder = -1;
                                    if (sortorder === 'asc') {
                                        dayNumOrder = 1;
                                    } else if (sortorder === 'desc') {
                                        dayNumOrder = 0;
                                    }

                                } else if (index === 'count_num') {
                                    dayNumOrder = -1;
                                    if (sortorder === 'asc') {
                                        countNumOrder = 1;
                                    } else if (sortorder === 'desc') {
                                        countNumOrder = 0;
                                    }
                                }
                            }
                        });

                        $(window).bind('resize', function() {
                            var width = $('.jqGrid_wrapper').width();
                            $('#table_list_1').setGridWidth(width);
                            $('#table_list_1').setGridHeight($(window).height() - 355);
                        });
                    } else {
                        $("#table_list_1").jqGrid('clearGridData');
                        $("#table_list_1").jqGrid("setGridParam", {
                            data: result.msg
                        }).trigger("reloadGrid");
                    }

                    // Add responsive to jqGrid
                    var width = $('.jqGrid_wrapper').width();
                    $('#table_list_1').setGridWidth(width);
                    $('#table_list_1').setGridHeight($(window).height() - 355);
                    $("span.s-ico", document.getElementById('table_list_1_count_num')).show();
                    $("span.s-ico", document.getElementById('table_list_1_days_num')).show();
                } else {
                    jError("店面列表信息下载请求code有错误", {
                        HorizontalPosition: "center",
                        VerticalPosition: "center",

                    });
                }
            },
            error: function(err) {
                jError("请求有错误", {
                    HorizontalPosition: "center",
                    VerticalPosition: "center",

                });
                console.log('err3: ');
                console.log(err);
            }
        });
    }

    downShopList(ih_city_code, ih_date);

    $(".dateChoice").click(function() {
        laydate({
            istime: false,
            format: 'YYYY-MM-DD',
            max: yesterday,
            start: yesterday,
            isclear: false,
            istoday: false,
            // issure: false,
            choose: function(dates) {
                ih_date = dates;
                downShopList(ih_city_code, ih_date);
            }
        });
    });

    $.ajax({
        type: "post",
        cache: false,
        data: {},
        url: ih.domain + "/basicdata/city",
        dataType: "json",
        success: function(result) {
            // console.log(JSON.stringify(result));
            var cityMsg = [];
            for (var i = 0; i < result.msg.length; i++) {
                switch (result.msg[i].name) {
                    case '北京市':
                    case '天津市':
                    case '重庆市':
                    case '上海市':
                        {
                            console.log(result.msg[i].name);
                            result.msg[i].city.push({ "id": result.msg[i].id, "name": result.msg[i].name });
                            cityMsg.push(result.msg[i]);
                            break;
                        }
                    default:
                        {
                            if (result.msg[i].city.length !== 0) {
                                cityMsg.push(result.msg[i]);
                            }
                        }
                }
            }
            // console.log(cityMsg);
            if (result.code === '1') {
                var cityData1 = {
                    hot: [{
                        'pid': 100,
                        'pname': '全部省份',
                        'id': 0,
                        'name': '全部'
                    }],
                    province: cityMsg
                };
                var cityPicker = new IIInsomniaCityPicker({
                    data: cityData1,
                    target: '#cityChoice',
                    valType: 'k-v',
                    hideCityInput: '#city',
                    hideProvinceInput: '#province',
                    callback: function(city_id) {
                        ih_city_code = city_id;
                        downShopList(ih_city_code, ih_date);
                    }
                });

                cityPicker.init();
            } else {
                jError("省市字典信息下载请求code有错误", {
                    HorizontalPosition: "center",
                    VerticalPosition: "center",

                });
            }
        },
        error: function(err) {
            jError("请求有错误", {
                HorizontalPosition: "center",
                VerticalPosition: "center",

            });
            console.log('err2: ');
            console.log(err);
        }
    });
});