
({
    initialize: function(cgp, random, rule, mode) {
        var state = [0, [0, 0],
            [
                [4, 4, 4, 4, 4, 4],
                [4, 4, 4, 4, 4, 4]
            ]
        ];

        var selections = [
            [],
            []
        ];
        selections[state[0]].push(cgp.createPlayerSelect(0, 0, [state[0]]));

        var shares = cgp.newArray(2);
        shares[0].push([]);
        shares[1].push([]);

        var signal = cgp.newArray(mode.numberOfPlayer);
        for (var index = 0; index < mode.numberOfPlayer; index++) {
            
            signal[index].push([-1, index]);
        }

        return cgp.createGameNextResult(
            state,
            selections,
            shares,
            null,
            signal,
            null
        )
    },
    
    next: function(cgp, random, state, selectList, mode) {
        for (var playerIndex = 0; playerIndex < selectList.length; playerIndex++) {
            for (var selectIndex = 0; selectIndex < selectList[playerIndex].length; selectIndex++) {
                
                var select = selectList[playerIndex][selectIndex].playersSelection;
                

                var side = playerIndex
                var position = select[0];
                
                var moveRock = state[2][side][position];
                
                state[2][side][position] = 0;
                
                position++;

                rockFall:
                    while (true) {
                        
                        if (position >= state[2][side].length) {
                            
                            if (side == playerIndex) {
                                
                                state[1][side]++;
                                moveRock--;
                                if (moveRock <= 0) {
                                    
                                    break rockFall
                                }
                            }
                            
                            if (side == 0) {
                                side = 1
                            } else {
                                side = 0
                            }
                            position = 0;
                        } else {
                            
                            state[2][side][position]++;
                            moveRock--;
                            if (moveRock <= 0) {
                                var otherSide = (side == 0) ? 1 : 0;
                                
                                var otherPosition = (state[2][side].length - 1) - position
                                if ((state[2][side][position] <= 1) && (state[2][otherSide][otherPosition] > 0) && (side == playerIndex)) {
                                    
                                    state[1][side] += (state[2][side][position] + state[2][otherSide][otherPosition])
                                    state[2][side][position] = 0
                                    state[2][otherSide][otherPosition] = 0
                                }
                                
                                if (state[0] == 0) {
                                    state[0] = 1;
                                } else {
                                    state[0] = 0;
                                }
                                break rockFall
                            }
                            position++;
                        }
                    }
            }
        }

        var selections = cgp.newArray(2);
        selections[state[0]].push(cgp.createPlayerSelect(0, 0, [state[0]]));

        var shares = cgp.newArray(2);
        shares[0].push([]);
        shares[1].push([]);

        var winnerSet = null

        var sum0 = 0;
        for (var index = 0; index < state[2][0].length; index++) {
            sum0 += state[2][0][index]
        }
        var sum1 = 0;
        for (var index = 0; index < state[2][1].length; index++) {
            sum1 += state[2][1][index]
        }
        
        var finishFlag = false
        if (sum0 == 0) {
            
            for (var index = 0; index < state[2][1].length; index++) {
                state[2][1][index] = 0
            }
            state[1][1] += sum1;
            finishFlag = true;
        }
        if (sum1 == 0) {
            
            for (var index = 0; index < state[2][0].length; index++) {
                state[2][0][index] = 0
            }
            state[1][0] += sum0;
            finishFlag = true;
        }
        if (finishFlag) {
            if (state[1][0] > state[1][1]) {
                
                winnerSet = [1, 0]
            } else if (state[1][0] < state[1][1]) {
                
                winnerSet = [0, 1]
            } else {
                winnerSet = [0, 0]
            }
        }
        return cgp.createGameNextResult(
            state,
            selections,
            shares,
            null,
            null,
            winnerSet
        )
    },
    selectionConstraintsList: [{
        judge: function(
            cgp,
            selection,
            proof,
            shareState,
            selectionSignal
        ) {
            if (0 < shareState.getState([2, selectionSignal[0]])[selection[0]]) {
                return true
            }
            return false
        },
        /**
         * 選択可能な選択を少なくとも一つ返す
         * @param {*} shareState 
         * @param {*} selectionSignal
         * @returns 「可能な選択」の配列 
         */
        createDefault: function(
            cgp,
            shareState,
            selectionSignal
        ) {
            return [this.createAll(cgp, shareState, selectionSignal)[0]];
        },
        /**
         * すべての選択肢を生成する（許可される選択はすべて含んでいることを保証する）
         * できない場合はnullを返す。
         * @param {}} shareState 
         * @param {*} selectionSignal 
         */
        createAll: function(
            cgp,
            shareState,
            selectionSignal
        ) {
            var selections = []
            for (var count = 0; count < shareState.getState([2, selectionSignal[0]]).length; count++) {
                if (0 < shareState.getState([2, selectionSignal[0]])[count]) {
                    selections.push([
                        [count], null
                    ])
                }
            }
            return selections;
        }
    }]
})