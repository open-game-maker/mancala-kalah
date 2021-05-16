({
    lastChatIndex: 0,
    mPlayerId: null,
    //チャットリストから現在のゲーム状態を表示する
    drawCurrent: function(ui, chat, width, height) {
        var itemSize = Math.min(width / 8, height / 3, 100)
        var textSize = (itemSize / 3) * 2
        if (chat == null) {
            return
        }
        for (var index = chat.length - 1; index >= this.lastChatIndex; index--) {
            //ゲーム状態を取得する
            var parsedRawBody = chat[index].rawBody
            
            var shareState = null
            if (parsedRawBody.shareState != null && parsedRawBody.shareState.length > 0) {
                shareState = parsedRawBody.shareState[0];
            }
            if (shareState != null) {

                ui.register(0, 10, 10, textSize * 10, textSize);
                ui.addFillText(0, "black", "プレイヤー" + shareState[0] + "のターン", null);

                ui.register(1, itemSize - textSize, itemSize * 1.5 + 30, textSize, textSize);
                ui.addFillText(1, "black", shareState[1][1], null);

                ui.register(2, (itemSize * 7), itemSize * 1.5 + 30, textSize, textSize);
                ui.addFillText(2, "black", shareState[1][0], null);

                 //穴に入っている石の数を描画（上側）
                for (var index2 = 0; index2 < shareState[2][0].length; index2++) {
                    ui.register(index2 + 3, (itemSize + 1) * index2 + itemSize, itemSize * 2 + 10, itemSize, itemSize);
                    ui.addFillOval(index2 + 3, "#33aa7a");
                    ui.addFillText(index2 + 3, "black", shareState[2][0][index2], null);
                    if (this.mPlayerId == 0 || this.mPlayerId == null) {
                        //相手側では選択できないようにする
                        var i = ui.deepCopy(index2);
                        ui.setOnClickListener(index2 + 3, [i], function(obj){
                            ui.sendSlectionChat(null, 0, [obj[0]], null);
                        });
                    }
                    else {
                        // 前にセットしていた関数を消す
                        ui.setOnClickListener(index2 + 3, null, function(){});
                    }
                }

                //穴に入っている石の数を描画（下側）
                for (var index2 = 0; index2 < shareState[2][1].length; index2++) {
                    var index3 = shareState[2][1].length - index2 - 1
                    ui.register(index2 + 3 + shareState[2][0].length, (itemSize + 1) * index3 + itemSize, itemSize, itemSize, itemSize);
                    ui.addFillOval(index2 + 3 + shareState[2][0].length, "#33aa7a");
                    ui.addFillText(index2 + 3 + shareState[2][0].length, "black", shareState[2][1][index2], null);
                    if (this.mPlayerId == 1 || this.mPlayerId == null) {
                        var i = ui.deepCopy(index3);
                        ui.setOnClickListener(index2 + 3 + shareState[2][0].length, [i], function(obj) {
                            ui.sendSlectionChat(null, 0, [6 - 1 - obj[0]], null)
                        });
                    } 
                    else {
                        ui.setOnClickListener(index2 + 3 + shareState[2][0].length, null, function(){});
                    }
                }
            }
            else if (parsedRawBody.signalId == -1) {
                //プレイヤーIDをセット
                this.mPlayerId = parsedRawBody.signal
            }
        }

        this.lastChatIndex = chat.length

        ui.show();
    },
    onClick: function(ui, pageX, pageY) {
        //クリックした位置に存在するviewのリストを取得
        var ids = ui.getViews(pageX, pageY)
        ui.execViewProcess(ids);
    }
})