// Skill Level System
var SkillLevelSystem_Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    SkillLevelSystem_Game_Actor_initMembers.call(this);
    this._skillLevels = {};
};

Game_Actor.prototype.setSkillLevel = function(skillId, lv) {
    this._skillLevels[skillId] = lv;
};

Game_Actor.prototype.addSkillLevel = function(skillId) {
    this._skillLevels[skillId] ++;
};

Game_Actor.prototype.getSkillLevel = function(skillId) {
    return this._skillLevels[skillId];
};

Game_Actor.prototype.skillMaxLevel = function(skillId) {
    if ($dataSkills[skillId].cap) {
        return $dataSkills[skillId].cap;
    } else {
        return 5;
    }
};

Game_Actor.prototype.learnSkill = function(skillId) {
    if (!this.isLearnedSkill(skillId)) {
        this._skills.push(skillId);
        this.setSkillLevel(skillId, 1);
        this._skills.sort(function(a, b) {
            return a - b;
        });
    } else {
        if (this.getSkillLevel(skillId) < this.skillMaxLevel(skillId)) {
            this.addSkillLevel(skillId);
        }
    }
};

Game_Actor.prototype.calcSkillLevelValue = function(value, skillId) {
    return value[0] + (value[1] - value[0]) * (this.getSkillLevel(skillId) - 1) / (this.skillMaxLevel(skillId) - 1);
};

Game_Enemy.prototype.calcSkillLevelValue = function(value, skillId) {
    return value[1];
};

Game_Battler.prototype.calcEnchantLevelValue = function(param, skillId) {
    for (var key in param) {
        if (param[key] instanceof Array) {
            param[key] = this.calcSkillLevelValue(param[key], skillId);
        } else if (!(param[key] instanceof Number)) {
            param[key] = this.calcEnchantLevelValue(param[key], skillId);
        }
    }
    return param;
};