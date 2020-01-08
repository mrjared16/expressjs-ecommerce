exports.getDateFormat = (date) => {
    const _date = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${_date}/${month}/${year}, ${hour}:${minute}`;
}