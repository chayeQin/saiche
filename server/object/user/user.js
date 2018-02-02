// 玩家对象
var SECOND = 1000;
var MAX_IDLE_TIME = SECOND * 15;

//var logger = getLogger("user");
var logger = singleLogger();

class clsUser extends CHAR.clsChar {
    constructor(vfd, OCI) {
        super(OCI);
        console.assert(vfd);
        this.setVfd(vfd);
    }

    onCreate(OCI) {
        console.assert(OCI.id);
        console.assert(OCI.name);

        if (typeof(OCI.jetton) === "undefined") OCI.jetton = 0;
        if (typeof(OCI.roomcard) === "undefined") OCI.roomcard = 0;
        if (typeof(OCI.birthday) === "undefined") OCI.birthday = new Date().getTime();

        this.setId(OCI.id);
        this.setName(OCI.name);
        this.setJetton(OCI.jetton); // 筹码
        this.setRoomcard(OCI.roomcard); // 房卡
        this.setIp(OCI.ip);
        this.setBirthday(OCI.birthday);
    }

    _getBindVars() {
        return ["vfd", "id", "name", "jetton", "roomcard", "ip", "birthday"];
    }

    checkIdle() {
        var nowtime = new Date().getTime();
        var heartbeatTime = this.getVar("HEARTBEAT_TIME") || -1;
        if (heartbeatTime <= 0) {
            this.setVar("HEARTBEAT_TIME", nowtime);
            return;
        }

        if (nowtime - heartbeatTime > MAX_IDLE_TIME) {
            this.kickout()
            return;
        }

        var opTime = this.getVar("GAME_OP_TIME") || -1;
        if (opTime <= 0) {
            this.setVar("GAME_OP_TIME", nowtime);
            return;
        }

        if (nowtime - opTime > MAX_IDLE_TIME) {
            this.kickout()
        }
    }

    heartbeat() {
        if (NETWORK.hasVfd(this.getVfd()) == false) {
            this.logout();
            return;
        }

        this.checkIdle();
    }

    sync() {
        var oci = {
            "userid": this.getId(),
            "username": this.getName(),
            "jetton": this.getJetton(),
            "roomcard": this.getRoomcard(),
            "birthday": this.getBirthday(),
        }
        for_caller.c_user(this.getVfd(), oci);
    }

    onCreateNewUser() {
    }

    restore() {
        USERMGR.addUserObj(this);
        this.sync();
        this.loginCheck();

        var self = this;
        CALLOUT.objCallFre(this, function() {
            self.heartbeat();
        }, SECOND * 5);

        logger.info("restore, userId=%s", this.getId());
    }

    loginCheck() {
    }

    logout() {
        USERMGR.removeUserObj(this);
        RACINGMGR.removeUser(this.getId());

        this.destroy();
        logger.info("logout, userId=%s", this.getId());
    }

    kickout() {
        var vfd = this.getVfd()
        NETWORK.closeClient(vfd);
        this.logout();
        logger.info("kickout, vfd=%s,userId=%s", vfd, this.getId());
    }

    getRoom() {
        var roomId = this.getVar("roomId");
        return MUSHIMGR.getRoom(roomId);
    }

    updateOpTime() {
        this.setVar("GAME_OP_TIME", new Date().getTime());
    }
}

exports.clsUser = clsUser;

