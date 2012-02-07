
var WF = {
    
    debug: true,
    sessionid: "",
    
    ruleset: [
        'American',
        'Norwegian',
        'Dutch',
        'Danish',
        'Swedish',
        'English',
        'Spanish',
        'French',
        'Swedish (strict)'
    ],
    
    board_type: [
        'Normal',
        'Random'
    ],
    
    log: function (data) {
        if(arguments.length == 1) {
            console.log(data);
        } else {
            jQuery.each(arguments, function () { console.log(this); });
        }
    },
    
    load: function (options) {
        return jQuery.ajax({
            type: 'POST',
            url: 'proxy.php',
            dataType: 'json',
            data: {
                sessionid: WF.sessionid,
                url: options.url,
                data: options.data ? JSON.stringify(options.data) : '',
            },
            error: function () {
                (options.error || WF.log)('unknown');
            },
            success: function (data) {
                
                if(WF.debug) {
                    if(!(data && data.content && data.content.entries && data.content.entries.length == 0)) {
                        WF.log(data);
                    }
                }
                
                if(!data) {
                    (options.error || WF.log)('unknown');
                    return ;
                }
                
                if(data.sessionid) {
                    WF.sessionid = data.sessionid;
                }
                
                if(data.status == "success") {
                    (options.success || WF.log)(data.content);
                } else {
                    (options.error || WF.log)(data.content.type);
                }
                
            }
        });
    },
    
    
    
    
    
    login: function (options, success, error) {
        
        var url = null;
        var data = {};
        
        if(options.username) {
            url = 'user/login';
            data.username = options.username;
        }
        
        data.password = SHA1(options.password + "JarJarBinks9");
        
        return WF.load({
            url: url,
            data: data,
            success: success,
            error: error
        });
    },
    games: function (success, error) {
        return WF.load({
            url: 'user/games',
            success: success,
            error: error
        });
    },
    game: function (game_id, success, error) {
        return WF.load({
            url: 'game/' + game_id,
            success: success,
            error: error
        });
    },
    board: function (board_id, success, error) {
        return WF.load({
            url: 'board/' + board_id,
            success: success,
            error: error
        });
    }
};

WF.game.move = function (game_id, move, success, error) {
    return WF.load({
        url: 'game/' + game_id + '/move',
        data: { move: move },
        success: success,
        error: error
    });
};

WF.game.pass = function (game_id, success, error) {
    return WF.load({
        url: 'game/' + game_id + '/pass',
        success: success,
        error: error
    });
};

WF.game.swap = function (game_id, tiles, success, error) {
    return WF.load({
        url: 'game/' + game_id + '/swap',
        data: { tiles: tiles },
        success: success,
        error: error
    });
};

WF.game.chat = function (game_id, success, error) {
    return WF.load({
        url: 'game/' + game_id + '/chat',
        success: success,
        error: error
    });
};

WF.game.chat.send = function (game_id, message, success, error) {
    return WF.load({
        url: 'game/' + game_id + '/chat/send',
        data: { message: message },
        success: success,
        error: error
    });
};

WF.user = {};

WF.user.notifications = function (success, error) {
    return WF.load({
        url: 'user/notifications',
        success: success,
        error: error
    });
};

WF.user.password = {};

WF.user.password.set = function (pw, success, error) {
    return WF.load({
        url: 'user/password/set',
        data: { password: SHA1(pw + "JarJarBinks9") },
        success: success,
        error: error
    });
};

WF.invite = {};

WF.invite.new = function (invitee, ruleset, board_type, success, error) {
    return WF.load({
        url: 'invite/new',
        data: {
            invitee: invitee,
            ruleset: parseInt(ruleset, 10),
            board_type: (board_type==0?'normal':'random') /* Server needs this as a string :( */
        },
        success: success,
        error: error
    });
};

WF.random_request = {};

WF.random_request.create = function (ruleset, board_type, success, error) {
    return WF.load({
        url: 'random_request/create',
        data: {
            ruleset: parseInt(ruleset, 10),
            board_type: (board_type==0?'normal':'random') /* Server needs this as a string :( */
        },
        success: success,
        error: error
    });
};
