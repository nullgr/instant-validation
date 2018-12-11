// TODO add tests here
function isStateValid(validationState) {
    var keys = Object.keys(validationState);
    for (var i = 0; i < keys.length; i++) {
        var item = validationState[keys[i]];
        if (item.statuses.filter(function (status) { return !status; }).length > 0) {
            return false;
        }
    }
    return true;
}
export { isStateValid };
