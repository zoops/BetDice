(function ($) {
    // var money = $("#money").val(); //获取下注金额
    // var myNumber =$('#myNumber').html(); //获取投注的数字

    // 投注金额
    $('#Half').click(function () {
        $("#money").val(parseInt($("#money").val()) / 2);
    })
    $('#Double').click(function () {
        if ($("#money").val() > 4999) {
            $("#money").val('5000');
        } else {
            $("#money").val(parseInt($("#money").val()) * 2);
        }
    })
    $('#Max').click(function () {
        $("#money").val('5000');
    })


    // 进度条数字获取  $bt.html( parseInt(left / 6.5));
    var $box = $('#box');
    var $bt = $('#bt'); //选择的数
    var $result_bt = $('#result_bt'); //结果数字
    var $bg = $('#bg');
    var $bgcolor = $('#bgcolor');
    var $btn = $('#bt');
    var $text = $('#text');
    var statu = false;
    var ox = 0;
    var lx = 0;
    var left = 0;
    var bgleft = 0;
    $btn.mousedown(function (e) {
        lx = $btn.offset().left;
        ox = e.pageX - left;
        statu = true;
    });
    $(document).mouseup(function () {
        statu = false;
    });
    $box.mousemove(function (e) {
        if (statu) {
            left = e.pageX - ox;
            if (left < 0) {
                left = 0;
            }
            if (left > 650) {
                left = 650;
            }
            $btn.css('left', left);
            $bgcolor.width(left);
            $bt.html(parseInt(left / 6.5));
            $('#myNumber').html(parseInt(left / 6.5));

            $('#odds').html(Number(98 / (parseInt(left / 6.5) - 1)).toFixed(3) + 'x');//赔率计算
            $('#percent').html(Number( (parseInt(left / 6.5) / 98) * 100).toFixed(2) + '%' );//胜率计算

        }
    });
    $bg.click(function (e) {
        if (!statu) {
            bgleft = $bg.offset().left;
            left = e.pageX - bgleft;
            if (left < 0) {
                left = 0;
            }
            if (left > 650) {
                left = 650;
            }
            $btn.css('left', left);
            $bgcolor.stop().animate({ width: left }, 650);
            $bt.html(parseInt(left / 6.5));
            $('#myNumber').html(parseInt(left / 6.5));
            $('#odds').html(Number(98 / (parseInt(left / 6.5) - 1)).toFixed(3) + 'x');//赔率计算
            $('#percent').html(Number( (parseInt(left / 6.5) / 98) * 100).toFixed(2) + '%' );//胜率计算
        }
    });




    // 定义玩法函数
    var account = null;
    var eoss = null;
    var requiredFields = null;
    var tpAccount = null;
    // var money = $("#money").val();    // 钱
    // var myNumber = $('#myNumber').text();  //投注的数字

    var a = document.getElementById("#result");


    var init_scatter = function () {
        if (eoss != null) return;
        if (tpAccount != null) return;
        if (1) {
            if (!('scatter' in window)) {
                alert("没有找到Scatter.");
            } else {
                scatter.getIdentity({
                    accounts: [{
                        chainId: network.chainId,
                        blockchain: network.blockchain
                    }]
                })
                    .then(identity => {
                        setIdentity(identity);
                        // get_current_balance();
                        $("#loading").modal("hide");
                    })
                    .catch(err => {
                        $("#loading").modal("hide");
                        alert("Scatter 初始化失败.");
                    });
            }
        } else {
            //移动端
            tpConnected = tp.isConnected();
            if (tpConnected) {
                //test
                // app.tpBalance();
                tp.getWalletList("eos").then(function (data) {
                    tpAccount = data.wallets.eos[0];
                });
            } else {
                alert("请下载TokenPocket") //待完善
                $("#loading").modal("hide");
            }
        }
    };
    var setIdentity = function (identity) {

        account = identity.accounts.find(acc => acc.blockchain === 'eos');
        eoss = scatter.eos(network, Eos, {});
        requiredFields = {
            accounts: [network]
        };
        // get_current_balance();
    };

    //获取账户eos余额
    var get_current_balance = function () {
        this.eoss.getCurrencyBalance('eosio.token', this.account.name).then(function (resp) {
            console.log(resp);
            $('#balanceEos').text();
        });
    };
    //获取账户合约币余额
    // var get_current_balance = function () {
    //     this.eoss.getCurrencyBalance('yangshun2534', this.account.name).then(function (resp) {
    //         console.log(resp);
    //     });
    // };

    var roll_by_scatter = function () {
        eoss.transfer(account.name, "yangshun2532", "0.0001 EOS", $('#myNumber').html())
            .then((resp) => {
                console.log(resp);
                $("#loading").modal("hide");
                function TraversalObject(obj) {
                    for (var a in obj) {
                        if (a == "random_roll") {
                            console.log(obj[a]);
                            $("#random").text(obj[a]);
                            break;
                        };
                        if (typeof (obj[a]) == "object") {
                            TraversalObject(obj[a]); //递归遍历
                        }
                    }
                    for (var b in obj) {
                        if (b == "payout") {
                            console.log(obj[b]);
                            $("#get_money").text(obj[b]);
                            $("#result").addClass("result_animation");
                            setTimeout('$("#result").removeClass("result_animation");', 4000);
                            break;
                        };
                        if (typeof (obj[b]) == "object") {
                            TraversalObject(obj[b]); //递归遍历
                        }
                    }
                }
                TraversalObject(resp);

            })
            .catch((err) => {
                $("#loading").modal("hide");
                console.log(JSON.stringify(err));

            });
        $("#loading").modal("hide");
    };





    //保留4位小数并格式化输出（不足的部分补0）
    var fomatFloat = function (value, n) {
        var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            s += '.';
        }
        for (var i = s.length - s.indexOf('.'); i <= n; i++) {
            s += "0";
        }
        return s;
    }


    // play
    $('#play').click(function () {
        $(".modal.loading").modal("show");
        init_scatter();
        roll_by_scatter();
        get_current_balance();
    })
})(jQuery);
