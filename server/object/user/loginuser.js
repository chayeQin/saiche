// 登录用户对象
class clsLoginUser {
    constructor(vfd) {
        this.vfd = vfd;
        this.id = 0;
        this.ip = null;
        this.start = new Date().getTime();
        this.setState("state");
        this.name = "";
        this.isNewBirth = false;
    }

    getVfd() {
        return this.vfd;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setState(state) {
        this.state = state;
    }

    setIp(ip) {
        this.ip = ip;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setNewBirth(isNewBirth) {
        this.isNewBirth = isNewBirth;
    }

    getNewBirth() {
        return this.isNewBirth;
    }
}
module.exports = clsLoginUser;
